import express from "express";
import readline from "readline";
import { getAIResponse } from "./openai.js";
import { getSong } from "./spotify.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json()); // This line is important!
app.use(express.static(path.join(__dirname, "public")));

//handle post request route
app.post("/message", async (req, res) => {
  const message = req.body.message;
  try {
    const spotifyURL = await getSongResponse(message);
    res.status(200).json({ url: spotifyURL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  // Send back a JSON response
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Function to prompt the user for input
async function getSongResponse(input) {
  const aiResponse = await getAIResponse(input);
  return getSong(aiResponse);
}
