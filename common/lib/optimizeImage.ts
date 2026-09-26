import { MAX_IMAGE_LENGTH } from '@/common/constants/limits';

const MAX_SIZE = 700;
const QUALITY = 0.85;

// Returns the size that fits in a MAX_SIZE square and keeps the aspect ratio.
export const getFitSize = (width: number, height: number, maxSize = MAX_SIZE) => {
  const scale = Math.min(1, maxSize / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

// Returns the canvas as a data URI that the server accepts. PNG keeps the
// content exact. A PNG that is too large falls back to WEBP.
export const canvasToDataUri = (canvas: HTMLCanvasElement) => {
  const png = canvas.toDataURL('image/png');
  if (png.length <= MAX_IMAGE_LENGTH) return png;

  const webp = canvas.toDataURL('image/webp', 0.9);
  if (webp.length <= MAX_IMAGE_LENGTH) return webp;

  throw new Error('The image is too large.');
};

// Makes the image smaller and returns it as a data URI.
export const optimizeImage = async (file: Blob): Promise<string> => {
  const bitmap = await createImageBitmap(file);
  const { width, height } = getFitSize(bitmap.width, bitmap.height);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser cannot draw images.');

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Browsers that cannot write WEBP return PNG.
  const uri = canvas.toDataURL('image/webp', QUALITY);
  if (uri.length > MAX_IMAGE_LENGTH) throw new Error('The image is too large.');
  return uri;
};
