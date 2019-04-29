<template>
    <transition name="fade">
        <div class="lyric" v-show="visibile" @click="close">
            <div class="scroll-container" ref="scroll">
                <ul>
                    <li v-for="(item, index) in lyricData"
                        :key="item.time"
                        :class="{ active: prevIndex === index }"
                        ref="lis">{{ item.text }}</li>
                </ul>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import BScroll from 'better-scroll';
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { player } from '../../../utils/audio';
import { setSessionItem, getSessionItem } from '../../../utils';
import { getSongLyric } from '../../../api';

let bscroll: BScroll | null = null;
const parseReg: RegExp = /\[\d*:\d*((\.|\:)\d*)*\]/g;
const parseReg2: RegExp = /\d*,\d*/g;
let liDoms: HTMLLIElement[] | null = null;
let mode: number = 1; // 1 正常歌词  2 过渡歌词
let isGetLyric: boolean = true; // 是否需要获取歌词
const saveKey: string = 'lyric';

enum SongType {
    Normal = 1, // 正常歌词
    Advance = 2, // 推进歌词
    None = 3 // 无歌词
}

@Component
export default class Lyric extends Vue {
    @Prop({ type: Boolean, default: false }) readonly visibile!: boolean;
    @Prop(String) readonly id!: string;

    songType: SongType = SongType.Normal;
    prevIndex: number = 0;
    lyric: string = '';
    lyricData: any[] = [];

    created (): void {
        const that = this;
        player({
            onTimeupdate () {
                if (!that.visibile) return;
                const { lyricData } = that;
                let currentTime: number = (this as HTMLAudioElement).currentTime * 1000;
                if (currentTime >= lyricData[that.prevIndex].time) {
                    let percent: number = (currentTime - lyricData[that.prevIndex].time) / lyricData[that.prevIndex].totalProgress;
                    percent = Math.floor(percent * 100);
                    if (percent > 100) percent = 100;
                    if (liDoms) liDoms[that.prevIndex].style.backgroundPosition = `${100 - percent}% 50%`;
                }
                for (let i = lyricData.length - 1; i >= 0; i--) {
                    if (i === that.prevIndex) return;
                    if (currentTime >= lyricData[i].time) {
                        that.prevIndex = i;
                        that.scrollToElement(that.prevIndex);
                        break;
                    }
                }
                /* if (currentTime !== _time) {
                    const time: number = audio.currentTime * 1000;
                    currentTime = _time;
                    if (that.getterCurrentSong) {
                        const width: number = Math.ceil(time / that.getterCurrentSong.duration * progressWidth);
                        if (indicatorDom) indicatorDom.style.left = `${width}px`;
                        if (currentProgressDom) currentProgressDom.style.width = `${width}px`;
                    }
                    that.currentDuration = that.formatDuration(time);
                } */
            }
        });
    }

    scrollToElement (index: number): void {
        if (bscroll && liDoms) bscroll.scrollToElement(liDoms[index], 500);
    }

    async getSongLyric (): Promise<void> {
        try {
            if (this.lyricData.length > 0) {
                this.lyricData = [];
                this.$nextTick(() => {
                    if (bscroll) bscroll.refresh();
                });
            }
            isGetLyric = false;
            const lrcData: string | null = getSessionItem(saveKey);
            console.log(lrcData);
            if (lrcData === null) {
                const res = await getSongLyric(this.id);
                console.log(res);
                const data = Object.create(null);
                const _lrcData = {
                    type: SongType.Normal,
                    lrc: ''
                };
                const { klyric, lrc } = res;
                if (klyric && klyric.lyric) {
                    this.lyricParse2(klyric.lyric);
                    this.songType = SongType.Advance;
                    _lrcData.lrc = klyric.lyric;
                    _lrcData.type = this.songType;
                    data[this.id] = _lrcData;
                    setSessionItem(saveKey, JSON.stringify(data));
                } else {
                    if (lrc && lrc.lyric) {
                        this.lyricParse(lrc.lyric);
                        this.songType = SongType.Normal;
                        _lrcData.lrc = lrc.lyric;
                        _lrcData.type = this.songType;
                        data[this.id] = _lrcData;
                        setSessionItem(saveKey, JSON.stringify(data));
                    } else {
                        this.songType = SongType.None;
                        _lrcData.type = this.songType;
                        data[this.id] = _lrcData;
                        setSessionItem(saveKey, JSON.stringify(data));
                    }
                }
            } else {
                const data = JSON.parse(lrcData);
                const lyricData = data[this.id];
                console.log(lyricData);
                if (lyricData) {
                    this.songType = lyricData.type;
                    if (lyricData.type === SongType.Normal) {
                        this.lyricParse(lyricData.lrc);
                    } else if (lyricData.type === SongType.Advance) {
                        this.lyricParse2(lyricData.lrc);
                    }
                }
            } // todo 缓存里没有的情况
            // if (lyric) this.lyricParse2(lyric);
        } catch (err) {
            console.error(err);
        }
    }

