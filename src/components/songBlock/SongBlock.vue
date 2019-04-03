<template>
    <div class="song-block" @click="go(data.id + '')">
        <div class="imagebox" w-1-1 aspectratio>
            <div aspectratio-content>
                <img :src="data.picUrl">
            </div>
        </div>
        <div class="content">
            <p class="desc" :class="{ line1: data.author }">{{ data.name }}</p>
            <p class="author">{{ data.author }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SongBlock extends Vue {
    // @Prop({ default: Object.create(null) }) data!: Object;
    @Prop({
        type: Object,
        default () {
            return Object.create(null);
        }
    })
    readonly data!: Object;

    @Prop({ default: '' }) readonly author!: string;

    go (id: string): void {
        this.$router.push({
            name: 'PlayList',
            params: {
                id
            }
        });
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variable';

.song-block {
    font-size: 12px;

    .imagebox {

        &[w-1-1] {
            aspect-ratio: '1:1';
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .content {
        padding: 6px 4px;

        .desc {
            @include line(2);

            &.line1 {
                @include line;
            }
        }

        .author {
            color: #888;
        }
    }
}
</style>
