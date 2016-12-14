import leanStorage from 'leancloud-storage'
import storage from './storage'
// 初始化 leancloud-storage
var APP_ID = 'xxxxxxxxxxxxxxxxx';
var APP_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
leanStorage.init({
    appId: APP_ID,
    appKey: APP_KEY
});
//未登录用户 设置唯一标识
if (!localStorage.UUID) localStorage.setItem('UUID', generateUUID()) 
export default {
    current() {
            if (!leanStorage.User.current()) return { id: localStorage.UUID }
            return leanStorage.User.current()
        },
        getUserId() {
            if (!leanStorage.User.current()) return localStorage.UUID
            return leanStorage.User.current().id
        },
        loginWidthPassword: function(phone, password, callback) {
            leanStorage.User.logInWithMobilePhone(phone, password).then(function(loginedUser) {
                callback(loginedUser, undefined)
                localStorage.setItem('UUID', undefined)
            }, (function(error) {
                callback(undefined, error)
            }))

        },
        isLogined: function() {
            var currentUser = leanStorage.User.current()
            return currentUser
        },
        logOut() {
            leanStorage.User.logOut()
            localStorage.setItem('UUID', generateUUID())
        },
        uploadFile(file, dom) {
            let currentUser = this.current()
            var userFile = new leanStorage.File(file.name, file)
            userFile.save().then(function(fil) {
                var post = new leanStorage.Object('Post')
                post.set('image', fil)
                post.set('user', currentUser)
                let acl = new leanStorage.ACL()
                acl.setPublicReadAccess(true)
                acl.setWriteAccess('*', true)
                post.setACL(acl)
                post.save().then(function(p) {
                    var relation = currentUser.relation('post')
                    relation.add(post)
                    currentUser.save().then(function(e) {
                        dom.uploaded = true
                        dom.image = fil.attributes.url
                        dom.id = p.id
                    })
                })
            }, function(error) {
                // 异常处理
                console.error(error);
            });
        },
        fetchPost(tls, callback, skip = 0) {
            let currentUser = this.current()
            var relation = currentUser.relation('post');
            var query = relation.query();
            // query.limit(10)
            query.skip(skip)
            query.ascending('createdAt'); //升序
            query.find().then(function(results) {
                callback(tls, results)
            }, function(error) {});
        },
        deletePost(tls, callback) {
            var object = leanStorage.Object.createWithoutData('Post', tls.list[tls.currentKey].id);
            object.destroy().then(function(success) {
                callback(tls)
            }, function(error) {
                console.log(error);
            });
        },
        fetchPostForHome(tls, callback, skip = 0) {
            let query = new leanStorage.Query('Post')
            query.limit(15)
            query.skip(skip)
            if (tls.$store.state.sort == '最新')
                query.descending('createdAt'); //最新
            if (tls.$store.state.sort == '最热')
                query.descending('likedCount'); //最新
            if (tls.$store.state.sort == '收藏')
                query.contains('liked', this.getUserId())
            query.find().then(results => {
                callback(tls, results)
            }, error => {

            })
        },
        saveTags(postId, tags) {
            let post = leanStorage.Object.createWithoutData('Post', postId)
            let tagQuery = []
            let empty = new leanStorage.Query('Tags') //清空当前post的tags操作
            empty.equalTo('for', post).find().then(res => {
                res.forEach(sub => {
                    let relation = sub.relation('post')
                    relation.remove(post)
                    sub.save().then(res => {
                        // console.log(res) 
                    })
                })
            })

            tags.forEach((tag, index) => { //为每个标签添加relation
                tagQuery[index] = new leanStorage.Query('Tags')
                tagQuery[index].equalTo('tag', tag) //寻找已经存在的标签数据行
                tagQuery[index].find().then(res => {
                    if (res.length > 0) {
                        let relation = res[0].relation('post') //获取标签relation列表
                        relation.add(post)
                        res[0].save().then(res => {
                            // console.log(res);
                        })
                    } else {
                        tagQuery[index] = new leanStorage.Object('Tags')
                        let relation = tagQuery[index].relation('post')
                        relation.add(post)
                        tagQuery[index].set('tag', tag)
                        tagQuery[index].set('for', post)
                        tagQuery[index].save().then(res => {
                            // console.log(res);
                        })
                    }
                })
            })

            post.set('tags', tags)
            post.save().then(res => {
                // console.log(res);
            })
        },
        fetchTags(tls, callback) {
            let query = new leanStorage.Query('Tags')
            query.limit(100)
            query.find().then(res => {
                callback(tls, res)
            })
        },
        addLike(value) {
            let post = leanStorage.Object.createWithoutData('Post', value.id)
            post.addUnique('liked', [this.getUserId()])
            post.save()
        },
        deleteLike(value) {
            let post = leanStorage.Object.createWithoutData('Post', value.id)
            post.remove('liked', [this.getUserId()])
            post.save()
        },
        fetchPostForSearch(tls, callback, keyword, skip = 0) {
            let query = new leanStorage.Query('Post')
            query.contains('tags', keyword)
            query.limit(15)
            query.skip(skip)
            query.descending('createdAt'); //降序
            query.find().then(res => {

                //渲染
                callback(tls, res)

            })
        }
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
