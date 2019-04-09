<template>
    <div class="song">
        <div class="bg"></div>
        <div class="header">
            <svg class="icon prev" aria-hidden="true" @click="back">
                <use xlink:href="#icon-iconfront-"></use>
            </svg>
            <div class="name" v-if="getterCurrentSong">
                <p>{{ getterCurrentSong.name }}</p>
                <span>{{ getterCurrentSong.singer }}</span>
            </div>
            <svg class="icon share" aria-hidden="true">
                <use xlink:href="#icon-fenxiang"></use>
            </svg>
        </div>
        <div class="body">
            <div class="play-container">
                <div class="plate-wrapper"></div>
                <div class="swiper-container plate-container" ref="swiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide slide"
                             v-for="item in getterPlaylistIndex"
                             :key="getterPlaylist[item].id">
                            <div>
                                <div class="light"></div>
                                <div class="plate">
                                    <div class="img-box">
                                        <img :src="getterPlaylist[item].picUrl">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<cube-slide class="plate-container"
                            ref="slide"
                            :initialIndex="initialIndex"
                            :show-dots="false"
                            :auto-play="false"
                            :loop="false"
                            :speed="500"
                            @change="onSlideChange">
                    <cube-slide-item class="slide"
                                     v-for="item in getterPlaylist"
                                     :key="item.id">
                        <div>
                            <div class="light"></div>
                            <div class="plate">
                                <div class="img-box">
                                    <img :src="item.picUrl">
                                </div>
                            </div>
                        </div>
                    </cube-slide-item>
                </cube-slide>-->
                <!--<div class="plate-container">
                    <div>
                        <div class="light"></div>
                        <div class="plate">
                            <div class="img-box">
                                <img src="http://p2.music.126.net/NQBaw13hHiaTh41QQUYsQg==/109951162922231753.jpg?imageView&thumbnail=360y360&quality=75&tostatic=0" alt="">
                            </div>
                        </div>
                    </div>
                </div>-->
            </div>
        </div>
        <div class="footer">
            <song-footer @change-song="onChangeSong" />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
import Swiper from 'swiper';
import { Song } from '../../store/modules/player';
import SongFooter from './components/Footer.vue';
import { getSongDetail } from '../../api';

let swiperInstance: Swiper | null = null;
let canPlay: boolean = true;

@Component({
    components: {
        SongFooter
    }
})
export default class Player extends Vue {
    @Prop(String) readonly id!: string;
    @Getter('mode') getterMode!: string;
    @Getter('playlist') getterPlaylist!: Song[];
    @Getter('playlistIndex') getterPlaylistIndex!: number[];
    @Getter('currentSong') getterCurrentSong!: Song;
    @Action('addSong') actionAddSong!: Function;
    @Action('switchMusic') actionSwitchMusic!: Function;
    @Action('play') actionPlay!: Function;

    initialIndex: number = 0;

    @Watch('getterMode')
    onModeChanged (val: string): void {
        this.$forceUpdate();
        canPlay = false;
        const index = this.getterPlaylist.findIndex(c => c.id === this.getterCurrentSong.id);
        if (index !== - 1) {
            const _index = this.getterPlaylistIndex.findIndex(c => c === index);
            if (_index !== -1) {
                this.initialIndex = _index;
                if (swiperInstance) swiperInstance.slideTo(_index, 0);
            }
        }
    }

    created () {
        this.initSwiper();
        /* if (this.id === '0') {
            const { id } = this.getterCurrentSong;
            this.$router.replace({
                name: 'Player',
                params: {
                    id: id ? id + '' : '0'
                }
            });
        } */
        /* if (this.getterCurrentSong) {
            if (this.id * 1 === this.getterCurrentSong.id) {
                const index = this.getterPlaylist.findIndex(c => c.id === this.getterCurrentSong.id);
                if (index !== -1) {
                    this.initialIndex = index;
                } else {
                    void this.getSongDetail();
                }
            } else {
                void this.getSongDetail();
            }
        } else {
            void this.getSongDetail();
        } */
        const index = this.getterPlaylist.findIndex(c => +c.id === +this.id);
        if (index !== -1) {
            let _index = this.getterPlaylistIndex.findIndex(c => c === index);
            if (_index) {
                this.initialIndex = _index;
                this.onSlideChange(_index);
            }
        } else {
            void this.getSongDetail();
        }
    }

