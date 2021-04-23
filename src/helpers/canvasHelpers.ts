const getCanvasDimensionsScaledForImage = (
  cvWidth: number,
  imageWidth: number,
  imageHeight: number
) => {
  if (imageWidth <= cvWidth) {
    return [imageWidth, imageHeight, 1];
  }
  const scalingRatio = cvWidth / imageWidth;
  return [cvWidth, scalingRatio * imageHeight, scalingRatio];
};

export { getCanvasDimensionsScaledForImage };
