/**
 * [dateFormat 日期格式化]
 * @param [Date] time 日期对象
 * @param [String] partten 'yyyy-MM-dd'
 * @returns [String] '2017-01-01'
 *
 */
export function dateFormat (time: Date, partten: string): string {
    if (!time) return '';
    if (/(y+)/.test(partten)) {
        const year: number = time.getFullYear();
        partten = partten.replace(RegExp.$1, year + '');
    }
    const o = {
        'M+': time.getMonth() + 1,
        'd+': time.getDate(),
        'h+': time.getHours(),
        'm+': time.getMinutes(),
        's+': time.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(partten)) {
            const number: number = (o as any)[k];
            partten = partten.replace(RegExp.$1, padLeftZeor(number));
        }
    }
    return partten;
}

/**
 * [padLeftZeor 小于10的数字左边加上0]
 * @param [Number] num 需要处理的数字
 * @returns [String] 加上0后的字符串 '01'
 */
export function padLeftZeor (num: number): string {
    if (num < 10) {
        return '0' + num;
    }
    return num + '';
}

export function shuffle<T> (arr: T[]): T[] {
    for (let i = arr.length - 1; i >= 0; i--) {
        const randomIndex: number = Math.floor(Math.random() * (i + 1));
        const itemAtIndex: T = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    return arr;
}

const _prefixKey: string = 'star_';
export function getLocalItem (key: string): string {
    return window.localStorage.getItem(_prefixKey + key) || '';
}

export function setLocalItem (key: string, val: string) {
    window.localStorage.setItem(_prefixKey + key, val);
}

export function removeLocalItem (key: string) {
    window.localStorage.removeItem(_prefixKey + key);
}

export function getSessionItem (key: string) {
    return window.sessionStorage.getItem(_prefixKey + key) || null;
}

export function setSessionItem (key: string, val: string) {
    window.sessionStorage.setItem(_prefixKey + key, val);
}

export function removeSessionItem (key: string) {
    window.sessionStorage.removeItem(_prefixKey + key);
}
