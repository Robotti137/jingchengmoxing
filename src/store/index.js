import Vue from 'vue'
import Vuex from 'vuex'
import projectModule from './projectModule'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        projectModule
    }
})

export default store