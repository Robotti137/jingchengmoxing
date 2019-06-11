import { getProject } from "@/utils/api";
export default {
    namespaced: true,
    state: {
        project: [],
        pagination: {},
        updateProjectVisible: false,
        updateProjectInfo: {},
        _id: "",
        search: {},
        rows: 10,
        currentPage: 1
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
        },
        setSearch(state, value) {
            state.search = value;
        },
        setCurrentPage(state, value) {
            state.currentPage = value;
        },
        setRows(state, value) {
            state.rows = value;
        }
    },
    actions: {
        getProjectList({
            commit
        }) {
            let {
                currentPage,
                rows,
                search
            } = this.state.projectModule;
            let sendData = {
                rows,
                currentPage,
                search
            };
            getProject(sendData).then(data => {
                if (data.status === 1) {
                    commit("setProject", data.data);
                    commit("setPagination", data.pagination);
                }
            })
        }
    }
}