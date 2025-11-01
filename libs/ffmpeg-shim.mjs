/* /libs/ffmpeg-shim.mjs */
import * as mod from "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.6/dist/esm/index.js";

/** Polyfill de la API vieja: createFFmpeg({ corePath|coreURL, log }) */
if (!window.createFFmpeg) {
  window.createFFmpeg = (opts = {}) => {
    const { corePath, coreURL, log } = opts || {};
    return new mod.FFmpeg({
      log: !!log,
      coreURL: coreURL || corePath || "/libs/ffmpeg-core.js",
    });
  };
}

/** fetchFile de cortesía si no existe */
if (!window.fetchFile) {
  window.fetchFile = async (src) => {
    if (typeof src === "string") {
      const res = await fetch(src);
      const buf = await res.arrayBuffer();
      return new Uint8Array(buf);
    }
    if (src instanceof Blob) {
      const buf = await src.arrayBuffer();
      return new Uint8Array(buf);
    }
    if (src instanceof ArrayBuffer) return new Uint8Array(src);
    if (ArrayBuffer.isView(src)) return new Uint8Array(src.buffer);
    throw new Error("Unsupported fetchFile input");
  };
}

console.log("ffmpeg-shim loaded", { createFFmpeg: typeof window.createFFmpeg });
