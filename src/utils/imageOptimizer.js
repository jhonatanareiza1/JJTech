// ==========================================
// JJ TECH - CLIENT-SIDE IMAGE OPTIMIZER
// ==========================================

/**
 * Resizes and compresses an image File using HTML5 Canvas
 * Produces an optimized Base64 JPEG data URL suitable for localStorage & responsive UI.
 * 
 * @param {File} file - Selected image file
 * @param {number} maxWidth - Maximum width (default: 1000px)
 * @param {number} maxHeight - Maximum height (default: 1000px)
 * @param {number} quality - JPEG compression quality 0-1 (default: 0.82)
 * @returns {Promise<string>} Base64 data URL
 */
export const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio constrained dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized Base64 JPEG
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedDataUrl);
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};
