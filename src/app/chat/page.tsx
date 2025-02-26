// "use client";

// import type React from "react";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/app/lib/store";
// import {
//   addMessage,
//   resetChat,
//   setDeepSearch,
// } from "@/app/lib/messages/messageSlice";
// import MessageList from "@/components/chat-page/MessageList";
// import GradualSpacing from "@/components/ui/gradual-spacing";
// import type { Message } from "@/app/lib/messages/messageSlice";
// import axios from "axios";
// import { cn } from "@/lib/utils";
// import { DotPattern } from "@/components/ui/dot-pattern";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { v4 as uuidv4 } from "uuid";
// import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
// import { Marquee } from "@/components/magicui/marquee";
// import { PromptCard } from "@/components/prompt-cards";
// import { reviews } from "@/app/utils/text";
// import { ShimmerButton } from "@/components/magicui/shimmer-button";

// interface DiagramResponse {
//   diagram_type: string;
//   syntax: string;
//   description: string;
//   metadata: {
//     options: Record<string, unknown>;
//     model: string;
//     tokens: number;
//   };
// }

// const ChatPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const messages = useSelector((state: RootState) => state.chat.messages);
//   const isDeepSearch = useSelector(
//     (state: RootState) => state.chat.isDeepSearch
//   );
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [sessionId] = useState<string>(uuidv4());
//   const [inputValue, setInputValue] = useState<string>("");

//   // Remove the local state
//   // const [isDeepSearch, setIsDeepSearch] = useState<boolean>(false);

//   const handleSwitchChange = (checked: boolean) => {
//     dispatch(setDeepSearch(checked));
//     console.log("Deep search state changed:", checked);
//   };

//   const firstRow = reviews.slice(0, reviews.length / 2);
//   const secondRow = reviews.slice(reviews.length / 2);

//   const placeholders = [
//     "/diagram Create a flowchart for user registration",
//     "/diagram Draw a sequence diagram for API flow",
//     "/diagram Generate an ER diagram for blog",
//     "How can I help you?",
//     "What's the next big thing in AI?",
//   ];

//   const diagramKeywords = [
//     "draw",
//     "diagram",
//     "flowchart",
//     "sequence",
//     "graph",
//     "chart",
//     "er diagram",
//   ];

//   const isDiagramRequest = (text: string): boolean => {
//     const normalizedText = text.toLowerCase();
//     // Check both /diagram command and diagram-related keywords
//     return (
//       normalizedText.startsWith("/diagram") ||
//       diagramKeywords.some((keyword) => normalizedText.includes(keyword))
//     );
//   };

//   const processDiagramResponse = async (
//     response: DiagramResponse
//   ): Promise<Message> => {
//     // Clean up the Mermaid syntax by removing any code block markers
//     let mermaidSyntax = response.syntax;
//     if (mermaidSyntax.includes("```")) {
//       mermaidSyntax =
//         mermaidSyntax.match(/```(?:lua|mermaid)?\n?([\s\S]*?)```/)?.[1] || "";
//     }

//     return {
//       id: uuidv4(),
//       sender: "ai",
//       text: response.description,
//       type: "diagram",
//       diagramData: mermaidSyntax.trim(),
//     };
//   };

//   const processTextResponse = (message: string): Message => {
//     return {
//       id: uuidv4(),
//       sender: "ai",
//       text: message,
//       type: "text",
//     };
//   };

//   const handleSendMessage = async (text: string) => {
//     if (!text.trim()) return;

//     const messageContent = text.trim();
//     const isDiagram = isDiagramRequest(messageContent);

//     // Reset deep search after sending message
//     dispatch(setDeepSearch(false));

//     console.log("Request configuration:", {
//       messageContent,
//       isDiagram,
//       isDeepSearch,
//       sessionId,
//     });

//     console.log("Message type detection:", {
//       originalText: messageContent,
//       isDiagram: isDiagram,
//       normalizedText: messageContent.toLowerCase(),
//       matchedKeyword: isDiagram
//         ? diagramKeywords.find((keyword) =>
//             messageContent.toLowerCase().includes(keyword)
//           )
//         : null,
//     });

//     const userMessage: Message = {
//       id: uuidv4(),
//       sender: "user",
//       text: messageContent,
//       type: isDiagram ? "diagram" : "text",
//     };

