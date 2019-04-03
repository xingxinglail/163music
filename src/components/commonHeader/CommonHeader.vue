<template>
    <div class="common-header"></div>
</template>

<style lang="scss" scoped>
@import '../../assets/scss/variable';

.common-header {
    @include flexbox;
    height: 46px;
    background-color: $themeColor;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
}
</style>
