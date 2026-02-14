/**
 * Maximum file size for image uploads (2MB)
 * This limit helps prevent canister call failures due to payload size
 */
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validates an image file and converts it to a data URL
 * @param file - The image file to validate and convert
 * @returns Promise resolving to the data URL string
 * @throws Error with user-friendly message if validation fails
 */
export async function convertImageToDataUrl(file: File): Promise<string> {
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`Image is too large (${sizeMB}MB). Please select an image smaller than 2MB`);
  }

  // Convert to data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
}
