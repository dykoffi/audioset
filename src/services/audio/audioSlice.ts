import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiClient } from '../../config/axios'
import { getStatsInvestigated } from '../user/userSlice'

interface State {
    loading: false
    dataAudioSource: {
        blob: Blob
        url: string
    } | null
    dataAudioTarget: {
        blob: Blob
        url: string
    } | null
    urlAudio: string | null
    currentAudio: {
        id_: number
        ref: string
        sourceLang: string
        targetLang: string
    } | null
    notRecordedNb: number
    currentLangage: string
}

let initialState: State = {
    loading: false,
    dataAudioSource: null,
    dataAudioTarget: null,
    urlAudio: null,
    notRecordedNb: 0,
    currentAudio: null,
    currentLangage: "source"
}

export const audioSlice = createSlice({
    name: "audio",
    initialState,
    reducers: {
        setDataAudioSource: (state, action) => {
            return {
                ...state,
                dataAudioSource: action.payload,
                urlAudio: action.payload ? action.payload.url : null
            }
        },
        setUrlAudio: (state, action) => {
            return {
                ...state,
                urlAudio: action.payload
            }
        },
        setDataAudioTarget: (state, action) => {
            return {
                ...state,
                dataAudioTarget: action.payload,
                urlAudio: action.payload ? action.payload.url : null
            }
        },
        setNotRecordedNb: (state, action) => { return { ...state, notRecordedNb: action.payload } },
        setCurrentAudio: (state, action) => {
            return {
                ...state,
                currentAudio: action.payload,
                urlAudio: null
            }
        },
        setCurrentLangage: (state, action) => {
            let url
            if (action.payload === "source") {
                url = state.dataAudioSource ? state.dataAudioSource.url : null
            } else {
                url = state.dataAudioTarget ? state.dataAudioTarget.url : null
            }
            return {
                ...state,
                currentLangage: action.payload,
                urlAudio: url
            }

        },
        setLoading: (state, action) => { state.loading = action.payload }
    }
})

interface sentAudio {
    blobSource: Blob
    blobTarget: Blob
    audioId: string
    userId: string
    ref: string
}

export const getNotRecordedNb = createAsyncThunk('audio/getNotRecorded',
    async (data: undefined, { dispatch }) => {
        ApiClient.get("/sound/count/unrecorded").then(({ data }) => {
            dispatch(setNotRecordedNb(data))
        }).catch(err => {
            console.log(err);
        })
    })

export const sendAudio = createAsyncThunk('audio/send',
    async (data: sentAudio, { dispatch }) => {
        dispatch(setLoading(true))
        var formData = new FormData();
        formData.append("audio", data.blobSource, data.ref);
        formData.append("audio", data.blobTarget, data.ref);
        formData.append("soundId", data.audioId);
        formData.append("userId", data.userId);

        ApiClient.post("/sound/send", formData, {
            headers: {
                "Content-type": "multipart/form-data"
            }
        }).then(() => {

            dispatch(getNotRecordedNb())
            dispatch(getStatsInvestigated())
            dispatch(setLoading(false))

        }).catch(err => {
            dispatch(setLoading(false))
            console.log(err);
        })
    })


export const getNewAudio = createAsyncThunk('audio/getNewAudio',
    async (userId: number, { dispatch, getState }) => {
        dispatch(setLoading(true))
        ApiClient.get(`/sound/begin/${userId}`).then(({ data }) => {
            dispatch(setCurrentAudio(data))
            dispatch(getNotRecordedNb())
            dispatch(setLoading(false))
        }).catch(err => {
            dispatch(setLoading(false))
            console.log(err);
        })
    })

export const { setLoading, setCurrentLangage, setUrlAudio, setDataAudioSource, setDataAudioTarget, setNotRecordedNb, setCurrentAudio } = audioSlice.actions
export default audioSlice.reducer