import { FFmpeg, fetchFile as _fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.6/dist/esm/index.js';

function resolveCoreURL(opt){
  // Usa coreURL si lo pasan; si pasan corePath (legacy), respétalo;
  // fallback a /libs con origin para evitar file://
  const u = opt?.coreURL || opt?.corePath || '/libs/ffmpeg-core.js';
  try { return new URL(u, location.origin).toString(); } catch { return location.origin + '/libs/ffmpeg-core.js'; }
}

// Emula API vieja: window.createFFmpeg(opts) -> instancia FFmpeg moderna
window.createFFmpeg = (opts = {}) => {
  const merged = {
    log: !!opts.log,
    coreURL: resolveCoreURL(opts),
  };
  return new FFmpeg(merged);
};

// Expone fetchFile
window.fetchFile = _fetchFile;

console.log('ffmpeg-shim loaded', { crossOriginIsolated: window.crossOriginIsolated });
