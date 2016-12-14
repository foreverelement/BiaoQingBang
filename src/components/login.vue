<template>
    <div id="login">
        <mu-appbar title="登录">
            <mu-icon-button icon='keyboard_arrow_left' slot="left" @click="goback" />
            <mu-icon-button icon='' slot="right" />
        </mu-appbar>
        <br/>
        <div class="login-form">
            <mu-text-field hintText="手机号码" type="number" icon="stay_current_portrait" fullWidth :maxLength="11" v-model="user" />
            <br/>
            <mu-row gutter>
                <mu-col width="85" tablet="90" desktop="90">
                    <mu-text-field hintText="密码" :type="passwordInputType" icon="vpn_key" fullWidth v-model="password" /></mu-col>
                <mu-col width="15" tablet="10" desktop="10" :style="{textAlign:'center'}">
                    <mu-checkbox uncheckIcon="visibility_off" checkedIcon="visibility" v-bind:style="{marginTop:12+'px'}" v-model="visibility" @input="setVisibility" /></mu-col>
            </mu-row>
            <br/>
            <mu-raised-button label="登录" primary fullWidth class="single-button" @click="login" />
        </div>
        <mu-toast v-if="toast" :message="toastMessage" @close="hideToast" />
        <mu-popup position="top" :overlay="false" :open="showProgress" popupClass="popup-progress">
            <mu-circular-progress :size="60" :strokeWidth="5" />
        </mu-popup>
    </div>
</template>
<script>
import leanStorage from './leanStorage'
export default {
    data() {
            return {
                user: '',
                password: '',
                visibility: false,
                passwordInputType: 'password',
                toastMessage: '',
                toast: false,
                showProgress: false
            }
        },
        methods: {
            goback: function() {
                this.$router.push('/')
            },
            login() {
                this.showProgress = true
                window.currentComponent = this;
                let callback = function(success, error) {
                    if (success) {
                        window.currentComponent.toastMessage = '登录成功'
                        window.currentComponent.$router.push('/admin')
                        window.currentComponent.$store.commit('setUser', success)
                    } else {
                        window.currentComponent.toastMessage = '登录失败 ' + error
                    }
                    window.currentComponent.showToast()
                    window.currentComponent.showProgress = false
                }
                leanStorage.loginWidthPassword(this.user.toString(), this.password.toString(), callback)
            },
            setVisibility() {
                if (this.visibility) {
                    this.passwordInputType = 'text'
                } else {
                    this.passwordInputType = 'password'
                }
            },
            showToast() {
                this.toast = true
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(() => {
                    this.toast = false
                }, 3000)
            },
            hideToast() {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            }
        }
}
</script>
<style>
.login-form {
    max-width: 600px;
    left: 0 ;
    right: 0;
    margin: auto;
}

.single-button {
    height: 45px!important;
}
</style>
