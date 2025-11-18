import command from '../../config.json' assert { type: 'json' };

const sleepBanner = (): string[] => {
  const banner: string[] = [];

  banner.push("<br>");

  // turn the single string into an array of lines
  const asciiLines = command.snoopyascii.split("\n");

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
  banner.push("goodnight.");

  return banner;
};

export const SLEEPBANNER = sleepBanner();
