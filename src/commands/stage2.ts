// src/commands/stage2.ts
import command from "../../config.json" assert { type: "json" };
import { STAGE3 } from "./stage3.ts";
import { lockInput, unlockInput, set3 } from "../main";

export const STAGE2 = () => {
  lockInput();
  const writeLinesAnchor = document.getElementById("write-lines");
  if (!writeLinesAnchor || !writeLinesAnchor.parentElement) return;

  const parent = writeLinesAnchor.parentElement as HTMLElement;
  const expectedCode = String(command.stage2Code ?? "411214121141663565").toLowerCase();

  const printLine = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    parent.insertBefore(div, writeLinesAnchor);
  };

  // 1) Show prompt in the terminal
  printLine(`<span class="output">ENTER CODE:</span>`);

  // 2) Inline input
  const wrapper = document.createElement("div");
  wrapper.className = "stage2-input-wrapper";

  const input = document.createElement("input");
  input.type = "password";
  input.className = "stage2-input";
  input.autocomplete = "off";

  wrapper.appendChild(input);
  parent.insertBefore(wrapper, writeLinesAnchor);

  input.focus();

  const cleanup = () => {
    if (wrapper.parentElement) wrapper.parentElement.removeChild(wrapper);
  };

  const finishWrong = () => {
    unlockInput();
    cleanup();
    printLine(`<span class="output">what seems out of order… isn’t</span>`);
    const audio = new Audio("/command_asset/2.mp3");
    audio.play().catch((err) => {
      console.error("Failed to play audio:", err);
      printLine(`<span class="output">Error: could not play audio.</span>`);
    });
  };

  const finishCorrect = () => {
    cleanup();
    printLine(`<span class="output">Playing audio...</span>`);

    /*const audio = new Audio("/command_asset/2.mp3");
    audio.play()
      .then(() => {
        audio.onended = () => {
          STAGE3();
        };
      })
      .catch((err) => {
        console.error("Failed to play audio:", err);
        printLine(`<span class="output">Error: could not play audio.</span>`);
        STAGE3();
      });*/
    
    STAGE3();
  };


  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const code = input.value.trim().toLowerCase();
      if (code === expectedCode) {
        finishCorrect();
      } else {
        finishWrong();
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      cleanup();
      printLine(`<span class="output">Stage2 cancelled.</span>`);
    }
  });
};
