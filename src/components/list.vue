<template>
    <div class="gridlist-demo-container">
        <mu-grid-list class="gridlist-demo" v-bind:style="homeHeadHeight" :cols="cols">
            <mu-grid-tile v-for="(value, key, index) in list">
                <img :src="value.image" @click="lookImage(value.image);changeLiked(value)" />
                <span slot="title">{{value.tag}}</span>
                <mu-checkbox icon="favorite" slot="action" class="favorited" uncheckIcon="favorite_border" checkedIcon="favorite" :label="value.likedCount" @change="changeLiked(value)" v-model="value.isChecked" />
            </mu-grid-tile>
            <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" />
        </mu-grid-list>
        <mu-popup position="top" :overlay="true" :open="showImage" popupClass="lookImage" @close="showImage=false">
            <img :src="currentImage" alt="" dblclick="showImage=false" style="width:auto;height:auto;max-width:100%">
        </mu-popup>
    </div>
</template>
<script>
import leanStorage from './leanStorage'
import icloudUpload from '.././assets/icloudUpload.svg'
export default {
    data() {
            return {
                name: 'list',
                list: [],
                homeHeadHeight: {
                    height: 'auto'
                },
                loading: true,
                scroller: null,
                showImage: false,
                currentImage: '',
                cols: 2
            }
        },
        mounted: function() {
            this.homeHeadHeight.height = document.documentElement.clientHeight - this.$el.offsetTop + 'px'
            this.scroller = this.$el.firstChild
            if (document.documentElement.clientWidth <= 600) this.cols = 2
            if (document.documentElement.clientWidth > 600) this.cols = 3
            if (document.documentElement.clientWidth > 1000) this.cols = 4
            window.onresize = () => {
                this.homeHeadHeight.height = document.documentElement.clientHeight - this.$el.offsetTop + 'px'
                if (document.documentElement.clientWidth <= 600) this.cols = 2
                if (document.documentElement.clientWidth > 600) this.cols = 3
                if (document.documentElement.clientWidth > 1000) this.cols = 4
            }
        },
        beforeMount() {
            if (this.$route.name == 'homeList') {
                this.fetchForHome()
                this.$store.watch(function(state) {
                    return state.sort
                }, (val, oldval) => {
                    this.list = []
                    this.fetchForHome()
                })
                this.$store.watch(function(state) {
                    return state.tag
                }, (val, oldval) => {
                    this.list = []
                    this.fetchForTag()
                })
            }
            if (this.$route.name == 'searchResults')
                if (this.$route.params.keyword != '') {
                    this.fetchForSearch()
                }
        },
        methods: {
            fetchForHome(skip = 0) {
                let callback = function(tls, results) {
                    results.forEach((dom, index) => {
                        let isChecked = tls.isChecked(dom.attributes.liked)
                        tls.list.push({
                            image: dom.attributes.image.attributes.url,
                            id: dom.id,
                            likedCount: dom.attributes.liked.length.toString(),
                            tag: dom.attributes.tags.toString(),
                            liked: dom.attributes.liked,
                            isChecked: isChecked
                        })
                    })
                    tls.loading = false
                }
                leanStorage.fetchPostForHome(this, callback, skip);

            },
            fetchForSearch(skip = 0) {
                //设置搜索历史
                let keyword=this.$route.params.keyword
                let search = JSON.parse(localStorage.getItem('search')) || []
                let index = search.indexOf(keyword)
                if (index != -1) search.splice(index, 1)
                search.unshift(keyword)
                if (search.length > 30) search.pop()
                localStorage.setItem('search', JSON.stringify(search))

                this.$set(this, 'list', [])
                let callback = function(tls, results) {
                    if (results.length == 0) tls.$parent.showSearchTip = true
                    else tls.$parent.showSearchTip = false
                    results.forEach((dom, index) => {
                        let isChecked = tls.isChecked(dom.attributes.liked)
                        tls.list.push({
                            image: dom.attributes.image.attributes.url,
                            id: dom.id,
                            likedCount: dom.attributes.liked.length.toString(),
                            tag: dom.attributes.tags.toString(),
                            liked: dom.attributes.liked,
                            isChecked: isChecked
                        })
                    })
                    tls.loading = false
                }
                leanStorage.fetchPostForSearch(this, callback, this.$route.params.keyword, skip);

            },
            fetchForTag(skip = 0) {
                this.$set(this, 'list', [])
                let callback = function(tls, results) {
                    if (results.length == 0) tls.$parent.showSearchTip = true
                    else tls.$parent.showSearchTip = false
                    results.forEach((dom, index) => {
                        let isChecked = tls.isChecked(dom.attributes.liked)
                        tls.list.push({
                            image: dom.attributes.image.attributes.url,
                            id: dom.id,
                            likedCount: dom.attributes.liked.length.toString(),
                            tag: dom.attributes.tags.toString(),
                            liked: dom.attributes.liked,
                            isChecked: isChecked
                        })
                    })
                    tls.loading = false
                }
                leanStorage.fetchPostForSearch(this, callback, this.$store.state.tag, skip);

            },
            loadMore() {
                this.loading = true
                if (this.$route.name == 'homeList') {
                    this.fetchForHome(this.list.length)
                }
                if (this.$route.name == 'searchResults') {
                    this.fetchForSearch(this.list.length)

                }
            },
            lookImage(image) {
                this.currentImage = image;
                this.showImage = true
            },
            changeLiked(value) {
                if (!value.isChecked) {
                    let count = parseInt(value.likedCount)
                        ++count
                    value.likedCount = count.toString()
                    leanStorage.addLike(value);
                } else {
                    let count = parseInt(value.likedCount)
                        --count
                    value.likedCount = count.toString()
                    leanStorage.deleteLike(value)
                }
            },
            isChecked: function(arr) {
                if (!leanStorage.current()) return
                if (arr.indexOf(leanStorage.current().id) != -1) {
                    return true
                }
                return false
            }
        }
}
</script>
<style>
.gridlist-demo-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.gridlist-demo {
    width: 100%;
    height: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.favorited i {
    color: #ff8a80!important;
}

.favorited .mu-checkbox-icon {
    margin-right: 0;
}

.favorited .mu-checkbox-label {
    color: #ff8a80;
    padding-right: 2px;
}

.lookImage {
    width: auto;
    padding-top: 70px;
    background: none!important;
    text-align: center
}
</style>
