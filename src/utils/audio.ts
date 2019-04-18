const audio: HTMLAudioElement = document.createElement('audio');

interface PlayerOptions {
    onCanplay ? (): void;
    onProgress ? (): void;
    onTimeupdate ? (): void;
    onEnded ? (): void;
}

export function player (options?: PlayerOptions): HTMLAudioElement {
    if (options) {
        if (options.onCanplay) audio.addEventListener('canplay', options.onCanplay);
        if (options.onProgress) audio.addEventListener('progress', options.onProgress);
        if (options.onTimeupdate) audio.addEventListener('timeupdate', options.onTimeupdate);
        if (options.onEnded) audio.addEventListener('ended', options.onEnded);
    }
    return audio;
}
