
<template>
    <div id="app">
        <home-head ref="homeHead" title="表情榜" v-on:drawerToggle="drawerToggle" v-on:openSearch="openSearch"/>
        <drawer ref="drawer" />
    <keep-alive>
        <router-view />
    </keep-alive>
    </div>
</template>
<script>
// 头部
import homeHead from './components/homeHead'
// 侧栏弹出
import drawer from './components/drawer'
export default {
    name: 'app',
    components: {
        homeHead,
        drawer
    },
    methods: {
        drawerToggle: function() {
          this.$refs.drawer.toggle(true)
        },
        openSearch(){
            this.$router.push('search')
        }
    }
}
</script>
<style>
@import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic';
@import 'http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css';
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
