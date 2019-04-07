import { PLAYER_PLAY, PLAYER_ADD, PLAYER_SET_PLAYLIST, PLAYER_SWITCH, PLAYER_TOGGLE_PLAY, PLAYER_SWITCH_MODE, PLAYER_UPDATE_PLAYINDEXLIST } from '../../mutation-types';
import { setLocalItem, getLocalItem, shuffle } from '../../../utils';
const saveKey = 'player';
export var PlayMode;
(function (PlayMode) {
    PlayMode["ListLoop"] = "ListLoop";
    PlayMode["SongLoop"] = "SongLoop";
    PlayMode["Random"] = "Random";
})(PlayMode || (PlayMode = {}));
const playMode = [PlayMode.ListLoop, PlayMode.SongLoop, PlayMode.Random];
let saveData = null;
try {
    saveData = getLocalItem(saveKey);
    if (saveData)
        saveData = JSON.parse(getLocalItem(saveKey));
}
catch (e) {
    console.error(e);
}
export const state = {
    currentId: saveData ? saveData.currentId * 1 : 0,
    isPlaying: false,
    mode: saveData ? saveData.mode : PlayMode.ListLoop,
    playlist: saveData ? saveData.playlist : [],
    playlistIndex: saveData ? saveData.playlistIndex : []
};
const getters = {
    isPlaying: (state) => state.isPlaying,
    mode: (state) => state.mode,
    playlist: (state) => state.playlist,
    playlistIndex: (state) => state.playlistIndex,
    currentSong(state) {
        const data = state.playlist.find(c => c.id === state.currentId);
        if (data)
            return data;
        return null;
    }
};
const mutations = {
    [PLAYER_PLAY](state) {
        state.isPlaying = true;
    },
    [PLAYER_ADD](state, payload) {
        const data = state.playlist.find(c => c.id === payload.id);
        if (!data) {
            state.playlistIndex.push(state.playlist.push(payload) - 1);
        }
        state.currentId = payload.id;
    },
    [PLAYER_SET_PLAYLIST](state, payload) {
        state.playlist = payload;
        state.playlistIndex = payload.map((c, index) => index);
        state.currentId = payload[0].id;
        state.isPlaying = true;
    },
    [PLAYER_SWITCH](state, payload) {
        const index = state.playlistIndex[payload];
        const data = state.playlist[index];
        if (data) {
            state.currentId = data.id;
            setLocalItem(saveKey, JSON.stringify(state));
        }
    },
    [PLAYER_TOGGLE_PLAY](state, payload) {
        state.isPlaying = payload;
        setLocalItem(saveKey, JSON.stringify(state));
    },
    [PLAYER_SWITCH_MODE](state, payload) {
        state.mode = payload;
    },
    [PLAYER_UPDATE_PLAYINDEXLIST](state) {
        switch (state.mode) {
            case PlayMode.ListLoop:
                state.playlistIndex = state.playlist.map((c, i) => i);
                break;
            case PlayMode.Random:
                state.playlistIndex = shuffle(state.playlistIndex);
                break;
            default:
                break;
        }
        setLocalItem(saveKey, JSON.stringify(state));
    }
};
const actions = {
    play(context) {
        context.commit(PLAYER_PLAY);
    },
    addSong(context, payload) {
        if (payload) {
            if (Array.isArray(payload)) {
                const playList = new Array(payload.length);
                payload.forEach((c, i) => {
                    const { id, name, al, ar, dt } = c;
                    const data = {
                        id,
                        name,
                        picUrl: al.picUrl,
                        singer: ar[0].name,
                        duration: dt
                    };
                    playList[i] = data;
                });
                context.commit(PLAYER_SET_PLAYLIST, playList);
            }
            else {
                const { id, name, al, ar, dt } = payload;
                const data = {
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
    switchMusic(context, payload) {
        context.commit(PLAYER_SWITCH, payload);
    },
    togglePlay(context, payload) {
        context.commit(PLAYER_TOGGLE_PLAY, payload);
    },
    switchMode(context) {
        let index = playMode.findIndex(c => c === state.mode);
        index++;
        if (index > playMode.length - 1)
            index = 0;
        context.commit(PLAYER_SWITCH_MODE, playMode[index]);
        context.commit(PLAYER_UPDATE_PLAYINDEXLIST);
    }
};
export default {
    state,
    getters,
    mutations,
    actions
};
//# sourceMappingURL=index.js.map