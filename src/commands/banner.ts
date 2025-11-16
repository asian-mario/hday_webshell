import command from '../../config.json' assert { type: 'json' };

const createBanner = (): string[] => {
  const banner: string[] = [];

  banner.push("<br>");

  // turn the single string into an array of lines
  const asciiLines = command.ascii.split("\n");

  asciiLines.forEach((ele: string) => {
    let bannerString = "";

    // this is for the ascii art
    for (let i = 0; i < ele.length; i++) {
      if (ele[i] === " ") {
        bannerString += "&nbsp;";
      } else {
        bannerString += ele[i];
      }
    }

    const eleToPush = `<pre>${bannerString}</pre>`;
    banner.push(eleToPush);
  });

  banner.push("<br>");
  banner.push("Welcome to GovShell v12.3.8");
  banner.push("Type <span class='command'>'help'</span> for a list of all available commands.");
  banner.push("<span class='command'>good luck.</span>");
  banner.push("<br>");

  return banner;
};

export const BANNER = createBanner();
