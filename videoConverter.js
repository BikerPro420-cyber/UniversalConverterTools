const ffmpeg = require(''fluent-ffmpeg'');
const path = require(''path'');
const fs = require(''fs'').promises;
const { exec } = require(''child_process'');
const util = require(''util'');
const execAsync = util.promisify(exec);

class VideoConverter {
    async convert(inputPath, targetFormat, resolution = ''720'') {
        return new Promise(async (resolve, reject) => {
            try {
                const outputFileName = `converted-${Date.now()}.${targetFormat}`;
                const outputPath = path.join(__dirname, ''../downloads'', outputFileName);

                // Check if FFmpeg is available
                try {
                    await execAsync(''ffmpeg -version'');
                } catch {
                    throw new Error(''FFmpeg is not installed. Please install FFmpeg to enable video conversion.'');
                }

                const command = ffmpeg(inputPath);

                // Set resolution if provided
                if (resolution && resolution !== ''original'') {
                    command.size(this.getResolution(resolution));
                }

                // Set format-specific options
                if (targetFormat === ''gif'') {
                    command.videoCodec(''gif'');
                } else {
                    command.videoCodec(''libx264'');
                }

                command
                    .format(targetFormat)
                    .on(''error'', (err) => {
                        reject(new Error(`Video conversion failed: ${err.message}`));
                    })
                    .on(''end'', async () => {
                        try {
                            const stats = await fs.stat(outputPath);
                            resolve({
                                fileName: outputFileName,
                                fileSize: stats.size,
                                format: targetFormat,
                                resolution: resolution
                            });
                        } catch (statsError) {
                            reject(new Error(`Failed to get file stats: ${statsError.message}`));
                        }
                    })
                    .save(outputPath);

            } catch (error) {
                reject(error);
            }
        });
    }

    getResolution(resolution) {
        const resolutions = {
            ''480'': ''854x480'',
            ''720'': ''1280x720'',
            ''1080'': ''1920x1080''
        };
        return resolutions[resolution] || null;
    }
}

module.exports = new VideoConverter();
