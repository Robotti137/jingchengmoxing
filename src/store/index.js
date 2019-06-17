import Vue from 'vue'
import Vuex from 'vuex'
import projectModule from './projectModule'
import applicationModule from './applicationModule'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        projectModule,
        applicationModule
    }
})

export default store