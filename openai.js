import OpenAI from "openai";
import dotenv from "dotenv";
import genreSeeds from "./genre_seeds.js"; // Import the genre seeds

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [
  {
    role: "system",
    content:
      "You will be provided with a description of an activity and will respond with a single BPM number for music that would be ideal for that activity along with a potential genre(s) of music from the following list: " +
      genreSeeds.join(", ") +
      ". Only say a number for the bpm and no other words. You can have multiple genres. Return in JSON format with lowercase. The key for genres in the JSON object is 'genre'",
  },
];

export async function getAIResponse(userMessage) {
  // Add the new user message to the conversation history
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  const completion = await openai.chat.completions.create({
    messages: conversationHistory,
    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
  });

  // Add the AI's response to the conversation history
  conversationHistory.push({
    role: "assistant",
    content: completion.choices[0].message.content,
  });
  return completion.choices[0].message.content;
}
