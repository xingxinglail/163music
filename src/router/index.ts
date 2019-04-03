import Vue from 'vue';
import VueRouter from 'vue-router';
const Index = () => import('../views/index/Index.vue');
const PlayList = () => import('../views/playList/PlayList.vue');
const Player = () => import('../views/player/Player.vue');

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/playlist/:id',
            props: true,
            name: 'PlayList',
            component: PlayList
        },
        {
            path: '/player/:id',
            props: true,
            name: 'Player',
            component: Player
        }
    ]
});
