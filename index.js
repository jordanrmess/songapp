import readline from "readline";
import { getAIResponse } from "./openai.js";
import { getSong } from "./spotify.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  rl.question("Enter a description of an activity: ", (userMessage) => {
    if (userMessage.toLowerCase() === "quit") {
      rl.close();
    } else {
      getAIResponse(userMessage).then((songInfo) => {
        getSong(songInfo).then(function (result) {});
        askQuestion();
      });
    }
  });
}

// Start the conversation
askQuestion();
