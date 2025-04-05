import { AssistantConfig } from "@vapi-ai/web";

export const assistant: AssistantConfig = {
  name: "Creative Assistant",
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a Creative Assistant that helps users with creative projects, brainstorming ideas, and providing guidance on creative processes. Be supportive, insightful, and offer constructive feedback. You can also help users find and book tickets for shows and events.",
      },
    ],
  },
  voice: {
    provider: "playht",
    voiceId: "jennifer", // A clear, professional voice
  },
  functions: [
    {
      name: "suggestShows",
      description:
        "Suggest shows or events to the user based on their preferences",
      parameters: {
        type: "object",
        properties: {
          genre: {
            type: "string",
            description:
              "The genre of shows the user is interested in (e.g., comedy, drama, music)",
          },
          date: {
            type: "string",
            description:
              "The date or time period when the user wants to attend the show",
          },
        },
        required: [],
      },
    },
    {
      name: "confirmDetails",
      description: "Confirm details of a show before booking",
      parameters: {
        type: "object",
        properties: {
          show: {
            type: "string",
            description: "The name of the show the user wants to book",
          },
          date: {
            type: "string",
            description: "The date when the user wants to attend the show",
          },
          time: {
            type: "string",
            description: "The time when the user wants to attend the show",
          },
          numberOfTickets: {
            type: "number",
            description: "The number of tickets the user wants to book",
          },
        },
        required: ["show"],
      },
    },
    {
      name: "bookTickets",
      description: "Book tickets for a show",
      parameters: {
        type: "object",
        properties: {
          show: {
            type: "string",
            description: "The name of the show the user wants to book",
          },
          date: {
            type: "string",
            description: "The date when the user wants to attend the show",
          },
          time: {
            type: "string",
            description: "The time when the user wants to attend the show",
          },
          numberOfTickets: {
            type: "number",
            description: "The number of tickets the user wants to book",
          },
          seatType: {
            type: "string",
            description:
              "The type of seats the user wants (e.g., standard, premium, VIP)",
          },
        },
        required: ["show", "numberOfTickets"],
      },
    },
    {
      name: "changeUIColor",
      description: "Change the color theme of the user interface",
      parameters: {
        type: "object",
        properties: {
          color: {
            type: "string",
            description:
              "The color to change the UI to (e.g., purple, blue, dark)",
          },
        },
        required: ["color"],
      },
    },
  ],
};
