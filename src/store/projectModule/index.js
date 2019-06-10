import { getProject } from "@/utils/api";
export default {
    namespaced: true,
    state: {
        project: [],
        pagination: {},
        updateProjectVisible: false,
        updateProjectInfo: {},
        _id: ""
    },
    mutations: {
        setProject(state, value) {
            state.project = value;
        },
        setPagination(state, value) {
            state.pagination = value;
        },
        setUpdateProjectVisible(state, value) {
            state.updateProjectVisible = value;
        },
        setUpdateProjectInfo(state, value) {
            state.updateProjectInfo = value;
        },
        set_id(state, value) {
            state._id = value;
        }
    },
    actions: {
        getProjectList({
            commit
        }, sendData) {
            getProject(sendData).then(data => {
                if (data.status === 1) {
                    commit("setProject", data.data);
                    commit("setPagination", data.pagination);
                }
            })
        }
    }
}