<template>
    <div id="post">
        <mu-grid-list class="gridlist-demo" v-bind:style="homeHeadHeight" :cols="1" ref="list">
            <mu-grid-tile v-for="(value, key, index) in list" :key="key">
                <mu-circular-progress v-if="!value.uploaded" :size="40" :style="{position:'absolute',top:'10px',right:'10px'}" />
                <!--                 <input hintText="输入标签，逗号分隔" placeholder="输入标签，逗号分隔" @change="inputChange" @input="handleInput" :dataSource="dataSource" slot="title" @blur="saveTags(key)" v-model="value.tags" :style="{border: 'none',
    borderRadius: '5px',
    background: 'hsla(0, 0%, 100%, 0.32)' }"/> -->
                <mu-circular-progress v-if="!value.uploaded" :size="40" :style="{position:'absolute',top:'10px',right:'10px'}" />
                <img :src="value.image" />
                <mu-auto-complete :hintText="value.tags||'输入标签，逗号分隔'" @input="handleInput" :dataSource="dataSource" slot="title" @blur="saveTags(key)" v-model="value.tags" :scroller="scroller" />
                <mu-flat-button label="删除" class="demo-flat-button" secondary slot="action" @click="dialog=true;currentKey=key" />
            </mu-grid-tile>
        </mu-grid-list>
        <mu-raised-button label="上传图片" class="demo-flat-button">
            <input type="file" @change="selectedFiles" class="file-button" accept="image/jpeg,image/gif,image/png" multiple>
        </mu-raised-button>
        <mu-toast v-if="toast" message="已删除" @close="hideToast" />
        <mu-dialog :open="dialog" title="警告" @close="closeDialog">
            {{toastMessage}}
            <mu-flat-button slot="actions" @click="closeDialog" primary label="取消" />
            <mu-flat-button slot="actions" secondary @click="deletePost" label="确定删除" />
        </mu-dialog>
    </div>
</template>
<style>
.file-button {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
}
</style>
<script>
import leanStorage from './leanStorage'
import icloudUpload from '.././assets/icloudUpload.svg'

export default {
    data() {
            return {
                dataSource: [],
                files: [],
                list: [], //这里发现数组里必须加{}，似乎不加不能发现对象属性的变动，只能检测到数组的改动
                homeHeadHeight: {
                    height: '450px'
                },
                toast: false,
                dialog: false,
                currentKey: '',
                toastMessage: '别怪我没提醒你，这儿可没有回收站',
                scroller: window //autoComplate滚动跟随
            }
        },
        methods: {
            handleInput(val) {
                this.dataSource = [val]
            },
            selectedFiles(e) {
                let files = e.target.files;
                for (let i = 0; i < files.length; i++) {

                    this.list.unshift({
                        image: icloudUpload,
                        tag: [],
                        uploaded: false
                    })
                    leanStorage.uploadFile(files[i], this.list[0])
                }
            },
            fetchPost() {
                let callback = function(tls, childs) {
                    tls.list = []
                    childs.forEach(function(dom, index) {
                        tls.list.unshift({
                            image: null,
                            id: null,
                            tags: null
                        })
                        tls.$set(tls.list[0], 'image', dom.attributes.image.attributes.url)
                        tls.$set(tls.list[0], 'id', dom.id)
                        tls.$set(tls.list[0], 'tags', dom.attributes.tags.toString())
                        tls.$set(tls.list[0], 'uploaded', true)
                    })
                }
                leanStorage.fetchPost(this, callback)
            },
            deletePost() {
                this.dialog = true
                let callback = function(tls) {
                    tls.showToast()
                    tls.list.splice(tls.currentKey, 1)
                }
                leanStorage.deletePost(this, callback)
                this.closeDialog()
            },
            saveTags(key) {
                let id = this.list[key].id
                let tags = this.list[key].tags
                if (tags=='') {
                	leanStorage.saveTags(id, [])
                	return
                }
                tags = tags.replace(/，/g, ',')
                if (tags.charAt(tags.length - 1) == ',' || tags.charAt(tags.length - 1) == '，') tags = tags.substring(0, tags.length - 1)
                tags = tags.trim()
                tags = tags.split(',')
                tags.forEach((tag, index) => {
                    if (tag == '') tags.splice(index, 1)
                })
                if (tags.length > 3) tags.splice(0, 3)
                leanStorage.saveTags(id, tags)
            },
            showToast() {
                this.toast = true
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(() => {
                    this.toast = false
                }, 2000)
            },
            hideToast() {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            openDialog() {
                this.dialog = true
            },
            closeDialog() {
                this.dialog = false
            }
        },
        mounted: function() {
            setTimeout(() => {
                this.homeHeadHeight.height = document.documentElement.clientHeight - 115 + 'px'

            }, 0);
            this.scroller = this.$refs.list.$el //autoComplate滚动跟随
        },
        beforeMount: function() {
            this.fetchPost()
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
    /*width: 500px;*/
    /*height: auto;*/
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.favorited {
    color: #ff8a80!important;
}

.demo-flat-button {
    margin: 12px;
}

.progress {
    background-color: rgba(0, 0, 0, 0)!important;
}
</style>
