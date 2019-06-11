<template>
  <div class="header-container">
    <div class="header-left">
      <div class="nickname fw fs14">
        <span>武汉众为信息技术有限公司</span>
      </div>
    </div>
    <div class="header-right">
      <div> 浏览次数：{{beowser_Num}}次 </div>
      <div class="ml30" @click="showServiceModal"><span class="fa fa-user-circle-o"></span><span class="ml10">联系客服</span></div>
      <div class="ml30" @click="reloadPage"><span class="fa fa-trash-o"></span><span class="ml10">清理缓存</span></div>
      <div class="ml30"><span class="fa fa-sign-out"></span><span class="ml10"><router-link :to="{path: '/'}" style="color:#333333;">安全退出</router-link></span></div>
    </div>
    <!--客服弹框-->
    <Modal
      v-model="showService"
      title="联系客服"
      width="300"
    >
      <div>
        <div class="qq-container">
          <span>咨询客服：</span>
          <span><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1590837658&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:1590837658:51" alt="点击这里给我发消息" title="点击这里给我发消息"/></a></span>
        </div>
        <div class="qq-container">
          <span>审核客服：</span>
          <span><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2830557730&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:2830557730:51" alt="点击这里给我发消息" title="点击这里给我发消息"/></a></span>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
    export default {
      name: "headCom",
      data () {
        return {
          showService:false,
        }
      },
      computed:{
        beowser_Num:function () {
          return this.$store.state.browser_num;
        },
      },
      mounted(){
        if (sessionStorage.getItem('browserNum') != null) {
          this.$store.state.browser_num = sessionStorage.getItem('browserNum');
        }
      },
      methods:{
        showServiceModal:function () {
          this.showService = true;
        },
        reloadPage:function () {
          console.log(11);
          window.location.reload();
        }
      }
    }
</script>

<style lang="less" scoped>
  .header-container{
    width: 100%;
    height: 64px;
    line-height: 64px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
   padding: 0 30px;
    .header-left{
      /*float: left;*/
      .nickname{
        display: inline-block;
        color: #333333;
      }
    }
    .header-right{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      color: #333333;
      div{
        cursor: pointer;
        span{
          height: 64px;
          line-height: 64px;
        }
      }
    }
  }
  .qq-container{
    font-size: 16px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 40px;
    /*line-height: 40px;*/
    text-align: center;
  }
</style>
