// src/commands/stage4.ts
import { lockInput, unlockInput, epilogueUnset, writeLines } from "../main";

export const STAGE4 = (
  parent: HTMLElement,
  writeLinesAnchor: HTMLElement,
  timerDiv: HTMLElement // kept for future use if needed
) => {
  lockInput();

  const printLine = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    parent.insertBefore(div, writeLinesAnchor);
  };

  const writeBlock = (text: string) => {
    const epilogue = text.replace(/\r/g, "").trim();
    writeLines(
      epilogue.split("\n").map((line) => `<span class="output">${line}</span>`)
    );
  };

  // Single wrapper that always contains:
  // - a label (prompt text)
  // - an input
  const wrapper = document.createElement("div");
  wrapper.className = "stage4-wrapper";
  parent.insertBefore(wrapper, writeLinesAnchor);

  let step = 0; // 0 = pick option, 1 = stay/leave

  const finalize = () => {
    if (wrapper.parentElement) wrapper.parentElement.removeChild(wrapper);
    unlockInput();
    epilogueUnset();
  };

  const showEndingLeave = () => {
    printLine(`<br>`);
    writeBlock(`
For the team that has left.
You slump into your chair, the cold realization settling in like ice in your veins. 
The game, the clues, the search for the killer — it was never about survival. E
scape was an illusion. Either you die... or die trying.

There is no escape. He is always ahead.
    `);
    finalize();
  };

  const showEndingStay = () => {
    printLine(`<br>`);
    writeBlock(`
In your final moments, drifting between reality and darkness, you see him - the hunter- perfectly concealed in the shadows. 
His eyes, sharp and cold, fixed onto your own, almost mocking your stubbornness, your foolish pride.
"How could I have been so careless?" you think. The people you trusted the most... the ones you worked with, the ones you cared for... all illusions.
Why haven’t they left yet? The first half of my team. What can they do against an opponent who moves in the shadows, wields the skill of the agency's top operatives, 
and hides so completely that he doesn't even exist?
One last glance, and the truth hits you like a blade. “It's been you all along.” The hunter, the killer, the orchestrator of every death, every trap... 
it’s the government(ITG) itself. The system no one can beat.
    `);
    finalize();
  };

  const renderStep = () => {
    wrapper.innerHTML = ""; // clear previous contents

    const label = document.createElement("div");
    label.className = "stage4-label";

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.className = "stage4-input";

    if (step === 0) {
      // First prompt: choose 1/2/3/4
      label.innerHTML = [
        `<span class="output">Choose:</span>`,
        `<span class="output">1. Send information to the government</span>`,
        `<span class="output">2. Don't send the information</span>`,
        `<span class="output">3. Find the tracking device</span>`,
        `<span class="output">4. "..."</span>`
      ].join("<br>");
    } else if (step === 1) {
      // Second prompt: stay/leave
      label.innerHTML = `<span class="output">Will your outside team leave? (stay/leave)</span>`;
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();

      const val = input.value.trim().toLowerCase();

      // Step 0: Pick 1/2/3/4
      if (step === 0) {
        if (!["1", "2", "3", "4"].includes(val)) {
          input.value = "";
          return;
        }

        if (val === "3" || val === "4") {
          printLine(
            `<span class="output">This option will be implemented later.</span>`
          );
          input.value = "";
          return;
        }

        // If option 1 or 2:
        step = 1;
        renderStep(); // re-render with new prompt + new line for input
        return;
      }

      // Step 1: stay/leave
      if (step === 1) {
        if (val === "leave") {
          showEndingLeave();
          return;
        }
        if (val === "stay") {
          showEndingStay();
          return;
        }

        input.value = "";
        return;
      }
    });
  };

  renderStep();
};