    initSwiper () {
        this.$nextTick(() => {
            const that = this;
            const swiperDom: HTMLElement = (this.$refs as any).swiper;
            swiperInstance = new Swiper(swiperDom, {
                speed: 500,
                on: {
                    slideChange () {
                        if (canPlay) {
                            that.actionPlay();
                            if (swiperInstance) that.onSlideChange(swiperInstance.realIndex);
                        } else {
                            canPlay = true;
                        }
                    }
                }
            });
            if (swiperInstance) swiperInstance.slideTo(this.initialIndex, 0);
        });
    }

    async getSongDetail (): Promise<void> {
        try {
            const res = await getSongDetail(this.id);
            if (Array.isArray(res.songs) && res.songs.length > 0) {
                this.actionAddSong(res.songs[0]);
                this.initialIndex = this.getterPlaylistIndex.length - 1;
                this.onSlideChange(this.initialIndex);
                this.$nextTick(() => {
                    if (swiperInstance) {
                        swiperInstance.update();
                        swiperInstance.slideTo(this.initialIndex, 0);
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    onChangeSong (action: string): void {
        if (action === 'prev') {
            this.initialIndex--;
            if (this.initialIndex < 0) this.initialIndex = this.getterPlaylistIndex.length - 1;
        }
        if (action === 'next') {
            this.initialIndex++;
            if (this.initialIndex > this.getterPlaylistIndex.length - 1) this.initialIndex = 0;
        }
        if (swiperInstance) swiperInstance.slideTo(this.initialIndex, 500);
        this.onSlideChange(this.initialIndex);
    }

    onSlideChange (index: number): void {
        this.actionSwitchMusic(index);
        this.$router.replace({
            name: 'Player',
            params: {
                id: this.getterCurrentSong.id + ''
            }
        });
    }

    back (): void {
        this.$router.back();
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variable';

@keyframes circling{
    0% {
        transform:rotate(0deg)
    }
    to{
        transform:rotate(1turn)
    }
}

.song {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @include flexbox(normal, normal, column);

    .bg {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(https://p3.music.126.net/WOpgkb_LtunWas8qzzLF8w==/109951163078215926.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        transform: scale(1);
        transform-origin: center top;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .5);
        }
    }

    & > div {
        position: relative;
        z-index: 2;
    }

    .header {
        @include flex-item(0 0 46px);
        @include flexbox(center, space-between);
        height: 46px;
        color: #fff;

        .prev {
            font-size: 24px;
            padding: 10px 10px;
        }

        .share {
            font-size: 24px;
            padding: 10px 14px;
        }

        .name {
            text-align: center;

            p {
                font-size: 14px;
            }

            span {
                font-size: 12px;
            }
        }
    }

    .body {
        @include flex-item;
        position: relative;

        .play-container {
            position: absolute;
            z-index: 1;
            top: 50%;
            left: 0;
            width: 100%;
            height: 296Px;
            margin-top: -160Px;

            .plate-wrapper {
                position: absolute;
                z-index: -1;
                width: 296Px;
                height: 296Px;
                top: 0;
                left: 50%;
                margin-left: -148Px;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(../../assets/images/plate_wrapper.png);
            }

            .plate-container {
                animation-play-state: paused;

                .slide > div {
                    width: 296Px;
                    height: 296Px;
                    margin: 0 auto;
                    position: relative;
                    animation: circling 20s infinite linear;

                    .light, .plate {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 1;
                        background-size: contain;
                        background-repeat: no-repeat;
                    }

                    .light {
                        /*background-image: url(../../assets/images/light_plus.png);*/
                        z-index: 2;
                    }

                    .plate {
                        background-image: url(../../assets/images/plate.png);
                        /*background-image: url(../../assets/images/plate2.png);*/

                        .img-box {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 184Px;
                            height: 184Px;
                            margin: -92Px 0 0 -92Px;
                            border-radius: 50%;
                            overflow: hidden;

                            img {
                                width: 100%;
                            }
                        }
                    }
                }
            }

        }
    }

    .footer {
        @include flex-item(0 0 20vh);
    }
}
</style>
