import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'

import main from './main.vue'
import App from './App.vue'
import list from './components/list.vue'

// 异步加载router模块
const login = resolve => require(['./components/login.vue'], resolve)
const admin = resolve => require(['./components/admin.vue'], resolve)
const post = resolve => require(['./components/post.vue'], resolve)
const search = resolve => require(['./components/search.vue'], resolve)

Vue.use(MuseUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        theme: 'light', //使用的主题
        currentUser: null,
        sort:'最新',
        tag:null
    },
    mutations: {
        setTheme(state, theme) {
            state.theme = theme
        },
        setUser(state, user) {
            state.currentUser = user
        },
        setSort(state,type){
        	state.sort=type
        },
        setTag(state,tag){
        	state.tag=tag
        }
    }
})

const router = new VueRouter({
	// base:'/e/',
    routes: [
        { path: '/login', name: 'login', component: login }, {
            path: '/admin',
            name: 'admin',
            component: admin,
            children: [{
            	name:'adminPost',
                path: '',
                component: post
            }]
        }, {
            path: '/search',
            name: 'search',
            component: search,
            children: [{
            	name:'searchResults',
                path: ':keyword',
                component: list
            }]
        }, {
            path: '',
            name: 'home',
            component: App,
            children: [{
            	name:'homeList',
                path: '',
                component: list
            }]
        }
    ]
})

/* eslint-disable no-new */
new Vue({
    // el: '#app',,
    // template: '<App/>',
    // components: { App },
    render: h => h(main),
    router,
    store
}).$mount('#main')
