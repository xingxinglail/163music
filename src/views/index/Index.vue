<template>
    <div class="index">
        <common-header />
        <div class="tab-container">
            <div class="item">
                <span>音乐</span>
            </div>
            <div class="item">
                <span>视频</span>
            </div>
            <div class="item">
                <span>电台</span>
            </div>
        </div>
        <div>
            <music />
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CommonHeader from '../../components/commonHeader/CommonHeader.vue';
import Music from './components/Music.vue';

@Component({
    components: {
        CommonHeader,
        Music
    }
})
export default class Index extends Vue {
    name: string = '1';
}
</script>

<style lang='scss' scoped>
@import '../../assets/scss/variable';

.index {
    min-height: 100vh;
    padding-top: 86px;
    color: #333;

    .slide {

        img {
            width: 100%;
        }
    }

    .tab-container {
        @include flexbox;
        position: fixed;
        z-index: 1;
        width: 100%;
        top: 46px;
        left: 0;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(20px);

        .item {
            @include flex-item;
            font-size: 14px;
            cursor: pointer;
            text-align: center;
            line-height: 40px;

            span {
                padding: 0 4px;
            }
        }
    }
}
</style>
