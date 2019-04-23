<template>
    <div class="song-footer">
        <div class="tool-container">
            <div class="tool">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-jushoucang"></use>
                </svg>
            </div>
            <div class="tool">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiazai"></use>
                </svg>
            </div>
            <div class="tool">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xiaoxiduihuaxinxi"></use>
                </svg>
            </div>
            <div class="tool">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-gengduo"></use>
                </svg>
            </div>
        </div>
        <div class="progress-container">
            <div class="time">{{ currentDuration }}</div>
            <div class="progress" ref="progress">
                <div class="percent current"></div>
                <div class="percent load" :style="{ width: loadPercent }"></div>
                <div class="indicator"
                     @touchstart="touchstart"
                     @touchmove="touchmove"
                     @touchend="touchend">
                    <div></div>
                </div>
            </div>
            <div class="time total">{{ totalDuration }}</div>
        </div>
        <div class="play-tool-container">
            <div class="tool" @click="actionSwitchMode">
                <svg class="icon"
                     aria-hidden="true"
                     v-show="getterMode === playMode.ListLoop">
                    <use xlink:href="#icon-xunhuanbofang"></use>
                </svg>
                <svg class="icon"
                     aria-hidden="true"
                     v-show="getterMode === playMode.SongLoop">
                    <use xlink:href="#icon-danquxunhuan"></use>
                </svg>
                <svg class="icon"
                     aria-hidden="true"
                     v-show="getterMode === playMode.Random">
                    <use xlink:href="#icon-suijibofang"></use>
                </svg>
            </div>
            <div class="tool" @click="nextOrPrev('prev')">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-48shangyishou"></use>
                </svg>
            </div>
            <div class="tool" @click="togglePlay(!getterIsPlaying)">
                <svg class="icon" aria-hidden="true" v-show="!getterIsPlaying">
                    <use xlink:href="#icon-iconset0481"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-show="getterIsPlaying">
                    <use xlink:href="#icon-zanting"></use>
                </svg>
            </div>
            <div class="tool" @click="nextOrPrev('next')">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-49xiayishou"></use>
                </svg>
            </div>
            <div class="tool">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-gengduo1"></use>
                </svg>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { Song, PlayMode } from '../../../store/modules/player';
import { padLeftZeor } from '../../../utils';
import { player } from '../../../utils/audio';

// const audio: HTMLAudioElement = document.createElement('audio');
const audio: HTMLAudioElement = player();
let progressDom: HTMLElement | null = null;
let currentProgressDom: HTMLElement | null = null;
let indicatorDom: HTMLElement | null = null;
let canplay: boolean = false;
let touchStartX: number = 0;
let progressWidth: number = 0;
let indicatorDomLeft: number = 0;
let indicatorLeftPercent: number = 0;
let isTouched: boolean = false;

@Component
export default class PlayerFooter extends Vue {
    @State('playMode') statePlayMode!: string[];
    @Getter('mode') getterMode!: string;
    @Getter('isPlaying') getterIsPlaying!: boolean;
    @Getter('currentSong') getterCurrentSong!: Song;
    @Action('setSongAudioUrl') actionSetSongAudioUrl!: Function;
    @Action('togglePlay') actionTogglePlay!: Function;
    @Action('switchMode') actionSwitchMode!: Function;

    loadPercent: string = '0%';
    currentDuration: string = '00:00';
    totalDuration: string = '00:00';
    playMode = PlayMode;

    @Watch('getterCurrentSong', { immediate: true })
    onCurrentSongChanged (val: Song): void {
        this.currentDuration = '00:00';
        if (val) {
            canplay = false;
            this.loadPercent = '0%';
            audio.src = `https://music.163.com/song/media/outer/url?id=${val.id}.mp3`;
            this.totalDuration = this.formatDuration(val.duration);
            this.$emit('bgurl', `//music.163.com/api/img/blur/${val.pic}`);
        }
    }

    created (): void {
        this.audioListener();
        this.$nextTick(() => {
            progressDom = (this.$refs as any).progress;
            if (progressDom) {
                progressWidth = progressDom.offsetWidth;
                currentProgressDom = progressDom.querySelector('.current');
                indicatorDom = progressDom.querySelector('.indicator');
            }
        });
    }

    play (): void {
        if (this.getterIsPlaying) void audio.play();
    }

