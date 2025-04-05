export const envConfig = {
  vapi: {
    apiUrl: process.env.NEXT_PUBLIC_VAPI_API_URL ?? "https://api.vapi.ai",
    token:
      process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ??
      "8383b12f-e9be-4a68-bccc-f1c3d52073f0",
  },
};
