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

let bscroll: BScroll | null = null;

@Component
export default class Lyric extends Vue {
    @Prop({ type: Boolean, default: false }) readonly visibile!: boolean;

    lyric: string = '';

    close (): void {
        this.$emit('update:visibile', false);
    }

    initBScroll (): void {
        bscroll = new BScroll((this.$refs as any).scroll);
    }

    @Watch('visibile')
    onVisibileChanged (v: boolean) {
        if (v) {
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
