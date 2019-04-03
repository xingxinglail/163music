import axios from 'axios';
axios.defaults.baseURL = '/api';
// 获取首页banner
export const getBanner = () => {
    return new Promise((resolve, reject) => {
        axios.get('/banner')
            .then(res => {
            if (res && res.data && res.data.code === 200) {
                resolve(res.data);
            }
            else {
                reject(res);
            }
        })
            .catch(err => {
            reject(err);
        });
    });
};
// 获取推荐歌单
export const getPersonalized = () => {
    return new Promise((resolve, reject) => {
        axios.get('/personalized')
            .then(res => {
            if (res && res.data && res.data.code === 200) {
                resolve(res.data);
            }
            else {
                reject(res);
            }
        })
            .catch(err => {
            reject(err);
        });
    });
};
// 获取推荐新音乐
export const getPersonalizedNewsong = () => {
    return new Promise((resolve, reject) => {
        axios.get('/personalized/newsong')
            .then(res => {
            if (res && res.data && res.data.code === 200) {
                resolve(res.data);
            }
            else {
                reject(res);
            }
        })
            .catch(err => {
            reject(err);
        });
    });
};
// 获取歌单详情
export const getPlayList = (id) => {
    return new Promise((resolve, reject) => {
        axios.get('/playlist/detail', {
            params: {
                id
            }
        })
            .then(res => {
            if (res && res.data && res.data.code === 200) {
                resolve(res.data);
            }
            else {
                reject(res);
            }
        })
            .catch(err => {
            reject(err);
        });
    });
};
// 获取音乐url
export const getSongUrl = (id) => {
    return new Promise((resolve, reject) => {
        axios.get('/song/url', {
            params: {
                id
            }
        })
            .then(res => {
            if (res && res.data && res.data.code === 200) {
                resolve(res.data);
            }
            else {
                reject(res);
            }
        })
            .catch(err => {
            reject(err);
        });
    });
};
// 获取音乐详情
export const getSongDetail = (ids) => {
    return new Promise((resolve, reject) => {
        axios.get('/song/detail', {
            params: {
                ids
            }
        })
            .then(res => {
            if (res && res.data && res.data.code === 200) {
                resolve(res.data);
            }
            else {
                reject(res);
            }
        })
            .catch(err => {
            reject(err);
        });
    });
};
//# sourceMappingURL=index.js.map