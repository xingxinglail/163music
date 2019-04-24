<template>
    <div class="background">
        <transition name="bgfade" mode="in-out">
            <div :key="src" :style="{ backgroundImage: src }"></div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class Background extends Vue {
    @Prop({ type: String, default: '' }) readonly src!: string;
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/variable';

.bgfade-enter-active {
    transition: opacity .3s linear;
}

.bgfade-enter {
    opacity: 0;
}

.bgfade-enter-to {
    z-index: 2;
    opacity: 1;
}

.background {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        transform: scale(1.5);
        transform-origin: center top;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 3;
    }
}
</style>
