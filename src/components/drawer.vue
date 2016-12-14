<template>
    <div>
        <mu-drawer :open="open" :docked="docked" @close="toggle">
            <mu-appbar title="分类" />
            <mu-list>
                <mu-list-item v-for="item in categoryList" :title="item.name" @click="fetchPost(item.name)"/>
                <mu-sub-header>标签</mu-sub-header>
                <div :style="tagsStyle" ref="tags">
                <mu-chip class="chip-tag" v-for="item in tags" @click="fetchPostWithTag(item)">
                    {{item}}
                </mu-chip></div>
                <!-- <mu-list-item v-if="docked" @click.native="open = false" title="Close" /> -->
            </mu-list>
            <mu-bottom-nav class="drawer-nav" :value="bottomNav" shift @change="handleChange">
                <mu-bottom-nav-item value="light" title="白天" icon="brightness_5" />
                <mu-bottom-nav-item value="dark" title="夜间" icon="brightness_4" />
                <mu-bottom-nav-item value="login" title="登录" icon="assignment_ind" />
            </mu-bottom-nav>
        </mu-drawer>
    </div>
</template>
<script>
import light from '!raw!muse-ui/dist/theme-default.css'
import dark from '!raw!muse-ui/dist/theme-dark.css'
import carbon from '!raw!muse-ui/dist/theme-carbon.css'
import teal from '!raw!muse-ui/dist/theme-teal.css'
import leanStorage from './leanStorage'

export default {
    name: 'drawer',
    data() {
        return {
            theme: 'carbon',
            themes: {
                light,
                dark,
                carbon,
                teal
            },
            open: false,
            docked: true,
            categoryList: [{
                    name: '最新'
                }, {
                    name: '最热'
                }, {
                    name: '收藏'
                }

            ],
            tags: [],
            bottomNav: this.$store.state.theme || 'light',
            bottomNavColor: 'movies',
            tagsStyle:{
                height:'0',
                overflow:'scroll',
                userSelect:'none'
            }
        }
    },
    beforeMount() {
        this.fetchTags()
    },
    mounted(){
        this.tagsStyle.height=document.documentElement.clientHeight-this.$refs.tags.offsetTop-100+'px'
    },
    methods: {
        toggle(flag) {
            this.open = !this.open
            this.docked = !flag
        },
        handleChange(val) {
            this.bottomNav = val
            if (val == 'login') {
                if (leanStorage.isLogined()) {
                    this.$router.push('admin')
                } else {
                    setTimeout(() => {
                        this.$router.push('login')
                    }, 200)
                }
            } else {
                this.changeTheme(val)
            }
        },
        changeTheme(theme) {
            this.theme = theme
            const styleEl = this.getThemeStyle()
            styleEl.innerHTML = this.themes[theme] || ''
            this.$store.commit('setTheme', theme)
        },
        getThemeStyle() {
            const themeId = 'muse-theme'
            let styleEl = document.getElementById(themeId)
            if (styleEl) return styleEl
            styleEl = document.createElement('style')
            styleEl.id = themeId
            document.body.appendChild(styleEl)
            return styleEl
        },
        fetchTags() {
            let callback = function(tls, tags) {
                tags.forEach(tag => {
                    tls.tags.unshift(tag.attributes.tag)
                })
            }
            leanStorage.fetchTags(this, callback)
        },
        fetchPost(type){
            this.$store.commit('setSort',type)
        },
        fetchPostWithTag(tag){
            this.$store.commit('setTag',tag)
        }
    }
}
</script>
<style>
.drawer-nav {
    bottom: 0;
    position: absolute!important;
}

.chip-tag {
    margin: 5px;
}
</style>
