/**
 * Compresses an image file to reduce payload size for API uploads
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum size in MB (default: 0.5MB)
 * @param maxWidthOrHeight - Maximum dimension in pixels (default: 1920px)
 * @returns Promise resolving to compressed base64 data URL
 */
export async function compressImage(
    file: File,
    maxSizeMB: number = 0.5,
    maxWidthOrHeight: number = 1920,
): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidthOrHeight) {
                        height = (height * maxWidthOrHeight) / width;
                        width = maxWidthOrHeight;
                    }
                } else {
                    if (height > maxWidthOrHeight) {
                        width = (width * maxWidthOrHeight) / height;
                        height = maxWidthOrHeight;
                    }
                }

                // Create canvas and draw resized image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Try different quality levels to meet size requirement
                let quality = 0.9;
                let dataUrl = canvas.toDataURL('image/jpeg', quality);

                // Iteratively reduce quality if size is still too large
                while (
                    dataUrl.length > maxSizeMB * 1024 * 1024 &&
                    quality > 0.1
                ) {
                    quality -= 0.1;
                    dataUrl = canvas.toDataURL('image/jpeg', quality);
                }

                resolve(dataUrl);
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}