    close (): void {
        this.$emit('update:visibile', false);
    }

    initBScroll (): void {
        bscroll = new BScroll((this.$refs as any).scroll, {
            click: true
        });
    }

    lyricParse (lyric: string): void {
        const lyricList: string[] = lyric.split(/\n/);
        const lyricData: any[] = [];
        lyricList.forEach((c: string, i: number): void => {
            const parse = c.match(parseReg);
            if (parse) {
                const str: string = parse[0].substring(1, parse[0].length - 1);
                const timeArr: any[] = str.split(':');
                const minutes2Seconds: number = timeArr[0] * 1 * 60;
                const seconds: number = timeArr[1] * 1;
                const data = {
                    time: Math.floor((minutes2Seconds + seconds) * 1000) / 1000,
                    text: c.replace(parseReg, '')
                };
                if (data.text) lyricData.push(data);
            }
        });
        this.lyricData = lyricData;
        this.$nextTick(() => {
            if (!bscroll) this.initBScroll();
            liDoms = (this.$refs as any).lis;
        });
        console.log(lyricData);
    }

    lyricParse2 (lyric: string): void {
        const lyricList: string[] = lyric.split(/\n/);
        const lyricData: any[] = [];
        lyricList.forEach((c: string, i: number): void => {
            const parse = c.match(parseReg2);
            if (parse) {
                const timeStr: string | undefined = parse.shift();
                let timeArr: any[] | null = null;
                let time: number | null = null;
                let totalProgress: number | null = null;
                if (timeStr) timeArr = timeStr.split(',');
                if (timeArr) time = timeArr[0] * 1;
                if (timeArr) totalProgress = timeArr[1] * 1;
                // const progressArr: number[] = new Array(parse.length);
                /*parse.forEach((p: string, pi: number): void => {
                    const str: any[] = p.split(',');
                    progressArr[pi] = str[1] * 1;
                });*/
                const data = {
                    time,
                    totalProgress,
                    // progressArr,
                    text: c.replace(/[\d,()[\]]/g, '')
                };
                if (data.text) lyricData.push(data);
            }
        });
        this.lyricData = lyricData;
        this.$nextTick(() => {
            if (!bscroll) this.initBScroll();
            liDoms = (this.$refs as any).lis;
        });
        console.log(lyricData);
    }

    @Watch('id')
    onIdChanged (v: string) {
        if (this.visibile) {
            console.log(555);
        } else {
            isGetLyric = true;
        }
    }

    @Watch('visibile')
    onVisibileChanged (v: boolean) {
        if (v && isGetLyric) {
            void this.getSongLyric();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/variable';

.lyric {
    position: absolute;
    top: 46px;
    left: 0;
    width: 100%;
    height: calc(84vh - 46px);
    z-index: 6;
    overflow-y: hidden;

    .scroll-container {
        position: absolute;
        top: 28%;
        left: 0;
        width: 100%;
        height: 72%;
        z-index: 1;

        ul {
            @include flexbox(center, normal, column);
            padding: 0 18%;
            font-size: 14px;
            color: #999;

            li {
                padding: 10px 0;
                color: transparent;
                background-image: linear-gradient(to right, #fff 50%, #b3b3b3 55%);
                background-size: 220% 100%;
                background-position: 100% 50%;
                -webkit-background-clip: text;

                &.active {
                    transition: background-position .3s linear;
                }
            }
        }
    }
}
</style>
