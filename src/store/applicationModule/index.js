import { getApplication } from "@/utils/api";
export default {
    namespaced: true,
    state: {
        application: [],
        pagination: {},
        search: {},
        updateApplicationVisible: false,
        updateApplicationInfo: {},
        id: "",
        rows: 10,
        currentPage: 1,
        unapprovedTotal: 0
    },
    mutations: {
        setApplication(state, value) {
            state.application = value;
        },
        setPagination(state, value) {
            state.pagination = value;
        },
        setUpdateApplicationVisible(state, value) {
            state.updateApplicationVisible = value;
        },
        setUpdateApplicationInfo(state, value) {
            state.updateApplicationInfo = value;
        },
        setId(state, value) {
            state.id = value;
        },
        setRows(state, value) {
            state.rows = value
        },
        setCurrentPage(state, value) {
            state.currentPage = value
        },
        setSearch(state, value) {
            state.search = value
        },
        setUnapprovedTotal(state, value) {
            state.unapprovedTotal = value
        }
    },
    actions: {
        getApplicationList({
            commit
        }) {
            let {
                currentPage,
                rows,
                search
            } = this.state.applicationModule;
            let sendData = {
                rows,
                currentPage,
                search
            };
            getApplication(sendData).then(data => {
                if (data.status === 1) {
                    commit("setApplication", data.data);
                    commit("setPagination", data.pagination);
                    let approvePurview = JSON.parse(sessionStorage.getItem("jcmx-userinfo"))
                        .approvePurview;
                    if (approvePurview === 1) {
                        commit("setUnapprovedTotal", data.pagination.directorTotal);
                    } else if (approvePurview === 2) {
                        commit("setUnapprovedTotal", data.pagination.produceTotal);
                    } else if (approvePurview === 3) {
                        commit("setUnapprovedTotal", data.pagination.causeTotal);
                    }
                }
            })
        }
    }
}