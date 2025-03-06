"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Mic,
  MicOff,
  StopCircle,
  Upload,
  Video,
  VideoOff,
  AlertCircle,
  X,
  Brain,
  MessageSquare,
  Loader2,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  RemoteTrackPublication,
  Track,
  ConnectionState,
  ParticipantEvent,
  Participant,
  LocalParticipant,
} from "livekit-client";
import { useNavigateBack } from "@/hooks/useNavigateBack";

export default function CreativeAgentInterface() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Ready to connect");
  const [connectionProgress, setConnectionProgress] = useState<string | null>(
    null
  );
  const [room, setRoom] = useState<Room | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [agentResponse, setAgentResponse] = useState<string>("");
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const navigateBack = useNavigateBack();
  const [apiBaseUrl, setApiBaseUrl] = useState(
    "http://localhost:8000/api/audio"
  );
  const [livekitUrl, setLivekitUrl] = useState(
    "wss://creatigen-hptldaij.livekit.cloud"
  );

  // Fetch LiveKit token
  const fetchToken = async (userId: string, roomName: string) => {
    try {
      console.log("🔑 [TOKEN] Beginning token fetch process", {
        endpoint: `${apiBaseUrl}/token`,
        userId,
        roomName,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch(`${apiBaseUrl}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          room_name: roomName,
          metadata: { name: userId }, // Send metadata as an object, not as a stringified JSON
          can_publish: true,
          can_subscribe: true,
          ttl: 3600,
        }),
      });

      // Log request details for debugging
      console.log(`🔄 [TOKEN] API Request to ${apiBaseUrl}/token:`, {
        headers: { "Content-Type": "application/json" },
        body: {
          user_id: userId,
          room_name: roomName,
          metadata: { name: userId }, // Logging the object as sent
          can_publish: true,
          can_subscribe: true,
          ttl: 3600,
        },
        timestamp: new Date().toISOString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ [TOKEN] Error response: ${response.status} ${response.statusText}`,
          { errorDetails: errorText }
        );
        throw new Error(
          `Failed to fetch token: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log(`✅ [TOKEN] API Response (${response.status}):`, {
        status: response.status,
        hasToken: !!data.token,
        tokenLength: data.token ? data.token.length : 0,
        tokenFirstChars: data.token
          ? data.token.substring(0, 15) + "..."
          : "N/A",
        roomName: data.room_name,
        userId: data.user_id,
        timestamp: new Date().toISOString(),
      });

      // Verify token format (should be JWT)
      if (data.token) {
        const tokenParts = data.token.split(".");
        console.log(`🔍 [TOKEN] Token format check:`, {
          isJWT: tokenParts.length === 3,
          parts: tokenParts.length,
          timestamp: new Date().toISOString(),
        });
      }

      return data.token;
    } catch (error) {
      console.error("❌ [TOKEN] Error fetching token:", error);
      throw error;
    }
  };

  // Initialize voice agent
  const initializeVoiceAgent = async (userId: string, roomName: string) => {
    try {
      console.log("🚀 [INITIALIZE] Beginning voice agent initialization", {
        endpoint: `${apiBaseUrl}/initialize`,
        userId,
        roomName,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch(`${apiBaseUrl}/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          room_name: roomName,
        }),
      });

      // Log request details for debugging
      console.log(`🔄 [INITIALIZE] API Request to ${apiBaseUrl}/initialize:`, {
        headers: { "Content-Type": "application/json" },
        body: {
          user_id: userId,
          room_name: roomName,
        },
        timestamp: new Date().toISOString(),
      });

      if (!response.ok) {
        console.error(
          `❌ [INITIALIZE] Error response: ${response.status} ${response.statusText}`
        );
        throw new Error(`Failed to initialize voice agent: ${response.status}`);
      }

      const responseText = await response.text();
      console.log(`🔍 [INITIALIZE] Raw response:`, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log(`✅ [INITIALIZE] Parsed response:`, {
          hasSessionId: !!data.session_id,
          hasToken: !!data.token,
          hasRoomName: !!data.room_name,
          sessionId: data.session_id || "N/A",
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.warn(
          `⚠️ [INITIALIZE] Could not parse JSON response, treating as plain text:`,
          responseText
        );
        // Handle case where response is plain text (like a UUID)
        if (responseText && responseText.trim()) {
          data = { session_id: responseText.trim() };
        } else {
          throw new Error("Invalid response from server");
        }
      }

      return data;
    } catch (error) {
      console.error("❌ [INITIALIZE] Error initializing voice agent:", error);
      throw error;
    }
  };

  // Cleanup function to ensure resources are properly released
  const cleanupConnection = useCallback(() => {
    if (room) {
      try {
        console.log("🧹 [CLEANUP] Cleaning up LiveKit room connection", {
          roomName: room.name,
          connectionState: room.connectionState,
          timestamp: new Date().toISOString(),
        });
        room.disconnect();
      } catch (e) {
        console.error("❌ [CLEANUP] Error during room disconnect:", e);
      }
      setRoom(null);
    }

    setIsConnected(false);
    setIsConnecting(false);
    setConnectionProgress(null);

    // Terminate the session on the backend
    if (sessionId) {
      try {
        console.log(`🔄 [CLEANUP] Terminating backend session`, {
          sessionId,
          endpoint: `${apiBaseUrl}/terminate/${sessionId}`,
          timestamp: new Date().toISOString(),
        });

        fetch(`${apiBaseUrl}/terminate/${sessionId}`, {
          method: "DELETE",
        })
          .then((response) => {
            console.log(`✅ [CLEANUP] Session termination response:`, {
              status: response.status,
              ok: response.ok,
              timestamp: new Date().toISOString(),
            });
          })
          .catch((error) => {
            console.error(`❌ [CLEANUP] Session termination error:`, error);
          });
      } catch (e) {
        console.error(`❌ [CLEANUP] Error during session termination:`, e);
      }
    }
  }, [room, sessionId, apiBaseUrl]);

  // Ensure cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupConnection();
    };
  }, [cleanupConnection]);

  // Connect to voice agent
  const connectToVoiceAgent = useCallback(async () => {
    // Create a cleanup timer to ensure we don't get stuck in connecting state
    const connectionTimeout = setTimeout(() => {
      if (isConnecting) {
        console.error("Connection attempt timed out");
        cleanupConnection();
        setStatusMessage("Connection timed out. Please try again.");
      }
    }, 30000); // 30 second timeout

    try {
      setIsConnecting(true);
      setStatusMessage("Initializing voice session...");
      setConnectionProgress("Preparing connection");

      // Generate unique IDs for this session
      const userId = `user-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      const roomName = `room-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      console.log("🔄 [CONNECT] Beginning connection sequence with:", {
        userId,
        roomName,
        timestamp: new Date().toISOString(),
      });

      // Step 1: Get LiveKit token first
      setConnectionProgress("Obtaining token");
      console.log("🔄 [CONNECT] Step 1: Requesting LiveKit token");
      const token = await fetchToken(userId, roomName);

      if (!token) {
        throw new Error("Failed to obtain a valid token");
      }

      // Step 2: Initialize the voice agent session
      setConnectionProgress("Initializing agent");
      console.log("🔄 [CONNECT] Step 2: Initializing voice agent");
      const sessionData = await initializeVoiceAgent(userId, roomName);

      if (!sessionData || !sessionData.session_id) {
        throw new Error("Failed to initialize voice agent session");
      }

      // Set the session ID from the response
      const newSessionId = sessionData.session_id;
      console.log("✅ [CONNECT] Got session ID:", newSessionId);
      setSessionId(newSessionId);

      // Step 3: Connect to LiveKit with the token
      setConnectionProgress("Connecting to LiveKit");
      console.log("🔄 [CONNECT] Step 3: Connecting to LiveKit");

      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        // Enable noise suppression and echo cancellation
        audioCaptureDefaults: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        },
      });

      // Set up room event handlers before connecting
      setupRoomEventHandlers(newRoom);

      // Connect with retry mechanism
      let connected = false;
      let retryCount = 0;
      const maxRetries = 3;

      while (!connected && retryCount < maxRetries) {
        try {
          console.log(
            `🔄 [LIVEKIT] Connection attempt ${retryCount + 1}/${maxRetries}`,
            {
              livekitUrl,
              roomName,
              tokenLength: token ? token.length : 0,
              tokenFirstChars: token ? token.substring(0, 15) + "..." : "N/A",
              timestamp: new Date().toISOString(),
            }
          );

          setConnectionProgress(
            `Connecting to LiveKit (Attempt ${retryCount + 1}/${maxRetries})`
          );

          // Connect to LiveKit
          await newRoom.connect(livekitUrl, token, {
            autoSubscribe: true,
          });

          console.log(`✅ [LIVEKIT] Connection successful!`, {
            roomName: newRoom.name,
            roomSid: newRoom.sid,
            localParticipantIdentity:
              newRoom.localParticipant?.identity || "unknown",
            // Safely access participants if it exists
            remoteParticipantsCount: newRoom.participants
              ? Object.keys(newRoom.participants).length
              : 0,
            connectionState: newRoom.connectionState,
            timestamp: new Date().toISOString(),
          });

          connected = true;
          setRoom(newRoom);

          // Additional connection details for diagnostics
          console.log(`📊 [LIVEKIT] Room details:`, {
            metadata: newRoom.metadata,
            serverRegion: newRoom.serverRegion,
            serverVersion: newRoom.serverVersion,
            simulcastEnabled: newRoom.simulcastEnabled,
            timestamp: new Date().toISOString(),
          });

          // After successful connection, set up participant event handling
          setupParticipantHandlers(newRoom);

          // Setup WebSocket connection for backend communication
          setConnectionProgress("Establishing agent session");
          await setupWebSocketConnection(newSessionId);

          setIsConnected(true);
          setIsConnecting(false);
          setStatusMessage(`Connected to voice agent. Room: ${newRoom.name}`);
          setConnectionProgress(null);

          // Clear the timeout since we connected successfully
          clearTimeout(connectionTimeout);
        } catch (error) {
          console.error(
            `❌ [LIVEKIT] Connection error (attempt ${
              retryCount + 1
            }/${maxRetries}):`,
            error
          );

          // Get more details about the error
          let errorDetails = {
            message: error.message,
            name: error.name,
            stack: error.stack?.split("\n")[0] || "No stack",
            timestamp: new Date().toISOString(),
          };

          if (error.code) {
            errorDetails.code = error.code;
          }

          console.error(`🔍 [LIVEKIT] Error details:`, errorDetails);

          retryCount++;

          if (retryCount < maxRetries) {
            console.log(`⏳ [LIVEKIT] Retrying in 2 seconds...`);
            setConnectionProgress(
              `Connection failed, retrying in 2 seconds...`
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            console.error(`❌ [LIVEKIT] All connection attempts failed`);
            setStatusMessage("Failed to connect. Please try again.");
            cleanupConnection();
            clearTimeout(connectionTimeout);
            throw error;
          }
        }
      }

      setIsConnected(true);
      setStatusMessage("Connected to Creative Agent");
      setConnectionProgress(null);
      setConversationHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hello! I'm your Creative Agent. How can I help you today with your creative projects? Feel free to discuss ideas, ask for feedback, or explore new concepts.",
        },
      ]);
    } catch (error) {
      console.error("Connection error:", error);
      cleanupConnection();
      setStatusMessage(
        `Connection error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      clearTimeout(connectionTimeout);
    }
  }, [apiBaseUrl, livekitUrl, cleanupConnection]);

  // Disconnect from voice agent
  const disconnectFromVoiceAgent = useCallback(async () => {
    try {
      setStatusMessage("Disconnecting from Creative Agent...");

      if (room) {
        // Disconnect from LiveKit room
        room.disconnect();
        setRoom(null);
      }

      if (sessionId) {
        try {
          // Terminate session via API
          console.log("Attempting to terminate session with ID:", sessionId);

          const response = await fetch(`${apiBaseUrl}/terminate/${sessionId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error terminating session:", errorText);
            // Continue with disconnection process even if termination fails
          } else {
            console.log("Session terminated successfully");
          }
        } catch (terminateError) {
          // Log but don't throw, so we still clean up the UI state
          console.error("Error during session termination:", terminateError);
        }
      }

      // Clean up local state regardless of termination success
      setIsConnected(false);
      setSessionId(null);
      setStatusMessage("Disconnected from Creative Agent");

      // Reset state but keep conversation history for reference
      setTranscription("");
      setAgentResponse("");
    } catch (error) {
      console.error("Error disconnecting:", error);
      setStatusMessage(
        `Disconnection error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Make sure we clean up state even if there's an error
      setIsConnected(false);
      setSessionId(null);
    }
  }, [room, sessionId, apiBaseUrl]);

  // Toggle microphone mute state
  const toggleMute = useCallback(() => {
    if (room) {
      try {
        if (isMuted) {
          room.localParticipant.unmuteTracks();
          setStatusMessage("Microphone unmuted");
        } else {
          room.localParticipant.muteTracks();
          setStatusMessage("Microphone muted");
        }
        setIsMuted(!isMuted);
      } catch (error) {
        console.error("Error toggling mute:", error);
        setStatusMessage(
          `Error toggling microphone: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  }, [room, isMuted]);

  // Toggle agent audio mute state
  const toggleAudioMute = useCallback(() => {
    if (room) {
      try {
        const remoteParticipants = Array.from(room.remoteParticipants.values());
        const agentParticipant = remoteParticipants.find((p) =>
          p.identity.includes("agent")
        );

        if (agentParticipant) {
          const audioTracks = Array.from(agentParticipant.audioTracks.values());

          audioTracks.forEach((track) => {
            if (isAudioMuted) {
              track.unmute();
            } else {
              track.mute();
            }
          });

          setIsAudioMuted(!isAudioMuted);
          setStatusMessage(
            isAudioMuted ? "Agent audio unmuted" : "Agent audio muted"
          );
        } else {
          setStatusMessage("No agent participant found to mute/unmute");
        }
      } catch (error) {
        console.error("Error toggling audio mute:", error);
        setStatusMessage(
          `Error toggling agent audio: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  }, [room, isAudioMuted]);

  // Setup WebSocket connection for real-time communication with the backend
  const setupWebSocketConnection = async (sessionId: string) => {
    try {
      console.log(`🔄 [WEBSOCKET] Setting up WebSocket connection`, {
        endpoint: `${apiBaseUrl.replace("http", "ws")}/ws/${sessionId}`,
        sessionId,
        timestamp: new Date().toISOString(),
      });

      const ws = new WebSocket(
        `${apiBaseUrl.replace("http", "ws")}/ws/${sessionId}`
      );

      // Connection monitoring
      let connectionAttemptTimeout = setTimeout(() => {
        console.error(
          `❌ [WEBSOCKET] Connection attempt timed out after 10 seconds`
        );
        // Handle timeout - could retry or show error
      }, 10000);

      ws.onopen = () => {
        clearTimeout(connectionAttemptTimeout);
        console.log(`✅ [WEBSOCKET] Connection established successfully`, {
          sessionId,
          timestamp: new Date().toISOString(),
        });

        // Send a ping to test the connection
        try {
          ws.send(JSON.stringify({ type: "ping" }));
          console.log(`📤 [WEBSOCKET] Sent initial ping`);
        } catch (error) {
          console.error(`❌ [WEBSOCKET] Error sending initial ping:`, error);
        }
      };

      ws.onmessage = (event) => {
        console.log(`📥 [WEBSOCKET] Message received:`, {
          dataLength: event.data.length,
          timestamp: new Date().toISOString(),
        });

        try {
          const message = JSON.parse(event.data);
          console.log(`🔍 [WEBSOCKET] Parsed message:`, {
            type: message.type,
            hasText: !!message.text,
            hasTranscription: !!message.transcription,
            hasAudio: !!message.audio,
            timestamp: new Date().toISOString(),
          });

          // Handle different message types
          switch (message.type) {
            case "connected":
              console.log(`🔗 [WEBSOCKET] Connected confirmation:`, message);
              break;
            case "transcription":
              console.log(`🎤 [WEBSOCKET] Transcription:`, {
                text: message.text,
                isFinal: message.is_final,
                timestamp: new Date().toISOString(),
              });
              setTranscription(message.text || "");
              break;
            case "ai_response":
              console.log(`🤖 [WEBSOCKET] AI Response:`, {
                text:
                  message.text?.substring(0, 50) +
                  (message.text?.length > 50 ? "..." : ""),
                hasAudio: !!message.audio_url,
                timestamp: new Date().toISOString(),
              });
              setAgentResponse(message.text || "");
              break;
            case "error":
              console.error(`❌ [WEBSOCKET] Error from server:`, message);
              break;
            case "pong":
              console.log(`🏓 [WEBSOCKET] Pong received`);
              break;
            default:
              console.log(`❓ [WEBSOCKET] Unknown message type:`, message.type);
          }
        } catch (error) {
          console.error(
            `❌ [WEBSOCKET] Error parsing message:`,
            error,
            "Raw data:",
            event.data
          );
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ [WEBSOCKET] Error:`, error);
      };

      ws.onclose = (event) => {
        console.log(`🔒 [WEBSOCKET] Connection closed:`, {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString(),
        });
      };

      return ws;
    } catch (error) {
      console.error(`❌ [WEBSOCKET] Setup error:`, error);
      throw error;
    }
  };

  // Set up room event handlers
  const setupRoomEventHandlers = (room: Room) => {
    // Connection state changes
    room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
      console.log("📶 [LIVEKIT] Connection state changed:", state);
      if (state === ConnectionState.Disconnected) {
        setStatusMessage("Disconnected from voice agent");
        setConnectionProgress(null);
        setIsConnected(false);
      } else if (state === ConnectionState.Connected) {
        setStatusMessage("Connected to voice agent");
        setConnectionProgress(null);
        setIsConnected(true);
      } else if (state === ConnectionState.Connecting) {
        setStatusMessage("Connecting to voice agent...");
        setConnectionProgress("Establishing connection");
      } else if (state === ConnectionState.Reconnecting) {
        setStatusMessage("Reconnecting to voice agent...");
        setConnectionProgress("Attempting to reconnect");
      }
    });

    // Participant joined
    room.on(
      RoomEvent.ParticipantConnected,
      (participant: RemoteParticipant) => {
        console.log(`👤 [LIVEKIT] Participant connected:`, {
          identity: participant.identity,
          metadata: participant.metadata,
          timestamp: new Date().toISOString(),
        });
      }
    );

    // Participant left
    room.on(
      RoomEvent.ParticipantDisconnected,
      (participant: RemoteParticipant) => {
        console.log(`👋 [LIVEKIT] Participant disconnected:`, {
          identity: participant.identity,
          timestamp: new Date().toISOString(),
        });
      }
    );

    // Track subscriptions
    room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      console.log(`🎤 [LIVEKIT] Track subscribed:`, {
        trackKind: track.kind,
        trackName: track.name,
        participantIdentity: participant.identity,
        timestamp: new Date().toISOString(),
      });
    });

    // Track unsubscriptions
    room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      console.log(`🔇 [LIVEKIT] Track unsubscribed:`, {
        trackKind: track.kind,
        trackName: track.name,
        participantIdentity: participant.identity,
        timestamp: new Date().toISOString(),
      });
    });

    // Error handling
    room.on(RoomEvent.MediaDevicesError, (error: Error) => {
      console.error(`❌ [LIVEKIT] Media device error:`, error);
    });
  };

  // Set up participant event handlers
  const setupParticipantHandlers = (room: Room) => {
    if (!room) return;

    // Handle the local participant
    const localParticipant = room.localParticipant;
    if (!localParticipant) return;

    localParticipant.on(ParticipantEvent.TrackPublished, (publication) => {
      console.log(`📢 [LIVEKIT] Local track published:`, {
        trackKind: publication.kind,
        trackName: publication.trackName,
        timestamp: new Date().toISOString(),
      });
    });

    localParticipant.on(ParticipantEvent.TrackUnpublished, (publication) => {
      console.log(`🔕 [LIVEKIT] Local track unpublished:`, {
        trackKind: publication.kind,
        trackName: publication.trackName,
        timestamp: new Date().toISOString(),
      });
    });

    // Safely handle remote participants
    if (room.participants) {
      // Notify backend when a participant connects
      const notifyBackendOfParticipant = (participant: RemoteParticipant) => {
        try {
          if (webSocket && webSocket.readyState === WebSocket.OPEN && sessionId) {
            // Send participant information to backend since Python SDK doesn't handle events the same way
            webSocket.send(JSON.stringify({
              type: "participant_connected",
              participant_id: participant.identity,
              session_id: sessionId,
              metadata: participant.metadata,
              timestamp: new Date().toISOString(),
            }));
            
            console.log(`👤 [LIVEKIT] Notified backend of participant: ${participant.identity}`);
          }
        } catch (error) {
          console.error("Error notifying backend of participant:", error);
        }
      };

      // Add handlers for participant connection/disconnection
      room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log(`👋 [LIVEKIT] Remote participant connected: ${participant.identity}`);
        notifyBackendOfParticipant(participant);
        
        // Set up track subscription handlers
        participant.on(ParticipantEvent.TrackSubscribed, (track, publication) => {
          console.log(`🔔 [LIVEKIT] Subscribed to track from ${participant.identity}:`, {
            kind: track.kind,
            name: publication.trackName,
          });
          
          // Notify backend of track subscription
          if (webSocket && webSocket.readyState === WebSocket.OPEN && sessionId) {
            webSocket.send(JSON.stringify({
              type: "track_subscribed",
              participant_id: participant.identity,
              track_id: publication.trackSid,
              track_kind: track.kind,
              session_id: sessionId,
              timestamp: new Date().toISOString(),
            }));
          }
        });
      });
      
      room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log(`👋 [LIVEKIT] Remote participant disconnected: ${participant.identity}`);
        
        // Notify backend of participant disconnection
        if (webSocket && webSocket.readyState === WebSocket.OPEN && sessionId) {
          webSocket.send(JSON.stringify({
            type: "participant_disconnected",
            participant_id: participant.identity,
            session_id: sessionId,
            timestamp: new Date().toISOString(),
          }));
        }
      });
      
      // Process existing participants too
      try {
        if (typeof room.participants.forEach === "function") {
          room.participants.forEach(notifyBackendOfParticipant);
        } else if (typeof room.participants.values === "function") {
          Array.from(room.participants.values()).forEach(notifyBackendOfParticipant);
        } else if (typeof room.participants === "object") {
          Object.values(room.participants).forEach(notifyBackendOfParticipant);
        }
      } catch (error) {
        console.error("Error processing existing participants:", error);
      }
    }
  };

  // Custom audio renderer that attaches all audio tracks
  const AudioRenderer = ({ room }: { room: Room }) => {
    const [audioElements, setAudioElements] = useState<React.ReactNode[]>([]);

    useEffect(() => {
      const attachAudioTracks = () => {
        const elements: React.ReactNode[] = [];

        // Process all participants including local
        const processParticipantAudio = (participant: Participant) => {
          // Use the tracks collection and filter for audio tracks
          participant.tracks.forEach((publication) => {
            if (
              publication.track &&
              publication.track.kind === Track.Kind.Audio &&
              !publication.isMuted
            ) {
              const audioElement = document.createElement("audio");
              audioElement.autoplay = true;
              audioElement.style.display = "none";

              // Generate unique key for this audio element
              const key = `audio-${participant.identity}-${publication.trackSid}`;

              publication.track.attach(audioElement);
              elements.push(
                <div
                  key={key}
                  ref={(el) => el && el.appendChild(audioElement)}
                />
              );

              console.log(
                `🔊 [LIVEKIT] Attached audio track from ${participant.identity}`
              );
            }
          });
        };

        // Process local participant
        if (room.localParticipant) {
          processParticipantAudio(room.localParticipant);
        }

        // Process remote participants safely
        if (room.participants) {
          // If it's a Map with forEach
          if (typeof room.participants.forEach === "function") {
            room.participants.forEach(processParticipantAudio);
          }
          // If it has values() method
          else if (typeof room.participants.values === "function") {
            Array.from(room.participants.values()).forEach(
              processParticipantAudio
            );
          }
          // If it's a plain object
          else if (typeof room.participants === "object") {
            Object.values(room.participants).forEach(processParticipantAudio);
          }
        }

        setAudioElements(elements);
      };

      // Initial attachment
      attachAudioTracks();

      // Set up listeners for track events
      const handleTrackSubscribed = () => attachAudioTracks();
      const handleTrackUnsubscribed = () => attachAudioTracks();

      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);

      return () => {
        room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      };
    }, [room]);

    return <>{audioElements}</>;
  };

  const VideoConferenceView = ({ room }: { room: Room }) => {
    // This hook would typically be used in a LiveKitRoom provider context
    // Since we're manually connecting, we'll handle tracks differently
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
      // Function to collect all published tracks from participants
      const collectTracks = () => {
        const allTracks: Track[] = [];

        try {
          // Add local participant tracks
          if (room.localParticipant) {
            room.localParticipant.tracks.forEach((publication) => {
              if (
                publication.track &&
                publication.track.kind === Track.Kind.Video
              ) {
                allTracks.push(publication.track);
              }
            });
          }

          // Add remote participant tracks - safely handle different participant collection types
          if (room.participants) {
            // If it has a forEach method (Map)
            if (typeof room.participants.forEach === "function") {
              room.participants.forEach((participant) => {
                if (participant && participant.tracks) {
                  participant.tracks.forEach((publication) => {
                    if (
                      publication.track &&
                      publication.track.kind === Track.Kind.Video
                    ) {
                      allTracks.push(publication.track);
                    }
                  });
                }
              });
            }
            // If it has values method (Map)
            else if (typeof room.participants.values === "function") {
              Array.from(room.participants.values()).forEach((participant) => {
                if (participant && participant.tracks) {
                  participant.tracks.forEach((publication) => {
                    if (
                      publication.track &&
                      publication.track.kind === Track.Kind.Video
                    ) {
                      allTracks.push(publication.track);
                    }
                  });
                }
              });
            }
            // If it's an object
            else if (typeof room.participants === "object") {
              Object.values(room.participants).forEach((participant) => {
                if (participant && participant.tracks) {
                  participant.tracks.forEach((publication) => {
                    if (
                      publication.track &&
                      publication.track.kind === Track.Kind.Video
                    ) {
                      allTracks.push(publication.track);
                    }
                  });
                }
              });
            }
          }

          setTracks(allTracks);
          console.log(
            `🎥 [LIVEKIT] Updated video tracks, count: ${allTracks.length}`
          );
        } catch (error) {
          console.error("Error collecting video tracks:", error);
        }
      };

      // Initial collection
      collectTracks();

      // Set up listeners for track events
      const handleTrackSubscribed = () => collectTracks();
      const handleTrackUnsubscribed = () => collectTracks();
      const handleParticipantConnected = () => collectTracks();
      const handleParticipantDisconnected = () => collectTracks();

      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

      return () => {
        room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
        room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
        room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.off(
          RoomEvent.ParticipantDisconnected,
          handleParticipantDisconnected
        );
      };
    }, [room]);

    // Simple grid layout for tracks
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {tracks.map((track, idx) => (
          <div
            key={`track-${idx}`}
            style={{
              border: "1px solid #333",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              aspectRatio: "16/9",
              backgroundColor: "#111",
            }}
          >
            <video
              ref={(el) => {
                if (el && track) {
                  try {
                    track.attach(el);
                    // Set options for better video quality
                    el.style.width = "100%";
                    el.style.height = "100%";
                    el.style.objectFit = "cover";
                  } catch (error) {
                    console.error(`Error attaching video track: ${error}`);
                  }
                }
              }}
              autoPlay
              playsInline
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-[#0A0A0A] text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={navigateBack}
            className="h-8 w-8 rounded-full bg-[#1A1A1A] text-[#C1FF00] hover:bg-[#C1FF00]/20 hover:text-[#C1FF00]"
          >
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-[#C1FF00]">Creative Agent</h1>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={disconnectFromVoiceAgent}
              className="bg-[#83c5be]/20 text-[#83c5be] hover:bg-[#83c5be]/30 hover:text-[#83c5be]"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={connectToVoiceAgent}
              disabled={isConnecting}
              className="bg-[#C1FF00]/20 text-[#C1FF00] hover:bg-[#C1FF00]/30"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Start Conversation"
              )}
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-6 mb-6"
      >
        <Card className="bg-[#1A1A1A] border-[#1A1A1A] p-4 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#d8f3dc] to-[#83c5be] flex items-center justify-center">
              <Brain className="h-4 w-4 text-black" />
            </div>
            <span className="text-sm font-medium text-[#C1FF00]">
              Status: {statusMessage}
            </span>
            {connectionProgress && (
              <span className="text-sm font-medium text-[#83c5be] ml-2">
                ({connectionProgress})
              </span>
            )}
          </div>

          <div className="flex gap-3 mb-6">
            {isConnected && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className={`h-10 w-10 rounded-full ${
                    isMuted
                      ? "bg-[#83c5be]/20 text-[#83c5be] hover:bg-[#83c5be]/30 hover:text-[#83c5be]"
                      : "bg-[#C1FF00]/20 text-[#C1FF00] hover:bg-[#C1FF00]/30"
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAudioMute}
                  className={`h-10 w-10 rounded-full ${
                    isAudioMuted
                      ? "bg-[#83c5be]/20 text-[#83c5be] hover:bg-[#83c5be]/30 hover:text-[#83c5be]"
                      : "bg-[#C1FF00]/20 text-[#C1FF00] hover:bg-[#C1FF00]/30"
                  }`}
                >
                  {isAudioMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>

          {transcription && (
            <div className="mb-4 p-3 bg-[#1A1A1A] rounded-lg">
              <p className="text-sm font-medium text-[#C1FF00] mb-1">
                You said:
              </p>
              <p className="text-[#C1FF00]">{transcription}</p>
            </div>
          )}

          {agentResponse && (
            <div className="mb-4 p-3 bg-[#1A1A1A] rounded-lg">
              <p className="text-sm font-medium text-[#83c5be] mb-1">
                Agent response:
              </p>
              <p className="text-[#83c5be]">{agentResponse}</p>
            </div>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 overflow-y-auto rounded-xl bg-[#1A1A1A] border border-[#1A1A1A] p-4"
      >
        <h2 className="text-lg font-bold text-[#C1FF00] mb-4">Conversation</h2>

        <div className="space-y-4">
          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#d8f3dc] to-[#83c5be] flex-shrink-0 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-black" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-xl p-3 ${
                  message.role === "user"
                    ? "bg-[#C1FF00]/20 text-[#C1FF00]"
                    : "bg-[#1A1A1A] text-[#83c5be]"
                }`}
              >
                <p>{message.content}</p>
              </div>

              {message.role === "user" && (
                <div className="h-8 w-8 rounded-lg bg-[#C1FF00]/20 flex-shrink-0 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-[#C1FF00]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {conversationHistory.length === 0 && !isConnected && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Brain className="h-12 w-12 text-[#83c5be] mb-4" />
            <h3 className="text-lg font-medium text-[#C1FF00] mb-2">
              Your Creative Agent is ready
            </h3>
            <p className="text-sm text-[#C1FF00] max-w-md">
              Click "Start Conversation" to begin a voice chat with your
              Creative Agent. You can discuss ideas, get feedback, and explore
              concepts together.
            </p>
          </div>
        )}
      </motion.div>

      {isConnected && (
        <div style={{ height: "100%", width: "100%" }}>
          <AudioRenderer room={room} />
          <VideoConferenceView room={room} />
        </div>
      )}
    </div>
  );
}
