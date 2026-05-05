/**
 * Compress and resize an image file to a maximum dimension,
 * returning a base64-encoded JPEG string.
 *
 * @param {File} file - The image file to process
 * @param {number} maxSize - Maximum width or height in pixels (default 1024)
 * @param {number} quality - JPEG quality 0–1 (default 0.8)
 * @returns {Promise<{base64: string, mimeType: string}>}
 */
export async function compressImage(file, maxSize = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down if necessary
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height / width) * maxSize);
            width = maxSize;
          } else {
            width = Math.round((width / height) * maxSize);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1];

        resolve({ base64, mimeType: 'image/jpeg' });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a File to a preview URL
 * @param {File} file
 * @returns {string}
 */
export function createPreviewUrl(file) {
  return URL.createObjectURL(file);
}
