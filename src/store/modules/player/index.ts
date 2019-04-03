import { Commit } from 'vuex';
import {
    PLAYER_PLAY,
    PLAYER_ADD,
    PLAYER_SET_PLAYLIST,
    PLAYER_SWITCH,
    PLAYER_TOGGLE_PLAY,
    PLAYER_SWITCH_MODE
} from '../../mutation-types';
import { setLocalItem, getLocalItem } from '../../../utils';

const saveKey: string = 'player';

export enum PlayMode {
    ListLoop = 'ListLoop',
    SongLoop = 'SongLoop',
    Random = 'Random'
}

export interface Song {
    id: number; // 歌曲id
    name: string; // 歌名
    picUrl: string; // 封面图
    singer: string; // 歌手
    duration: number; // 播放时长
}

interface State {
    currentId: number;
    isPlaying: boolean; // 是否正在播放
    mode: string; // 播放模式
    playlist: Song[]; // 播放列表
    playlistIndex: number[]; // 播放列表索引
}

const playMode: string[] = [PlayMode.ListLoop, PlayMode.SongLoop, PlayMode.Random];

let saveData = null;
try {
    saveData = getLocalItem(saveKey);
    if (saveData) saveData = JSON.parse(getLocalItem(saveKey));
} catch (e) {
    console.error(e);
}

export const state: State = {
    currentId: saveData ? saveData.currentId * 1 : 0,
    isPlaying: false,
    mode: saveData ? saveData.mode : PlayMode.ListLoop,
    playlist: saveData ? saveData.playlist : [],
    playlistIndex: []
};

const getters = {
    isPlaying: (state: State) => state.isPlaying,
    mode: (state: State) => state.mode,
    playlist: (state: State) => state.playlist,
    currentSong (state: State): Song | null {
        const data = state.playlist.find(c => c.id === state.currentId);
        if (data) return data;
        return null;
    }
};

const mutations = {
    [PLAYER_PLAY] (state: State): void {
        state.isPlaying = true;
    },
    [PLAYER_ADD] (state: State, payload: Song) {
        const data = state.playlist.find(c => c.id === payload.id);
        if (!data) {
            state.playlistIndex.push(state.playlist.push(payload) - 1);
        }
        state.currentId = payload.id;
        // state.isPlaying = true;
        setLocalItem(saveKey, JSON.stringify(state));
    },
    [PLAYER_SET_PLAYLIST] (state: State, payload: Song[]) {
        state.playlist = payload;
        state.currentId = payload[0].id;
        state.isPlaying = true;
        setLocalItem(saveKey, JSON.stringify(state));
    },
    [PLAYER_SWITCH] (state: State, payload: number) {
        const data = state.playlist[payload];
        if (data) {
            state.currentId = data.id;
            setLocalItem(saveKey, JSON.stringify(state));
        }
    },
    [PLAYER_TOGGLE_PLAY] (state: State, payload: boolean) {
        state.isPlaying = payload;
        setLocalItem(saveKey, JSON.stringify(state));
    },
    [PLAYER_SWITCH_MODE] (state: State, payload: string) {
        state.mode = payload;
        setLocalItem(saveKey, JSON.stringify(state));
    }
};

const actions = {
    play (context: { commit: Commit }) {
        context.commit(PLAYER_PLAY);
    },
    addSong (context: { commit: Commit }, payload: any): void {
        if (payload) {
            if (Array.isArray(payload)) {
                const playList: Song[] = new Array(payload.length);
                payload.forEach((c, i) => {
                    const { id, name, al, ar, dt } = c;
                    const data: Song = {
                        id,
                        name,
                        picUrl: al.picUrl,
                        singer: ar[0].name,
                        duration: dt
                    };
                    playList[i] = data;
                });
                context.commit(PLAYER_SET_PLAYLIST, playList);
            } else {
                const { id, name, al, ar, dt } = payload;
                const data: Song = {
                    id,
                    name,
                    picUrl: al.picUrl,
                    singer: ar[0].name,
                    duration: dt
                };
                context.commit(PLAYER_ADD, data);
            }
        }
    },
    switchMusic (context: { commit: Commit }, payload: number) {
        context.commit(PLAYER_SWITCH, payload);
    },
    togglePlay (context: { commit: Commit }, payload: boolean) {
        context.commit(PLAYER_TOGGLE_PLAY, payload);
    },
    switchMode (context: { commit: Commit, state: State }) {
        let index = playMode.findIndex(c => c === state.mode);
        index++;
        if (index > playMode.length - 1) index = 0;
        context.commit(PLAYER_SWITCH_MODE, playMode[index]);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
