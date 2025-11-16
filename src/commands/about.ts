import command from '../../config.json' assert {type: 'json'};

const createAbout = () : string[] => {
  const about : string[] = [];

  about.push("<br>");
  about.push(command.aboutGreeting);
  about.push("<br>");

  return about
}

export const ABOUT = createAbout();
