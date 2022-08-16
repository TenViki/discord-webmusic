const bacgroundChoice = ["https://unsplash.it/1920/1080?random"];

export const getBackgroundImage = () => {
  return bacgroundChoice[Math.floor(Math.random() * bacgroundChoice.length)];
};
