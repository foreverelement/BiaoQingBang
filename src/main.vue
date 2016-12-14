<template>
    <div id="main" v-cloak>
        <transition mod="out-in" :name="transitionName">
            <!-- <keep-alive> -->
            <router-view key="main" />
            <!-- </keep-alive> -->
        </transition>
    </div>
</template>
<script>
export default {
    name: 'main',
    data() {
        return {
            transitionName: 'slide-out'
        }
    },
    watch: {
        '$route' (to, from) {
            let toDepth = to.path.split('/').length
            let fromDepth = from.path.split('/').length
            if (to.path.charAt(to.path.length - 1) != '/')
                toDepth += 1
            if (from.path.charAt(from.path.length - 1) != '/')
                fromDepth += 1
            this.transitionName = toDepth >= fromDepth ? 'slide-in' : 'slide-out'
            if (from.name == 'search'|| from.name=="searchResults" || to.name == 'search' ) {
                this.transitionName = 'open-search'
            }
        }
    }
}
</script>
<style>
/*@import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic';*/


/*@import 'http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css';*/


/*@import 'https://unpkg.com/animate.css@3.5.1/animate.min.css';*/


/*ui 全局修改 */

.mu-grid-list {
    margin-top: 0!important;
}

.mu-appbar {
    text-align: center;
}

.mu-toast {
    left: 0;
    right: 0;
    margin: auto;
}

.popup-progress {
    background-color: rgba(0, 0, 0, 0)!important;
    margin-top: 130px;
}

.mu-appbar-title .mu-text-field-focus-line {
    background-color: #fff;
}


/*		*/

#main {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    /*max-width: 800px;*/
    left: 0;
    right: 0;
    margin: auto;
    user-select: none;
}

[v-cloak] {
    display: none
}

.slide-in,
.slide-out {
    transition: all .4s;
    position: absolute;
}

.slide-in-enter-active {
    animation: fromRight .4s;
}

.slide-in-leave-active {
    animation: toRight .2s;
    position: absolute;
    width: 100%;
}

@keyframes fromLeft {
    from {
        transform: translateX(-100%);
        opacity: 0
    }
    to {
        transform: translateX(0);
        opacity: 1
    }
}

@keyframes fromRight {
    from {
        transform: translateX(100%);
        opacity: 0
    }
    to {
        transform: translateX(0);
        opacity: 1
    }
}

.slide-out-enter-active {
    animation: fromLeft .4s;
    position: absolute;
    width: 100%;
}

.slide-out-leave-active {
    animation: toLeft .2s;
    position: absolute;
}

@keyframes toRight {
    from {
        /*transform: translateX(0);*/
        opacity: 1
    }
    to {
        /*transform: translateX(100%);*/
        opacity: 0
    }
}

@keyframes toLeft {
    from {
        /*transform: translateX(0);*/
        opacity: 1
    }
    to {
        /*transform: translateX(-100%);*/
        opacity: 0
    }
}

.open-search-enter-active {
    animation: showSearch .2s;
    transition: all .2s;
}

@keyframes showSearch {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
        width: 100%;
    }
}

.open-search-leave-active {
    animation: closeSearch .2s;
    transition: all .2s;
    position: absolute;
    width: 100%;
}

@keyframes closeSearch {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