    togglePlay (status: boolean) {
        this.actionTogglePlay(status);
        if (!status) {
            audio.pause();
        } else {
            if (canplay) {
                audio.play()
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }

    nextOrPrev (action: string) {
        const prevSongId = this.getterCurrentSong.id;
        canplay = false;
        this.$emit('change-song', action);
        // 解决只有一首歌切换时，暂停后就无法播放
        if (prevSongId === this.getterCurrentSong.id) canplay = true;
        this.togglePlay(true);
    }

    formatDuration (milliseconds: number): string {
        const seconds: number = milliseconds / 1000;
        const totalMinutes: string = padLeftZeor(Math.floor(seconds / 60));
        const totalSeconds: string = padLeftZeor(Math.floor(seconds % 60));
        return `${totalMinutes}:${totalSeconds}`;
    }

    audioListener (): void {
        const that = this;
        let currentTime: number = 0;
        player({
            onCanplay (): void {
                canplay = true;
                if (that.getterIsPlaying) {
                    audio.play()
                        .catch(err => {
                            console.error(err);
                            that.togglePlay(false);
                        });
                }
            },
            onProgress (): void {
                const duration: number = audio.duration;
                if (duration > 0) {
                    const buffered: TimeRanges = audio.buffered;
                    const len: number = buffered.length;
                    for (let i: number = 0; i < len; i++) {
                        if (buffered.start(len - 1 - i) < audio.currentTime) {
                            that.loadPercent = `${Math.floor((buffered.end(len - 1 - i) / duration) * 100)}%`;
                            break;
                        }
                    }
                }
            },
            onTimeupdate (): void {
                if (isTouched) return;
                const _time: number = parseInt(audio.currentTime + '', 10);
                if (currentTime !== _time) {
                    const time: number = audio.currentTime * 1000;
                    currentTime = _time;
                    if (that.getterCurrentSong) {
                        const width: number = Math.ceil(time / that.getterCurrentSong.duration * progressWidth);
                        if (indicatorDom) indicatorDom.style.left = `${width}px`;
                        if (currentProgressDom) currentProgressDom.style.width = `${width}px`;
                    }
                    that.currentDuration = that.formatDuration(time);
                }
            },
            onEnded (): void {
                if (PlayMode.SongLoop === that.getterMode) {
                    audio.currentTime = 0;
                    that.play();
                } else {
                    that.nextOrPrev('next');
                }
            }
        });
        /* audio.addEventListener('canplay', function () {
            canplay = true;
            if (that.getterIsPlaying) {
                audio.play()
                    .catch(err => {
                        console.error(err);
                        that.togglePlay(false);
                    });
            }
        }); */
        /*audio.addEventListener('progress', function () {
            const duration: number = this.duration;
            if (duration > 0) {
                const buffered: TimeRanges = this.buffered;
                const len: number = buffered.length;
                for (let i: number = 0; i < len; i++) {
                    if (buffered.start(len - 1 - i) < this.currentTime) {
                        that.loadPercent = `${Math.floor((buffered.end(len - 1 - i) / duration) * 100)}%`;
                        break;
                    }
                }
            }
        });*/
        /*audio.addEventListener('timeupdate', function (): void {
            if (isTouched) return;
            const _time: number = parseInt(this.currentTime + '', 10);
            if (currentTime !== _time) {
                const time: number = this.currentTime * 1000;
                currentTime = _time;
                if (that.getterCurrentSong) {
                    const width: number = Math.ceil(time / that.getterCurrentSong.duration * progressWidth);
                    if (indicatorDom) indicatorDom.style.left = `${width}px`;
                    if (currentProgressDom) currentProgressDom.style.width = `${width}px`;
                }
                that.currentDuration = that.formatDuration(time);
            }
        });*/
        /*audio.addEventListener('ended', function () {
            if (PlayMode.SongLoop === that.getterMode) {
                this.currentTime = 0;
                that.play();
            } else {
                that.nextOrPrev('next');
            }
        });*/
    }

    touchstart (e: any): void {
        isTouched = true;
        if (indicatorDom) indicatorDomLeft = indicatorDom.offsetLeft;
        touchStartX = e.touches[0].pageX;
    }

    touchmove (e: TouchEvent): void {
        let left = e.touches[0].pageX - touchStartX + indicatorDomLeft;
        if (left < 0) left = 0;
        if (left > progressWidth) left = progressWidth;
        if (indicatorDom) indicatorDom.style.left = `${left}px`;
        if (currentProgressDom) currentProgressDom.style.width = `${left}px`;
        indicatorLeftPercent = left / progressWidth;
        if (this.getterCurrentSong) {
            this.currentDuration = this.formatDuration(indicatorLeftPercent * this.getterCurrentSong.duration);
        }
    }

    touchend (): void {
        isTouched = false;
        if (this.getterCurrentSong) audio.currentTime = indicatorLeftPercent * this.getterCurrentSong.duration / 1000;
    }

    mousedown (e: MouseEvent) {
        e.preventDefault();
        const startX: number = e.pageX;
        let offsetLeft: number = 0;
        if (indicatorDom) offsetLeft = indicatorDom.offsetLeft;
        document.body.onmousemove = (de: MouseEvent) => {
            let left: number = de.pageX - startX + offsetLeft;
            if (left < 0) left = 0;
            if (left > progressWidth) left = progressWidth;
            if (indicatorDom) indicatorDom.style.left = `${left}px`;
            if (currentProgressDom) currentProgressDom.style.width = `${left}px`;
        };
        document.body.onmouseup = () => {
            document.body.onmousemove = null;
        };
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/variable';

.song-footer {
    height: 100%;
    @include flexbox(center, space-evenly, column);

    & > div {
        width: 100%;
    }

    .tool-container, .play-tool-container {
        @include flexbox(center, space-evenly);

        .tool {
            padding: 8px;

            .icon {
                color: #fff;
                font-size: 22px;
            }
        }
    }

    .progress-container {
        @include flexbox;
        padding: 0 14px;

        .time {
            font-size: 10px;
            color: #fff;

            &.total {
                color: #adadad;
            }
        }

        .progress {
            @include flex-item;
            margin: 0 14px;
            height: 2px;
            border-radius: 6px;
            background-color: rgba(255, 255, 255, .1);
            position: relative;

            .percent {
                position: absolute;
                left: 0;
                top: 0;
                width: 0;
                height: 100%;
                border-radius: 6px;

                &.current {
                    z-index: 2;
                    background-color: $themeColor;
                }

                &.load {
                    z-index: 1;
                    background-color: #717171;
                }
            }

            .indicator {
                position: absolute;
                top: 50%;
                left: 0;
                width: 26px;
                height: 26px;
                padding: 4px;
                z-index: 3;
                transform: translate(-13px, -13px);

                div {
                    border: 6px solid #fff;
                    background-color: $themeColor;
                    border-radius: 50%;
                    height: 100%;
                }
            }
        }
    }

    .play-tool-container {

        .tool:nth-child(3) {
            .icon {
                font-size: 34px;
            }
        }
    }
}
</style>
