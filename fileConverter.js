const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const unzipper = require('unzipper');  // Optional: Use for unzipping
const unrar = require('node-unrar');   // Optional: Use for unrar

class FileConverter {
    async convert(inputPath, targetFormat) {
        try {
            const outputFileName = `converted-${Date.now()}.${targetFormat}`;
            const outputPath = path.join(__dirname, '../downloads', outputFileName);

            // File conversion logic
            if (targetFormat === 'zip') {
                await this.convertToZip(inputPath, outputPath);
            } else if (targetFormat === 'rar') {
                await this.convertToRar(inputPath, outputPath);
            } else {
                throw new Error(`File conversion to ${targetFormat} is not supported.`);
            }

            const stats = await fs.stat(outputPath);
            return {
                fileName: outputFileName,
                fileSize: stats.size,
                format: targetFormat
            };
        } catch (error) {
            throw new Error(`File conversion failed: ${error.message}`);
        }
    }

    async convertToZip(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => resolve());
            archive.on('error', (err) => reject(err));

            archive.pipe(output);
            archive.file(inputPath, { name: path.basename(inputPath) });
            archive.finalize();
        });
    }

    async convertToRar(inputPath, outputPath) {
        // Example logic for RAR conversion using node-unrar or any other library
        const unrarInstance = unrar(inputPath);
        unrarInstance.extractAll(outputPath, (err) => {
            if (err) {
                throw new Error(`RAR conversion failed: ${err.message}`);
            }
        });
    }
}

module.exports = new FileConverter();