//     dispatch(addMessage(userMessage));

//     try {
//       setIsLoading(true);
//       const endpoint = isDiagram
//         ? "http://localhost:8000/api/v1/diagram"
//         : "http://localhost:8000/api/v1/chat";

//       console.log("Sending request to:", {
//         endpoint,
//         messageType: isDiagram ? "diagram" : "chat",
//         content: messageContent,
//       });

//       // Prepare the message for the diagram endpoint
//       const requestData = {
//         message:
//           isDiagram && !messageContent.startsWith("/diagram")
//             ? `/diagram ${messageContent}` // Add /diagram prefix if it's missing
//             : messageContent,
//         session_id: sessionId,
//         deep_research: isDeepSearch,
//       };

//       const response = await axios.post(endpoint, requestData, {
//         headers: {
//           "Content-Type": "application/json",
//           "user-id": sessionId,
//         },
//       });

//       console.log("Response received:", response.data);

//       const aiMessage = isDiagram
//         ? await processDiagramResponse(response.data as DiagramResponse)
//         : processTextResponse(response.data.message);

//       dispatch(addMessage(aiMessage));
//     } catch (error) {
//       console.error("Error in request:", error);
//       const errorMessage: Message = {
//         id: uuidv4(),
//         sender: "ai",
//         text: isDiagram
//           ? "Sorry, I couldn't generate the diagram. Please try again."
//           : "Sorry, I'm having trouble connecting to the server.",
//         type: "text",
//       };
//       dispatch(addMessage(errorMessage));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     handleSendMessage(inputValue);
//     setInputValue("");
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-black text-gray-800 relative">
//       <DotPattern
//         className={cn(
//           "absolute inset-0 w-full h-full opacity-20",
//           "[mask-image:radial-gradient(100% 100% at center center,white,transparent)]"
//         )}
//       />

//       {messages.length === 0 ? (
//         <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
//           <div className="text-center mb-12 sm:mb-16">
//             <GradualSpacing
//               className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide text-white mb-6"
//               text="Creatigen"
//             />
//             <p className="text-white text-lg sm:text-xl">
//               Unlock Infinite Creativity – Transform Ideas into Reality!
//             </p>
//           </div>

//           <div className="w-full max-w-5xl mx-auto mb-12 sm:mb-16">
//             <div className="relative">
//               <Marquee pauseOnHover className="[--duration:20s] mb-6">
//                 {firstRow.map((review) => (
//                   <PromptCard key={review.prompt} {...review} />
//                 ))}
//               </Marquee>
//               <Marquee reverse pauseOnHover className="[--duration:20s]">
//                 {secondRow.map((review) => (
//                   <PromptCard key={review.prompt} {...review} />
//                 ))}
//               </Marquee>
//               <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
//               <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
//             </div>
//           </div>

//           <div className="w-full max-w-2xl mx-auto px-4">
//             <PlaceholdersAndVanishInput
//               placeholders={placeholders}
//               onChange={handleInputChange}
//               onSubmit={handleFormSubmit}
//               onSwitchChange={handleSwitchChange}
//             />
//           </div>
//         </main>
//       ) : (
//         <div className="flex flex-col h-screen">
//           <TooltipProvider>
//             <Tooltip>
//               <div className="flex justify-start p-4">
//                 <TooltipTrigger asChild>
//                   <ShimmerButton
//                     onClick={() => dispatch(resetChat())}
//                     className="start-new-chat-button p-3 text-white flex items-center gap-2"
//                   >
//                     Start New Chat
//                   </ShimmerButton>
//                 </TooltipTrigger>
//               </div>
//               <TooltipContent>
//                 <p>Start New Creative Chat</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>

//           <div className="flex-1 overflow-y-auto px-4">
//             <div className="max-w-4xl mx-auto">
//               <MessageList messages={messages} loading={isLoading} />
//             </div>
//           </div>

//           <div className=" border-gray-800 ">
//             <div className="max-w-4xl mx-auto p-4">
//               <PlaceholdersAndVanishInput
//                 placeholders={placeholders}
//                 onChange={handleInputChange}
//                 onSubmit={handleFormSubmit}
//                 onSwitchChange={handleSwitchChange}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;
