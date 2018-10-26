let startTime = undefined;

export const startTimer = () => {
  startTime = new Date().getTime();
};

export const getElapsedTime = () => {
  return new Date().getTime() - startTime;
};
