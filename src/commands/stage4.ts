// src/commands/stage4.ts
import command from "../../config.json" assert { type: "json" };
import { lockInput, unlockInput, epilogueUnset, writeLines } from "../main";

export const STAGE4 = (
  parent: HTMLElement,
  writeLinesAnchor: HTMLElement,
  _timerDiv: HTMLElement // kept for future use if needed
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

  let step = 0; // 0 = pick option, 1 = follow-up (exit code / tracker / killer)
  let mode: "none" | "exitCode" | "tracker" | "killer" = "none";

  const exitCodeExpected = String(command.exitCode); // e.g. "FANG"
  const killerAnswers: string[] = Array.isArray(command.killerAnswers)
    ? command.killerAnswers
    : [];
  const killerLine = String(command.killerSuccessLine ?? "");

  const finalize = () => {
    if (wrapper.parentElement) wrapper.parentElement.removeChild(wrapper);
    unlockInput();
    epilogueUnset();
  };

  const showEndingLeave = () => {
    printLine(`<br>`);
    writeBlock(`
You slump into your chair, the cold realization settling in like ice in your veins. The game, the clues, the search for the killer — 
it was never about survival. Escape was an illusion. 
Either you die... or die trying.
There is no escape. He is always ahead, a shadow behind every move you make…It’s The Government(ITG), the true predator. 
Every team that came before you, every message intercepted, every hidden clue... it was all orchestrated. His hunt leaves no loose ends. 
No opposition survives.
And now you understand. The murderer you sought to catch was never tangible. It was him. 
The system. The hand guiding every trap, every false lead, every staged death. He frames, he manipulates, he hunts. 
He is always the hero in the story he writes - and you were always just another pawn.
A soft click echoes from the door. Your heartbeat spikes. Someone enters. At first, you think it's your teammate - your last ally.
But its presence remained dark. The posture, the quiet confidence, the inevitability of it all. 
Your skin prickles. This is not someone you know.
Before you can react, the same cold precision strikes. The method is identical, the same as the others - swift, deliberate, inescapable. 
Darkness creeps in, swallowing the room, swallowing you. 
The last thought in your mind is the same one that must have crossed every other team's: 
sthere is no escape.
299
    `);
    printLine(`<br>`);
    finalize();
  };

  const showEndingStay = () => {
    printLine(`<br>`);
    writeBlock(`
In your final moments, drifting between reality and darkness, you see him - the hunter- perfectly concealed in the shadows. 
His eyes, sharp and cold, fixed onto your own, almost mocking your stubbornness, your foolish pride.
"How could I have been so careless?" you think. The people you trusted the most... the ones you worked with, 
the ones you cared for... all illusions.
Why haven’t they left yet? The first half of my team. What can they do against an opponent who moves in the shadows, wields the skill of the agency's top operatives, 
and hides so completely that he doesn't even exist?
One last glance, and the truth hits you like a blade. “It's been you all along.” The hunter, the killer, the orchestrator of every death, every trap... 
it’s the government(ITG) itself. The system no one can beat.
299
    `);
    printLine(`<br>`);
    finalize();
  };
  
  const epilogueLine = () => {
    printLine(`<br>`)
    writeBlock(`Transmission...`)
    printLine(`<br>`)
    writeBlock(`
      "P ibpsa aol zfzalt av wyvalja jvuayvs. Uvd P't ivbuk if pa. 
      Pa hkhwaz, pa klzayvfz, pa ylibpskz - 
      huk pa dlhyz tl sprl h kpzwvzhisl thzr." 
      - pt zvyyf, Khptphu Ulcyhn 
      (Nvclyuvy Uhptphk)
      
      `);
      finalize();
  }

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
        `<span class="output">4. "...so you know who I really am"</span>`
      ].join("<br>");
    } else if (step === 1) {
      if (mode === "exitCode") {
        label.innerHTML = `<span class="output">Enter exit code:</span>`;
      } else if (mode === "tracker") {
        label.innerHTML = `<span class="output">did you find the tracker? (y/n)</span>`;
      } else if (mode === "killer") {
        // 🔹 Option 4 follow-up prompt
        label.innerHTML = `<span class="output">You should have realized by now...<br>Who is the killer?</span>`;
      }
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();

      const raw = input.value.trim();
      const val = raw.toLowerCase();

      // Step 0: Pick 1/2/3/4
      if (step === 0) {
        if (!["1", "2", "3", "4"].includes(val)) {
          input.value = "";
          return;
        }

        if (val === "1") {
          // Choice 1: always leaving ending
          showEndingLeave();
          epilogueLine();
          return;
        }

        if (val === "2") {
          // Choice 2: exit code check
          mode = "exitCode";
          step = 1;
          renderStep();
          return;
        }

        if (val === "3") {
          // Choice 3: tracker y/n → epilogue1/2
          mode = "tracker";
          step = 1;
          renderStep();
          return;
        }

        if (val === "4") {
          // 🔹 Choice 4: "You should have realized..." → killer question
          mode = "killer";
          step = 1;
          renderStep();
          return;
        }

        return;
      }

      // Step 1: exit code / tracker / killer
      if (step === 1) {
        if (mode === "exitCode") {
          // Compare to exitCode from config (case-insensitive)
          if (raw.toUpperCase() === exitCodeExpected.toUpperCase()) {
            showEndingLeave();
            epilogueLine();
          } else {
            showEndingStay();
            epilogueLine();
          }
          return;
        }

        if (mode === "tracker") {
          if (val === "y") {
            // found tracker → epilogue1
            showEndingLeave();
            epilogueLine();
            return;
          }
          if (val === "n") {
            // no tracker → epilogue2
            showEndingStay();
            epilogueLine();
            return;
          }

          // invalid input, ask again
          input.value = "";
          return;
        }

        if (mode === "killer") {
          // normalize answers
          const normalizedAnswers = killerAnswers.map((a) =>
            a.toLowerCase().trim()
          );

          if (normalizedAnswers.includes(val)) {
            // correct → special line then stay ending
            if (killerLine) {
              printLine(
                `<span class="output">${killerLine}</span>`
              );
            }
            showEndingStay();
            epilogueLine();
          } else {
            // wrong → leave ending
            showEndingLeave();
            epilogueLine();
          }
          return;
        }
      }
    });
  };

  renderStep();
};
