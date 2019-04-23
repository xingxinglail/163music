const audio = document.createElement('audio');
export function player(options) {
    if (options) {
        if (options.onCanplay)
            audio.addEventListener('canplay', options.onCanplay);
        if (options.onProgress)
            audio.addEventListener('progress', options.onProgress);
        if (options.onTimeupdate)
            audio.addEventListener('timeupdate', options.onTimeupdate);
        if (options.onEnded)
            audio.addEventListener('ended', options.onEnded);
    }
    return audio;
}
//# sourceMappingURL=audio.js.map