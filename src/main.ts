import Vue from 'vue';
import './assets/iconfont/iconfont';
import './cube-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './assets/scss/index.scss';
import 'swiper/dist/css/swiper.min.css';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
