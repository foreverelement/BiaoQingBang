<template>
        <div id="admin">
            <mu-appbar title="管理">
                <mu-icon-button icon='keyboard_arrow_left' slot="left" @click="goback" />
                <mu-flat-button label="exit" secondary slot="right" @click="logout" />
            </mu-appbar>
    <keep-alive>
            <router-view />
    </keep-alive>
        </div>
</template>
<script>
import leanStorage from './leanStorage'
//用户登录状态保存在store中，渲染前判断用户是否登录；用户退出后重置store中currentUser（undefined）；重置时被store的watch监听到后，退回首页。
export default {
    methods: {
        goback() {
            this.$router.push('/')
        },
        logout() {
            let user = leanStorage.logOut()
            this.$store.commit('setUser', user)
        }
    },

    beforeMount: function() {

        if (!leanStorage.isLogined())
            this.$router.push('/login')

        window.currentComponent = this

        this.$store.watch(function(state) {
            return state.currentUser //默认为null
        }, function(val, oldVal) {
            if (!window.currentComponent.$store.state.currentUser)
                window.currentComponent.goback()
        })
    }
}
</script>
