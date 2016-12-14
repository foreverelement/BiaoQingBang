<template>
    <div class="serach">
        <mu-appbar>
            <mu-text-field icon="search" class="appbar-search" slot="default" fullWidth v-model="searchValue" hintText="请输入搜索内容 ↵" @keyup.enter.native="search" />
            <mu-flat-button color="white" label="取消" slot="right" @click="back" />
        </mu-appbar>
        <div class="search-history" v-if="$route.path=='/search'||$route.path=='/search/'">
            <mu-sub-header>搜索记录</mu-sub-header>
            <mu-content-block>
                <mu-chip class="chip" v-for="history in searchHistoryList">
                    {{history}}
                </mu-chip>
                <div style="text-align:center" v-if="searchHistoryList.length==0">暂无记录</div>
            </mu-content-block>
        </div>
        <div style="text-align:center;margin-top:10px;" v-if="showSearchTip">暂无搜索结果</div>
        <div id="results">
            <router-view class="search" ref="list" />
        </div>
    </div>
</template>
<script>
import leanStorage from './leanStorage'
export default {
    data() {
            return {
                name: 'search',
                searchValue: '',
                searchHistoryList: [],
                showSearchTip: false
            }
        },
        watch: {
            searchValue: function(val, oldval) {
                this.$router.push('/search/' + val)
            }
        },
        mounted() {
            if (this.$route.params.keyword)
                this.searchValue = this.$route.params.keyword
            this.searchHistoryList = JSON.parse(localStorage.getItem('search')) || []
        },
        methods: {
            back() {
                this.$router.push('/')
            },
            search() {
                if (this.searchValue != '')
                    this.$refs.list.fetchForSearch()
                else this.showSearchTip = false
            }
        },
}
</script>
<style scoped>
.mu-appbar {
    text-align: right
}

.focus-state {
    color: #fff!important;
}

.appbar-search {
    margin: 0;
    margin-top: 16px;
    animation: showBar .4s;
    overflow: hidden;
}

.chip {
    margin: 5px;
    margin-right: 0;
}

#results {
    width: 100%;
}

@keyframes showBar {
    from {
        width: 0;
    }
    to {
        width: 100%
    }
}
</style>
