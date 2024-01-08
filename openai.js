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
      "Given a description of an activity, return a JSON object with 4 fields, the first is 'bpm' which is a single number representing the most ideal bpm of music for that activity, the second is 'genre' which is a set of 1 or more genres that would be ideal for that activity from the following list: " +
      genreSeeds.join(", ") +
      ",the third is 'energy' and is a single decimal between 0 and 1 representing what level of energy an activity has,and last is 'danceability' which is a single decimal between 0 and 1 representing how much you'd want to dance in the activity described. Only say a number for the bpm and no other words. Return in JSON format with all keys and values in lowercase.",
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
