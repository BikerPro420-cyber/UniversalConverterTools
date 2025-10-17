const sharp = require(''sharp'');
const path = require(''path'');
const fs = require(''fs'').promises;

class ImageConverter {
    async convert(inputPath, targetFormat, quality = 80) {
        try {
            const outputFileName = `converted-${Date.now()}.${targetFormat}`;
            const outputPath = path.join(__dirname, ''../downloads'', outputFileName);

            let sharpInstance = sharp(inputPath);

            // Configure based on format and quality
            const options = {
                jpeg: { quality: parseInt(quality) },
                jpg: { quality: parseInt(quality) },
                png: { compressionLevel: 9, quality: parseInt(quality) },
                webp: { quality: parseInt(quality) },
                avif: { quality: parseInt(quality) }
            };

            await sharpInstance
                .toFormat(targetFormat, options[targetFormat] || {})
                .toFile(outputPath);

            const stats = await fs.stat(outputPath);
            
            return {
                fileName: outputFileName,
                fileSize: stats.size,
                format: targetFormat
            };
        } catch (error) {
            throw new Error(`Image conversion failed: ${error.message}`);
        }
    }
}

module.exports = new ImageConverter();
