<template>
    <div class="index-music">
        <cube-slide class="slide" :data="banners">
            <cube-slide-item v-for="(item, index) in banners"
                             :key="item.imageUrl"
                             @click.native="onSlideClick(item, index)">
                <img class="image" :src="item.imageUrl">
            </cube-slide-item>
            <template slot="dots" slot-scope="props">
                <span class="my-dot"
                      :class="{ active: props.current === index }"
                      v-for="(item, index) in props.dots"
                      :key="index" />
            </template>
        </cube-slide>
        <div class="nav">
            <div class="item" w-25-30 aspectratio>
                <div aspectratio-content>
                    <img src="../../../assets/images/fm.jpg">
                    <p>私人FM</p>
                </div>
            </div>
            <div class="item" w-25-30 aspectratio>
                <div aspectratio-content>
                    <img src="../../../assets/images/day.jpg">
                    <p>每日推荐</p>
                </div>
            </div>
            <div class="item" w-25-30 aspectratio>
                <div aspectratio-content>
                    <img src="../../../assets/images/fm.jpg">
                    <p>歌单</p>
                </div>
            </div>
            <div class="item" w-25-30 aspectratio>
                <div aspectratio-content>
                    <img src="../../../assets/images/rank.jpg">
                    <p>排行榜</p>
                </div>
            </div>
        </div>
        <div class="block-container">
            <song-block v-for="item in personalizeds"
                        :key="item.id"
                        :data="item" />
        </div>
        <div class="block-container">
            <song-block v-for="item in personalizedNewsong"
                        :key="item.id"
                        :data="item" />
        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SongBlock from '../../../components/songBlock/SongBlock.vue';
import { getBanner, getPersonalized, getPersonalizedNewsong } from '../../../api';

@Component({
    components: {
        SongBlock
    }
})
export default class IndexMusic extends Vue {
    banners: any[] = [];
    personalizeds: any[] = [];
    personalizedNewsong: any[] = [];

    async created (): Promise<void> {
        try {
            let banner: any = getBanner();
            let personalized: any = getPersonalized();
            let personalizedNewsong: any = getPersonalizedNewsong();
            banner = await banner;
            if (banner && banner.banners) this.banners = banner.banners;
            personalized = await personalized;
            if (personalized && Array.isArray(personalized.result)) {
                this.personalizeds = personalized.result.slice(0, 6);
            }
            personalizedNewsong = await personalizedNewsong;
            if (personalizedNewsong && Array.isArray(personalizedNewsong.result)) {
                personalizedNewsong = personalizedNewsong.result.slice(0, 6);
                this.personalizedNewsong = personalizedNewsong.map((c: any) => {
                    const data = {
                        id: c.id,
                        name: c.name,
                        picUrl: c.song.album.picUrl,
                        author: c.song.album.artists[0].name
                    };
                    return data;
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    onSlideClick (): void {
        console.log(13);
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/variable';

.index-music {

    .slide {

        .image {
            width: 100%;
        }

        .my-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, .6);

            &.active {
                background-color: $themeColor;
            }
        }
    }

    .nav {
        @include flexbox(normal);
        @include border-bottom(#d4d4d4);

        [w-25-30] {
            aspect-ratio: '25:26';
        }

        .item {
            @include flex-item;
            cursor: pointer;

            [aspectratio-content] {
                @include flexbox(center, center, column);

                img {
                    width: 50px;
                    height: 50px;
                }

                p {
                    padding-top: 6px;
                    font-size: 14px;
                }
            }
        }
    }

    .block-container {
        @include flexbox(normal, space-between, row, wrap);

        & > div {
            @include flex-item(0 0 32.5vw);
        }
    }
}
</style>
