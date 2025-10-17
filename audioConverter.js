const ffmpeg = require(''fluent-ffmpeg'');
const path = require(''path'');
const fs = require(''fs'').promises;
const { exec } = require(''child_process'');
const util = require(''util'');
const execAsync = util.promisify(exec);

class AudioConverter {
    async convert(inputPath, targetFormat, bitrate = ''192k'') {
        return new Promise(async (resolve, reject) => {
            try {
                const outputFileName = `converted-${Date.now()}.${targetFormat}`;
                const outputPath = path.join(__dirname, ''../downloads'', outputFileName);

                // Check if FFmpeg is available
                try {
                    await execAsync(''ffmpeg -version'');
                } catch {
                    throw new Error(''FFmpeg is not installed. Please install FFmpeg to enable audio conversion.'');
                }

                ffmpeg(inputPath)
                    .audioBitrate(bitrate)
                    .audioCodec(this.getAudioCodec(targetFormat))
                    .format(targetFormat)
                    .on(''error'', (err) => {
                        reject(new Error(`Audio conversion failed: ${err.message}`));
                    })
                    .on(''end'', async () => {
                        try {
                            const stats = await fs.stat(outputPath);
                            resolve({
                                fileName: outputFileName,
                                fileSize: stats.size,
                                format: targetFormat,
                                bitrate: bitrate
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

    getAudioCodec(format) {
        const codecs = {
            ''mp3'': ''libmp3lame'',
            ''wav'': ''pcm_s16le'',
            ''flac'': ''flac'',
            ''aac'': ''aac'',
            ''ogg'': ''libvorbis'',
            ''m4a'': ''aac''
        };
        return codecs[format] || ''copy'';
    }
}

module.exports = new AudioConverter();
