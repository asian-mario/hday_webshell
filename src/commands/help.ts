import { isStage1Complete } from "./stage1";
//import { isStage2Complete } from "./stage2";
import command from "../../config.json" assert { type: "json" };

const createHelp = (): string[] => {
  const help: string[] = [];
  help.push("<br>");

  // Determine stage1 description dynamically
  const stage1Description = isStage1Complete()
    ? `ACCESS GRANTED : ${command.stage1Code}` 
    : "[CLASSIFIED] : REQUIRES CODE.";

  const stage2Description = isStage1Complete()
    ? `ACCESS GRANTED : ${command.stage2Code}` 
    : "[CLASSIFIED] : REQUIRES CODE.";

  const helpObj = {
    commands: [
      ["'whoami'", "A perplexing question."],
      ["'stage1'", stage1Description],
      ["'stage2'", "[CLASSIFIED] : REQUIRES CODE."],
      ["'banner'", "Display the banner."],
      ["'clear'", "Clear the terminal."]
    ]
  };

  helpObj.commands.forEach((ele) => {
    const SPACE = "&nbsp;";
    let string = "";
    string += SPACE.repeat(2);
    string += `<span class='command'>${ele[0]}</span>`;
    string += SPACE.repeat(17 - ele[0].length);
    string += ele[1];
    help.push(string);
  });

  help.push("<br>");
  help.push("Press <span class='keys'>[Tab]</span> for auto completion.");
  help.push("Press <span class='keys'>[Esc]</span> to clear the input line.");
  help.push("Press <span class='keys'>[↑][↓]</span> to scroll through your history of commands.");
  help.push("<br>");

  return help;
};

// Instead of exporting a static array, export a *function*
export const HELP = () => createHelp();
