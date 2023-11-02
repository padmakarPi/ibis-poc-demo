export const calculateMaxHeight = (arrayLength: number, maxLength = 252) => {
  const oneRowHeight = 42;

  if (!arrayLength) return oneRowHeight;

  const calculateHeight = (arrayLength * oneRowHeight) > maxLength ? maxLength : arrayLength * oneRowHeight;

  return calculateHeight;
};
