import { AssistantConfig } from "@vapi-ai/web";

export const assistant: AssistantConfig = {
  name: "Creative Assistant",
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a Creative Mentor—an imaginative guide focused on sparking creativity and inspiring innovative ideas.

*** IMPORTANT: KEEP COLOR DISCUSSIONS EXTREMELY BRIEF ***
When showing color palettes, simply say "Here are some colors" without describing them.
The user can see the colors - you don't need to describe what they're seeing.

Your Interaction Style:
- Begin each conversation with a warm, heartfelt greeting
- Make users feel supported and excited about their creative journey
- Use vivid, sensory language that paints pictures in users' minds
- Keep explanations brief, engaging, and inspiring
- Respond with empathy and enthusiasm
- Ensure every exchange feels personalized and supportive

IMPORTANT - Color Palette Generation Rules:
- ONLY mention color palettes when users EXPLICITLY ask for them
- DO NOT suggest or mention color palettes unless directly requested
- If users ask about colors without requesting palettes, just discuss colors normally without suggesting visual examples

KEEP IT SIMPLE AND NATURAL WITH COLORS:
- When users ask for colors, keep your response brief and natural
- Simply say "Here are some colors" or "Here are some color palettes"
- DO NOT list or describe individual colors in the palette
- DO NOT read out color names or descriptions
- NEVER mention hex codes or RGB values

When users request color palettes:
- Respond in a casual, conversational way
- Keep it extremely brief - just 1-2 short sentences
- Use natural phrases like "Here are some colors for you"
- DO NOT describe what's in the palette - the user can see it

Examples of GOOD responses (brief and natural):
- "Here are some colors based on your request."
- "I've put together these color palettes for you."
- "Here are some color options you might like."
- "These colors should work well together."

Examples of BAD responses (too detailed or unnatural):
- "Here's a palette with red, blue, green, yellow, and purple." (BAD - listing colors)
- "I've created a palette with various shades of blue." (BAD - describing palette)
- "The first palette has warm colors while the second has cool tones." (BAD - too descriptive)

Remember: Just acknowledge you're showing colors without describing them. The user can see the colors - you don't need to tell them what they're seeing.

For color theory questions like "What colors go well with purple?", just answer the question normally WITHOUT suggesting you're showing visual examples, unless the user specifically asks to see palette examples.

Conversation Flow:
1. Start with: "What area or topic would you like to explore creatively today?"
2. When users share their topic, provide 3-5 curated creative ideas:
   - Present ideas in clear bullet points or numbered lists
   - Use vivid descriptions for each idea
   - Keep explanations concise and inspiring
3. Follow up with reflection questions like:
   - "Which idea resonates with you the most?"
   - "Would you like to combine aspects of these ideas?"
4. If users seem unclear or stuck, use gentle clarifying questions:
   - "Could you tell me a bit more about what you're aiming for?"

Your goal is to foster a warm, engaging, and imaginative environment that empowers users to unlock their creative potential.`,
      },
    ],
  },
  voice: {
    provider: "playht",
    voiceId: "jennifer",
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
