<template>
  <div class="login-container">
    <div class="login-area">
      <h1 class="text-center">附近小店商户后台</h1>
      <div class="login-form mt20 text-center">
        <div class="login-center">统一登录中心</div>
        <div class="login-line"></div>
        <Form :model="loginData" ref="loginData" :rules="loginRule" style="width: 300px;margin: 0 auto">
          <FormItem prop="userName">
            <Input prefix="ios-contact" type="text" v-model.trim="loginData.userName" placeholder="请输入账号" @on-enter="toLoading" class="mt30"/>
          </FormItem>
          <FormItem prop="password">
            <Input prefix="ios-unlock" type="password" v-model.trim="loginData.password" placeholder="请输入密码" @on-enter="toLoading" class=""/>
          </FormItem>
          <FormItem style="text-align: left">
            <Checkbox v-model="rememberPass">&nbsp;&nbsp;记住密码</Checkbox>
          </FormItem>
        </Form>
        <div class="mt30">
          <Button type="primary" :loading="loading" @click="toLoading" style="width: 300px">
            <span v-if="!loading">登录</span>
            <span v-else>登陆中...</span>
          </Button>
        </div>
      </div>
    </div>
    <Modal
      title="登录失败"
      v-model="loginFail"
    >
      <p ref="loginFail"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <back-view :width="baWidth" :height="baHeight"></back-view>
  </div>
</template>

<script>
  import axios from '../../../src/axios/axios'
  import {hex_md5} from '../../assets/js/md5'
  const loginName = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写账号'));
    } else {
      callback();
    }
  };
  const password = (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请填写密码'));
    } else {
      callback();
    }
  };
  export default {
    name: "login",
    data () {
      return {
        rememberPass:false,
        loading : false,
        loginFail:false,
        baWidth:window.innerWidth,
        baHeight:window.innerHeight,
        loginData:{
          userName:'',
          password:'',
        },
        loginRule:{
          userName:[{validator:loginName}],
          password:[{validator:password}]
        },
      }
    },
    methods : {
      toLoading: function () {
        this.$refs.loginData.validate(valid => {
          if (valid) {
            this.loading = true;
            localStorage.setItem('keyLogin',this.loginData.userName);
            if (this.rememberPass) {
              localStorage.setItem('keyPass',this.loginData.password);
            } else {
              localStorage.removeItem('keyPass');
            }
            axios.Login({userName:this.loginData.userName,password:hex_md5(this.loginData.password)})
              .then(res => {
                if (res.code === '0') {
                  this.$store.dispatch('setShopName',res.data.shopName);
                  this.$store.dispatch('setShopId',res.data.shopId);
                  this.$store.dispatch('setShopLogo',res.data.shopLogo);
                  this.$store.dispatch('setLoginName',res.data.loginName);
                  this.$store.dispatch('setBrowserNum',res.data.browserNum);
                  this.$router.push({path:'/firstPage'});
                  this.$store.dispatch('setActiveNav','/firstPage');
                  sessionStorage.setItem('longitude',res.data.longitude);
                  sessionStorage.setItem('latitude',res.data.latitude);
                  sessionStorage.setItem('userId',res.data.userId);
                  sessionStorage.setItem('shopNature',res.data.shopNature);
                } else {
                  this.loginFail = true;
                  this.$refs.loginFail.innerHTML = res.message;
                  this.loading = false;
                }
              })
              .catch(error => {
                console.log(error);
                this.loginFail = true;
                this.$refs.loginFail.innerHTML = '登录出错！';
                this.loading = false;
              })
          }
        });

      },
      del:function () {
        this.loginFail = false;
      }
    },
    mounted () {
      sessionStorage.clear();
      if (localStorage.getItem('keyLogin') != null) {
        this.loginData.userName = localStorage.getItem('keyLogin');
      }
      if (localStorage.getItem('keyPass') != null) {
        this.loginData.password = localStorage.getItem('keyPass');
        this.rememberPass = true;
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-area{
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 500px;
    height: 500px;
    border-radius: 10px;

    h1{
      color: #ffffff;
    }
    .login-form{
      background-color: #ffffff;
      padding-bottom: 50px;
      border-radius: 10px;
      .login-line{
        background: -webkit-linear-gradient(left, #3399CC , #D5D5D5);
        background: -o-linear-gradient(right, #3399CC, #D5D5D5);
        background: -moz-linear-gradient(right, #3399CC, #D5D5D5);
        background: linear-gradient(to right, #3399CC , #D5D5D5);
        height: 2px;
      }
      .login-center{
        color: #3399CC;
        /*border-bottom: 2px solid #3399CC;*/
        text-align: left;
        padding: 10px 0 10px 20px;
        font-size: 16px;
      }
    }
  }
</style>
