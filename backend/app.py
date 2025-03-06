from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import livekit.api
import uuid
import json
import os
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="LiveKit Integration API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LiveKit configuration
LIVEKIT_API_KEY = os.environ.get("LIVEKIT_API_KEY", "APIGHk5WNNujAbx")
LIVEKIT_API_SECRET = os.environ.get("LIVEKIT_API_SECRET", "YourLiveKitSecretKey")  # Replace with your actual secret
LIVEKIT_URL = os.environ.get("LIVEKIT_URL", "wss://creatigen-hptldaij.livekit.cloud")

# Models
class TokenRequest(BaseModel):
    user_id: str
    room_name: str
    metadata: Optional[dict] = None

class SessionRequest(BaseModel):
    user_id: str
    room_name: str

class ErrorResponse(BaseModel):
    error: str
    details: Optional[str] = None

# Token generation endpoint
@app.post("/api/audio/token")
async def create_token(request: TokenRequest):
    try:
        logger.info(f"Token request received for user {request.user_id} in room {request.room_name}")
        
        # Create a LiveKit AccessToken
        at = livekit.api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
        
        # Set token identity (participant name)
        at.identity = request.user_id
        
        # Set token validity
        at.set_validity(ttl=3600)  # 1 hour
        
        # Grant permissions
        grant = livekit.api.VideoGrant(
            room_join=True,
            room=request.room_name,
            can_publish=True,
            can_subscribe=True
        )
        at.add_grant(grant)
        
        # Important: Convert metadata to JSON string
        metadata = {}
        if request.metadata:
            metadata = request.metadata
        
        # Add session ID to metadata
        session_id = str(uuid.uuid4())
        metadata["session_id"] = session_id
        
        # Metadata MUST be a JSON string for LiveKit
        at.metadata = json.dumps(metadata)
        
        # Generate the token
        token = at.to_jwt()
        
        logger.info(f"Token generated successfully for session {session_id}")
        
        return {
            "token": token,
            "session_id": session_id,
            "room": request.room_name,
            "user_id": request.user_id
        }
    
    except Exception as e:
        logger.error(f"Error generating token: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Initialize a session
@app.post("/api/audio/initialize", status_code=201)
async def initialize_session(request: SessionRequest):
    try:
        logger.info(f"Initializing session for user {request.user_id} in room {request.room_name}")
        
        # Create a session ID
        session_id = str(uuid.uuid4())
        
        # Generate token with session_id in metadata
        at = livekit.api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
        at.identity = request.user_id
        at.set_validity(ttl=3600)
        
        grant = livekit.api.VideoGrant(
            room_join=True,
            room=request.room_name,
            can_publish=True,
            can_subscribe=True
        )
        at.add_grant(grant)
        
        # Metadata must be a JSON string
        metadata = {"session_id": session_id}
        at.metadata = json.dumps(metadata)
        
        token = at.to_jwt()
        
        logger.info(f"Session initialized: {session_id} in room {request.room_name}")
        
        return {
            "session_id": session_id,
            "token": token,
            "room": request.room_name
        }
    
    except Exception as e:
        logger.error(f"Error initializing session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Terminate a session
@app.delete("/api/audio/terminate/{session_id}")
async def terminate_session(session_id: str):
    try:
        logger.info(f"Terminating session: {session_id}")
        
        # In a production app, you might want to:
        # 1. Validate the session exists
        # 2. Clean up any resources
        # 3. Notify LiveKit to disconnect the user if needed
        
        return {"status": "success", "message": f"Session {session_id} terminated"}
    
    except Exception as e:
        logger.error(f"Error terminating session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
