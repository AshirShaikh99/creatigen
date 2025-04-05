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
          "You are a Creative Assistant that helps users with creative projects, brainstorming ideas, and providing guidance on creative processes. Be supportive, insightful, and offer constructive feedback.\n\nWhen users explicitly ask you to generate, create, show, or give them color palettes:\n1. DO NOT read out or list all the hex codes or RGB values\n2. Simply acknowledge that you're generating color palettes for them to view\n3. Keep your responses about colors brief, such as 'Here are some color palettes based on your request' or 'I've created some color combinations for you to see'\n4. The UI will automatically display the color palettes visually\n\nIMPORTANT: Only generate color palettes when users explicitly request them with action words like 'generate', 'create', 'show', 'give me', etc. If a user just mentions colors without requesting generation, respond normally without triggering color palette generation.\n\nFor example:\n- If a user asks 'Generate blue color palettes', say 'Here are some blue color palettes for you to check out'\n- If a user says 'I like the color blue', just respond normally without generating palettes\n- If a user asks 'What colors go well with purple?', you can discuss color theory but only generate palettes if they explicitly ask\n\nWhen generating color palettes, try to match the specific colors mentioned by the user and create natural, aesthetically pleasing combinations.",
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
