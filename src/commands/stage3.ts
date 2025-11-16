// src/commands/stage3.ts
import command from "../../config.json" assert { type: "json" };
import { lockInput, unlockInput, set3, unset3, epilogueSet, epilogueUnset } from "../main";
const STAGE3_DURATION_MS = 10 * 60 * 1000; // 10 minutes

let stage3Running = false;
let timerId: number | null = null;
let stage3EndTime: number | null = null;

export const STAGE3 = () => {
  set3();
  if (stage3Running) return; // avoid multiple instances

  const writeLinesAnchor = document.getElementById("write-lines");
  if (!writeLinesAnchor || !writeLinesAnchor.parentElement) return;
  const parent = writeLinesAnchor.parentElement as HTMLElement;

  stage3Running = true;
  stage3EndTime = Date.now() + STAGE3_DURATION_MS;

  const expectedCodonRaw = String(command.stage3Codon ?? "UUU GCU AAU GGU");
  const expectedWeaponRaw = String(command.stage3Weapon ?? "gun, pistol");
  const nameOptions: string[] = Array.isArray(command.stage3Names)
    ? command.stage3Names
    : [
        "Daimian Nevrag",
        "Kaelen Dravik",
        "Taren Vossar",
        "Luci Merath",
        "Rynar Valech",
        "Eldric Navar",
        "Corvin Dareth",
        "Ardian Krellin",
      ];
  const correctName = String(command.stage3CorrectName ?? "Daimian Nevrag");

  const normalizeSpaces = (s: string) =>
    s.trim().replace(/\s+/g, " ");

  const printLine = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    parent.insertBefore(div, writeLinesAnchor);
  };

  // Timer element
  const timerDiv = document.createElement("div");
  timerDiv.className = "stage3-timer";
  parent.insertBefore(timerDiv, writeLinesAnchor);

  const updateTimer = () => {
    if (!stage3EndTime) return;
    const remaining = stage3EndTime - Date.now();
    if (remaining <= 0) {
      timerDiv.textContent = "TIME REMAINING: 00:00";
      stopStage3("Time has expired.");
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    timerDiv.textContent = `TIME REMAINING: ${mm}:${ss}`;
  };

  const stopStage3 = (message: string) => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
    stage3Running = false;

    // remove input wrapper if present
    if (wrapper.parentElement) {
      wrapper.parentElement.removeChild(wrapper);
    }

    printLine(`<span class="output">${message}</span>`);
  };

  updateTimer();
  timerId = window.setInterval(updateTimer, 1000);

  // Wrapper for multi-step inputs
  const wrapper = document.createElement("div");
  wrapper.className = "stage3-wrapper";
  parent.insertBefore(wrapper, writeLinesAnchor);

  let currentStep = 0; // 0: codon, 1: weapon, 2: name

  const renderStep = () => {
    wrapper.innerHTML = "";

    // If time is already up, don't render anything
    if (!stage3EndTime || stage3EndTime - Date.now() <= 0) {
      return;
    }

    const label = document.createElement("div");
    label.className = "stage3-label";

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.className = "stage3-input";

    let optionsDiv: HTMLDivElement | null = null;

    if (currentStep === 0) {
      label.innerHTML = `<span class="output">CODON SEQUENCE:</span>`;
    } else if (currentStep === 1) {
      label.innerHTML = `<span class="output">WEAPON (weapon, type of weapon):</span>`;
    } else if (currentStep === 2) {
      label.innerHTML = `<span class="output">NAME (case-sensitive):</span>`;

      optionsDiv = document.createElement("div");
      optionsDiv.className = "stage3-options";
      const list = document.createElement("ul");

      nameOptions.forEach((name) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="output">${name}</span>`;
        list.appendChild(li);
      });

      optionsDiv.appendChild(list);
    }

    wrapper.appendChild(label);
    if (optionsDiv) wrapper.appendChild(optionsDiv);
    wrapper.appendChild(input);

    input.focus();

    const errorDiv = document.createElement("div");
    errorDiv.className = "stage3-error";
    wrapper.appendChild(errorDiv);

    const showError = (msg: string) => {
      errorDiv.innerHTML = `<span class="output">${msg}</span>`;
    };

    const restartAll = () => {
      currentStep = 0;
      renderStep();
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        // if time expired mid-typing, stop
        if (!stage3EndTime || stage3EndTime - Date.now() <= 0) {
          unlockInput();
          unset3();
          stopStage3("Time has expired.");
          return;
        }

        const value = input.value;

        if (currentStep === 0) {
          const normalizedInput = normalizeSpaces(value).toUpperCase();
          const normalizedExpected = normalizeSpaces(expectedCodonRaw).toUpperCase();

          if (normalizedInput === normalizedExpected) {
            currentStep = 1;
            renderStep();
          } else {
            showError("Incorrect. Restarting sequence.");
            setTimeout(restartAll, 1000);
          }
        } else if (currentStep === 1) {
          const normalizedInput = normalizeSpaces(value).toLowerCase();
          const normalizedExpected = normalizeSpaces(expectedWeaponRaw).toLowerCase();

          if (normalizedInput === normalizedExpected) {
            currentStep = 2;
            renderStep();
          } else {
            showError("Incorrect. Restarting sequence.");
            setTimeout(restartAll, 1000);
          }
        } else if (currentStep === 2) {
          const nameInput = value.trim(); // case-sensitive compare
          if (nameInput === correctName) {
            // Success: all three correct
            epilogueSet();
            stopStage3("ACCESS GRANTED.");
          } else {
            showError("Incorrect. Restarting sequence.");
            setTimeout(restartAll, 1000);
          }
        }
      }

      if (e.key === "Escape") {
        e.preventDefault();
        // optional: ignore Esc to truly trap them until time is up
        // or:
        // stopStage3("Stage3 aborted.");
      }
    });
  };

  renderStep();
};
