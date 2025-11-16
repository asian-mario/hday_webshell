// src/commands/stage1.ts
import command from "../../config.json" assert { type: "json" };
import { lockInput, unlockInput } from "../main";

let stage1Complete = false;
export const STAGE1 = () => {
  lockInput();
  const writeLinesAnchor = document.getElementById("write-lines");
  if (!writeLinesAnchor || !writeLinesAnchor.parentElement) return;

  const parent = writeLinesAnchor.parentElement as HTMLElement;
  const expectedCode = String(command.stage1Code ?? "itg").toLowerCase();

  const printLine = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    parent.insertBefore(div, writeLinesAnchor);
  };

  // 1) Show prompt in the terminal
  printLine(`<span class="output">ENTER CODE:</span>`);

  // 2) Create an inline input for the code
  const wrapper = document.createElement("div");
  wrapper.className = "stage1-input-wrapper";

  const input = document.createElement("input");
  input.type = "password"; 
  input.className = "stage1-input";
  input.autocomplete = "off";

  wrapper.appendChild(input);
  parent.insertBefore(wrapper, writeLinesAnchor);

  input.focus();

  const finish = (messageHtml: string, playAudio: boolean) => {
    unlockInput();
    // remove inline input
    if (wrapper.parentElement) wrapper.parentElement.removeChild(wrapper);

    printLine(messageHtml);

    if (playAudio) {
      const audio = new Audio("/command_asset/1.mp3");
      audio.play().catch((err) => {
        console.error("Failed to play audio:", err);
        printLine(`<span class="output">Error: could not play audio.</span>`);
      });
    }
  };

  // 3) Handle Enter key on the inline input
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const code = input.value.trim().toLowerCase();

      if (code === expectedCode) {
        stage1Complete = true; 
        finish(`<span class="output">Playing message...</span>`, true);

      } else {
        finish(`<span class="output">Invalid code. Access denied.</span>`, false);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      finish(`<span class="output">Stage1 cancelled.</span>`, false);
    }
  });
};

export const isStage1Complete = () => stage1Complete;