<template>
  <div>
    <div class="xuanle">
      <img src="../../assets/xuanleLogo.png"/>
      <span class="ml15 fs22">附近小店管理后台</span>
    </div>
    <div class="user-message">
      <img :src="shop_Logo" class="shop-logo"/>
      <p class="text-center shop-name fs20">{{shop_Name}}</p>
    </div>
    <!--<template v-if="isShowMenu">-->
      <Menu :active-name="activeNav" @on-select="changeMenuItem" theme="dark" width="auto" style="margin-top: 13px" class="fs16 fw">
        <MenuItem name="/firstPage" :to="{path:'/firstPage'}" class="menu-custom">
          <img src="../../assets/icon/index.png" style="width: 20px;height: 20px;"/>
          <span class="menu-span ml30">后台首页</span>
        </MenuItem>
        <MenuItem name="/productManage" :to="{path:'/productManage'}" class="menu-custom">
          <img src="../../assets/icon/product.png" style="width: 20px;height: 20px;"/>
          <span class="menu-span ml30">商品管理</span>
        </MenuItem>
        <MenuItem name="/allOrders" :to="{path:'/allOrders'}" class="menu-custom">
          <img src="../../assets/icon/order.png" style="width: 20px;height: 20px;"/>
          <span class="menu-span ml30">订单管理</span>
        </MenuItem>
        <MenuItem name="/financeManageFirst" :to="{path:'/financeManageFirst'}" class="menu-custom">
          <img src="../../assets/icon/finance.png" style="width: 20px;height: 20px;"/>
          <span class="menu-span ml30">财务管理</span>
        </MenuItem>
        <MenuItem name="/shopInfoCheck" :to="{path:'/shopInfoCheck'}" class="menu-custom">
          <img src="../../assets/icon/shop.png" style="width: 20px;height: 20px;"/>
          <span class="menu-span ml30">小店管理</span>
        </MenuItem>
        <MenuItem name="/userCenter" :to="{path:'/userCenter'}" class="menu-custom">
          <img src="../../assets/icon/personCenter.png" style="width: 20px;height: 20px;"/>
          <span class="menu-span ml30">个人中心</span>
        </MenuItem>
      </Menu>
    <!--</template>-->
    <!--<template v-else>-->
      <!--<div class="trance-container">-->
        <!--<p style="color:#fff">订单追踪：<span>{{orderTrance.status == 1 ? '待发货' : orderTrance.status == 2 ? '待签收' : orderTrance.status == 3 ? '已完成' : orderTrance.status == 4 ? '待审批' : orderTrance.status == 8 ? '已退款' : orderTrance.status == 6 ? '待退款' : '已取消'}}</span></p>-->
        <!--<div class="mt10 trance-detail" v-for="(item,index) in orderTrance.mes" :key="'trance' + index">-->
          <!--<div><Icon type="ios-arrow-forward" />{{item.detail}}</div>-->
          <!--<div>{{item.createTime}}</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</template>-->
  </div>
</template>

<script>
  export default {
    name: "navView",
    // props:{
    //   orderTrance:{}
    // },
    data () {
      return {
        isShowMenu:true,
        list: [
          {name:'/firstPage', icons: '../../assets/icon/index.png', nickname:'首页'},
          {name:'/productManage', icons: '../../assets/icon/product.png', nickname:'商品管理'},
          {name:'/allOrders', icons: '../../assets/icon/order.png', nickname:'订单管理'},
          {name:'/financeManageFirst', icons: '../../assets/icon/finance.png', nickname:'财务管理'},
          // {name:'/5', icons: 'ios-home', nickname:'活动管理'},
          {name:'/shopInfoCheck', icons: '../../assets/icon/shop.png', nickname:'小店管理'},
          {name:'/userCenter', icons: '../../assets/icon/personCenter.png', nickname:'个人中心'}
        ],
      }
    },
    computed:{
      shop_Name:function () {
        return this.$store.state.shop_name;
      },
      shop_Logo:function () {
        return this.$store.state.shop_logo;
      },
      activeNav :function () {
        return this.$store.state.active_nav;
      }
    },
    mounted () {
      if (sessionStorage.getItem('shopName') != null) {
        this.$store.state.shop_name = sessionStorage.getItem('shopName');
      }
      if (sessionStorage.getItem('shopLogo') != null) {
        this.$store.state.shop_logo = sessionStorage.getItem('shopLogo');
      }
      if (sessionStorage.getItem('activeNav') != null) {
        this.$store.dispatch('setActiveNav',sessionStorage.getItem('activeNav'));
      }
      // if (this.$route.path === '/orderDetail') {
      //   this.isShowMenu = false;
      // }
    },
    methods:{
      changeMenuItem:function (name) { //选中菜单改变时触发，修改active_nav
        this.$store.dispatch('setActiveNav',name);
      },
    }
  }
</script>

<style lang="less" scoped>
  .xuanle{
    padding: 22px 0 22px 33px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    span{
      color: #fff;
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
  }
  .user-message{
    height: 280px;
    position:relative;
    background:  rgba(81,90,110,0.4) url("../../assets/logoBg.jpg") no-repeat 0 center;
    background-size: 100% 100%;
    .shop-logo{
      width: 100px;
      height: 100px;
      border-radius: 10px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
    .shop-name{
      color:#fff;
      position: absolute;
      top: 214px;
      width: 300px;
      padding: 0 5px;
    }
  }
  .menu-custom{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    img{
      width: 18px;
      height: 18px;
    }
  }
  .menu-span{
    display: inline-block;
    width: 80px;
  }
  .trance-container{
    padding: 20px;
    .trance-detail{
      color:#fff;
    }
  }
</style>
<style>
  .ivu-menu-item{
    padding: 14px 50px!important;
    background:rgba(52,72,92,1);
    border-left: 6px solid rgba(52,72,92,1);
  }
  .ivu-menu-item-active:not(.ivu-menu-submenu){
    color: #ffffff!important;
    background:rgba(38,53,68,1)!important;
    border-left: 6px solid #4A80FC;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover{
    background:rgba(38,53,68,1)!important;
    border-left: 6px solid #4A80FC;
  }
</style>
