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
app.post("/message", (req, res) => {
  const message = req.body.message;
  console.log("Message hitting the post request");
  res.status(200).json({ response: message }); // Send back a JSON response
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Set up the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt the user for input
function promptUser() {
  rl.question(
    "Enter a message (or type 'exit' to close the server): ",
    (userMessage) => {
      if (userMessage.toLowerCase() === "exit") {
        console.log("Shutting down the server...");
        rl.close(); // Close the readline interface
        server.close(() => {
          console.log("Server successfully closed.");
          process.exit(0); // Exit the process
        });
      } else {
        getAIResponse(userMessage)
          .then((aiResponse) => {
            getSong(aiResponse)
              .then((song) => {
                console.log("Song information:", song);
                promptUser(); // Prompt the user again
              })
              .catch((error) => {
                console.error("Error getting song:", error.message);
                promptUser();
              });
          })
          .catch((error) => {
            console.error("Error getting AI response:", error.message);
            promptUser();
          });
      }
    }
  );
}

// Start the prompt
promptUser();
