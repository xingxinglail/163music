<template>
    <transition name="fade">
        <div class="lyric" v-show="visibile" @click="close">
            <div class="scroll-container" ref="scroll">
                <ul>
                    <li>斯蒂芬斯蒂123芬斯蒂芬</li>
                    <li>斯蒂芬斯电56饭锅蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯23蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯8蒂阿斯蒂芬芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯4爽肤水蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯斯90蒂芬蒂芬斯蒂芬</li>
                    <li>斯蒂芬是电-饭锅电饭锅斯蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯蒂123芬斯蒂芬</li>
                    <li>斯蒂芬斯电56饭锅蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯23蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯8蒂阿斯蒂芬芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯4爽肤水蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯斯90蒂芬蒂芬斯蒂芬</li>
                    <li>斯蒂芬是电-饭锅电饭锅斯蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯蒂123芬斯蒂芬</li>
                    <li>斯蒂芬斯电56饭锅蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯23蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯8蒂阿斯蒂芬芬斯蒂芬斯蒂芬斯蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯4爽肤水蒂芬斯蒂芬</li>
                    <li>斯蒂芬斯斯90蒂芬蒂芬斯蒂芬</li>
                    <li>斯蒂芬是电-饭锅电饭锅斯蒂芬斯蒂芬</li>
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

@Component
export default class Lyric extends Vue {
    @Prop({ type: Boolean, default: false }) readonly visibile!: boolean;

    lyric: string = '';

    created (): void {
        player({
            onTimeupdate () {
                console.log((this as HTMLAudioElement).currentTime);
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

    async getSongLyric (): Promise<void> {
        try {
            console.log(window.localStorage.getItem('klyric'));
            console.log(window.localStorage.getItem('lrc'));
            const lyric: string | null = window.localStorage.getItem('lrc');
            /*const res = await getSongLyric(this.id);
            if (res.klyric) {
                window.localStorage.setItem('klyric', res.klyric.lyric)
                window.localStorage.setItem('lrc', res.lrc.lyric)
            }*/
            if (lyric) this.lyricParse(lyric);
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
        const lyricData = new Array(lyricList.length);
        console.log(lyricList);
        lyricList.forEach((c: string, i: number): void => {
            const parse = c.match(parseReg);
            if (parse) {
                console.log(i);
                const str: string = parse[0].substring(1, parse[0].length - 1);
                const timeArr: any[] = str.split(':');
                const minutes2Seconds: number = timeArr[0] * 1 * 60;
                const seconds: number = timeArr[1] * 1;
                const data = {
                    time: Math.floor((minutes2Seconds + seconds) * 1000) / 1000,
                    text: c.replace(parseReg, '')
                };
                lyricData[i] = data;
            }
        });
        console.log(lyricData);
    }

    @Watch('visibile')
    onVisibileChanged (v: boolean) {
        if (v) {
            void this.getSongLyric();
            if (!bscroll) {
                this.initBScroll();
            }
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
            }
        }
    }
}
</style>
