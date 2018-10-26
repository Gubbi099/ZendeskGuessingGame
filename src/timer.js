let startTime = undefined;
let stopTime = undefined;

export const startTimer = () => {
  startTime = new Date().getTime();
  stopTime = undefined;
};

export const stopTimer = () => {
  stopTime = new Date().getTime();
};

export const resetTimer = () => {
  startTime = undefined;
  stopTime = undefined;
};

export const getElapsedTime = () => {
  if (!startTime) return null;

  return stopTime ? stopTime - startTime : new Date().getTime() - startTime;
};
