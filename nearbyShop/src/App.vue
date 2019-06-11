<template>
  <div id="app" class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider class="" v-show="$route.path!=='/'" style="width: 300px;min-width: 300px;max-width: 300px;background:rgba(52,72,92,1);">
        <nav-view v-if="$route.path!=='/'" :order-trance="tranceData"></nav-view>
      </Sider>
      <Layout>
        <Header v-if="$route.path!=='/'" :style="{backgroundColor:'#fff',padding:0}">
          <head-view></head-view>
        </Header>
        <Content :class="$route.path === '/' ? 'body-height-all' : 'main-pad'">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
    </div>
</template>

<script>
export default {
    name: 'App',
    data(){
        return {
          isShowMenu:true,
          tranceData:''
        }
    },
    methods: {
      // getOrderTrance:function (mes) {
      //   this.tranceData = mes;
      // }
    },

};
</script>

<style lang="less" scoped>
  //修改默认样式
  .ivu-menu-item{
    text-align: center;
    font-size: 16px;
  }
.body-height{
  height: calc(100vh - 64px);
}
.body-height-all{
  height: calc(100vh);
}
  .main-pad{
    padding: 20px;
    min-height: 280px;
    height: calc(100vh - 64px);
  }
  .layout-con{
    height: 100%;
    width: 100%;
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>
<style>
  .ivu-layout-sider{
    width: 300px!important;
  }
</style>


