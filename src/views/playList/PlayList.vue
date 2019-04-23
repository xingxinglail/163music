<template>
    <div class="song-details">
        {{ data.subscribedCount }}收藏次数
        {{ data.shareCount }}分享次数
        {{ data.commentCount }}评论次数
        {{ data.trackCount }}首歌
        <p @click="playAll">播放全部</p>
        <ul>
            <li v-for="item in data.tracks" :key="item.id" @click="go(item)">
                {{ item.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Song } from '../../store/modules/player';
import { getPlayList, getSongUrl, getSongDetail } from '../../api';

@Component
export default class PlayList extends Vue {
    @Action('addSong') actionAddSong!: Function;
    @Action('play') actionPlay!: Function;

    @Prop({
        type: String,
        required: true
    })
    readonly id!: string;

    data: any = Object.create(null);

    created (): void {
        void this.getData();
    }

    async getData (): Promise<void> {
        try {
            const res = await getPlayList(this.id);
            if (res.playlist) {
                this.data = res.playlist;
            }
        } catch (err) {
            console.error(err);
        }
    }

    playAll () {
        this.actionAddSong(this.data.tracks);
        this.$router.push({
            name: 'Player',
            params: {
                id: this.data.tracks[0].id + ''
            }
        });
    }

    go (data: Song): void {
        this.actionPlay();
        this.actionAddSong(data);
        this.$router.push({
            name: 'Player',
            params: {
                id: data.id + ''
            }
        });
    }
}
</script>

<style lang="scss" scoped>
.song-details {
    
    ul {
        
        li {
            padding: 20px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
            cursor: pointer;
        }
    }
}
</style>
