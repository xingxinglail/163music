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
import { getSongLyric } from '../../../api';

let bscroll: BScroll | null = null;
const parseReg: RegExp = /\[\d*:\d*((\.|\:)\d*)*\]/g;
const parseReg2: RegExp = /\d*,\d*/g;
let liDoms: HTMLLIElement[] | null = null;
let mode: number = 1; // 1 正常歌词  2 过渡歌词

@Component
export default class Lyric extends Vue {
    @Prop({ type: Boolean, default: false }) readonly visibile!: boolean;
    @Prop(String) readonly id!: string;

    prevIndex: number = 0;
    lyric: string = '';
    lyricData: any[] = [];

    created (): void {
        const that = this;
        player({
            onTimeupdate () {
                const { lyricData } = that;
                let currentTime: number = (this as HTMLAudioElement).currentTime * 1000;
                if (currentTime >= lyricData[that.prevIndex].time) {
                    const p: number = (currentTime - lyricData[that.prevIndex].time) / lyricData[that.prevIndex].totalProgress;
                    console.log('-------->' + Math.floor(p * 100));
                }
                for (let i = lyricData.length - 1; i >= 0; i--) {
                    if (currentTime >= lyricData[i].time) {
                        if (that.prevIndex !== i) {
                            that.prevIndex = i;
                            that.scrollToElement(that.prevIndex);
                        }
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
            console.log(window.localStorage.getItem('klyric'));
            console.log(window.localStorage.getItem('lrc'));
            const lyric: string | null = window.localStorage.getItem('klyric');
            /* const res = await getSongLyric(this.id);
            if (res.klyric) {
                window.localStorage.setItem('klyric', res.klyric.lyric)
                window.localStorage.setItem('lrc', res.lrc.lyric)
            } */
            if (lyric) this.lyricParse2(lyric);
        } catch (err) {
            console.error(err);
        }
    }

    close (): void {
        this.$emit('update:visibile', false);
    }

    initBScroll (): void {
        bscroll = new BScroll((this.$refs as any).scroll);
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
        mode = 2;
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

    @Watch('visibile')
    onVisibileChanged (v: boolean) {
        if (v) {
            void this.getSongLyric();
        }
    }
}
</script>

<style lang="scss" scoped>
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
            text-align: center;
            padding: 0 18%;
            font-size: 14px;
            color: #999;

            li {
                padding: 10px 0;

                &.active {
                    color: #e6e6e6;
                    transition: color .3s linear;
                }
            }
        }
    }
}
</style>
