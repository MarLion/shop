<template>
    <div class="productManage-container">
        <!-- 商品搜索、筛选区 -->
      <div>
        <ul class="nav-title">
          <li v-for="(item,index) in list" :key="index" :class="{active: checkindex === index}" @click="toggleCategory(index)">{{item.nickname}}</li>
        </ul>
        <!-- 主体内容区域 -->
        <div class="content container">
          <!-- 商品搜索 -->
          <div class="content-search">
            <div class="search-text">
              <Input search enter-button="搜索"  placeholder="输入商品名称、商品ID、商品售价进行搜索" v-model.trim="searchParams.searchCriteria" @on-search="searchGoods" size="large" style="width: 400px;"/>
              <span @click="openToggle" class="user-click">{{opens}}详细搜索条件 <img src="../../images/arrow1.png" alt=""/></span>
            </div>
          </div>
          <!-- 商品详细搜索条件 -->
          <div class="search-exact" v-if="isopen">
            <div class="exact-container">
              <div class="exact-detail small-width">
                <span>商品名称：</span>
                <span><Input clearable v-model.trim="searchParams.goodsName"  style="width: 120px"/></span>
              </div>
              <div class="exact-detail small-width">`
                <span>商品编码：</span>
                <span><Input clearable v-model.trim="searchParams.goodsNo" style="width: 120px"/></span>
              </div>
              <div class="exact-detail long-width">
                <span>商品价格：</span>
                <span><InputNumber clearable v-model.trim="searchParams.lowPrice" style="width: 120px"></InputNumber></span><span class="ml10">-</span><span class="ml10"><InputNumber clearable v-model.trim="searchParams.highPrice" style="width: 120px"></InputNumber></span>
              </div>
              <div>
                <Button type="info" @click="exactSearchGoods">查询</Button>
              </div>
              <div class="exact-detail small-width mt10">
                <span>一级分类：</span>
                <span>
                     <Select v-model="searchParams.firstClassLevel" style="width: 120px;" clearable @on-change="getSecond">
                      <Option v-for="(item,index) in firstClassList" :key="index" :value="item.id">
                        {{item.typeName}}
                      </Option>
                    </Select>
                   </span>
              </div>
              <div class="exact-detail small-width mt10">
                <span>二级分类：</span>
                <span>
                      <Select v-model="searchParams.secondClassLevel" style="width: 120px;" clearable>
                        <Option v-for="(item,index) in secondClassList" :key="index" :value="item.id">
                          {{item.typeName}}
                        </Option>
                      </Select>
                   </span>
              </div>
              <div class="exact-detail long-width mt10">
                <span>商品销量：</span>
                <span><InputNumber clearable v-model.trim="searchParams.lowCountSale"  style="width: 120px"></InputNumber></span><span class="ml10">-</span><span class="ml10"><InputNumber clearable v-model.trim="searchParams.countSale" style="width: 120px"></InputNumber></span>
              </div>
              <div class="mt10">
                <Button type="info" @click="resetSearch">重置</Button>
              </div>
            </div>
          </div>
      </div>
      </div>
      <div class="list-most mt20">
        <div>
          <Button type="info" @click="openAddWindow">新增商品</Button>
          <Button type="info">批量导出</Button>
        </div>
        <!-- 产品列表 -->
        <div class="list-tit mt20">
          <Row>
            <Col span="1"><div class="text-center"><Checkbox></Checkbox></div></Col>
            <Col span="6"><div class="text-center">商品名称</div></Col>
            <Col span="3"><div class="text-center">售价</div></Col>
            <Col span="2"><div class="text-center">库存</div></Col>
            <Col span="2"><div class="text-center">销量</div></Col>
            <Col span="3"><div class="text-center">审批状态</div></Col>
            <Col span="3"><div class="text-center">上架时间</div></Col>
            <Col span="4"><div class="text-center">操作</div></Col>
          </Row>
        </div>
        <div class="list-container clearfloat pos-re">
          <Spin fix v-if="loading">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中...</div>
          </Spin>
          <div class="list-row">
            <Row class="list-detail" v-for="(item,index) in goodsList" :key="index">
              <Col span="1"><div class="text-center single-height" style="border-right: 1px solid #EBEEF1;"><Checkbox></Checkbox></div></Col>
              <Col span="6">
                <div class="list-name" style="border-right: 1px solid #EBEEF1;">
                  <img :src="item.goodsImg"/>
                  <p class="ml15">
                    <span>{{item.goodsName}}</span>
                    <span v-if="searchParams.status !== 2">编码：{{item.goodsNo}}</span>
                    <span v-else>规格：{{item.goodsSpecificationName}}</span>
                  </p>
                </div>
              </Col>
              <Col span="3">
                <div class="text-center list-price" style="border-right: 1px solid #EBEEF1;">
                  <p>{{item.integralPrice}}玄乐&nbsp;&nbsp;+</p>
                  <p>{{item.maxDeductionIntegral}}积分</p>
                </div>
              </Col>
              <Col span="2"><div class="text-center single-height" style="border-right: 1px solid #EBEEF1;">{{item.inStock}}</div></Col>
              <Col span="2"><div class="text-center single-height" style="border-right: 1px solid #EBEEF1;">{{item.countSale}}</div></Col>
              <Col span="3">
                <div class="text-center list-check" style="border-right: 1px solid #EBEEF1;">
                  <p :class="item.checkStatus === 0 ? 'color-warning' : item.checkStatus === 2 ? 'color-error' : item.checkStatus === 1 ? 'color-success' : ''">
                    {{item.checkStatus === 0 ? '审批中' : item.checkStatus === 1 ? '审批通过' : item.checkStatus === 2 ? '审批未通过' : '取消审批'}}
                  </p>
                  <p>管理费：{{item.goodsServiceRate}}%</p>
                </div>
              </Col>
              <Col span="3">
                <div class="text-center list-status single-height" style="border-right: 1px solid #EBEEF1;">
                  <P :class="item.status === 0 ? '' : 'color-error'">{{item.status === 0 ? '出售中' : '未上架'}}</P>
                  <p v-if="item.status === 0">{{item.createTime}}</p>
                </div>
              </Col>
              <Col span="4">
                <div class="text-center list-operate">
                  <p><Button type="info" size="small" :data-id="item.id" @click="openEditWindow(item.id)">编辑</Button></p>
                  <p class="ml15"><Button type="warning" size="small" :data-id="item.id" @click="openLookWindow(item.id)">查看</Button></p>
                  <p v-if="item.status === 0" class="ml15"><Button type="error" size="small" :data-id="item.id" @click="showConfirm($event,1)" class="">下架</Button></p>
                  <p v-else-if="item.status === 1 && (item.checkStatus === 1 || item.checkStatus === 3)" class="ml15"><Button type="success" size="small" :data-id="item.id" @click="showConfirm($event,2)" class="">上架</Button></p>
                  <p v-else-if="item.status === 1 && item.checkStatus === 0" class="ml15"><Button type="error" size="small" :data-id="item.id" @click="showCancel($event)" class="">取消上架</Button></p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div class="mt30 text-center">
          <Page :total="total" :current="searchParams.pageNum" show-total show-elevator show-sizer @on-page-size-change="goodPageChangeSize" @on-change="goodPageChange"/>
        </div>
      </div>
      <!--下架操作提示弹框-->
      <Modal
        title="提示"
        v-model="confirmOperate"
        :mask-closable = "false"
        ref="confirm"
        @on-ok="changStatus"
        @on-cancel="hideConfirm"
        @on-visible-change="changConfirm"
      >
        <div v-if="statusNo === 1">确定下架该商品？</div>
        <div v-else>确定上架该商品？</div>
      </Modal>
      <!--待审批状态下取消上架-->
      <Modal
        title="提示"
        v-model="confirmCancel"
        :mask-closable = "false"
        ref="cancel"
        @on-ok="cancelStatusOk"
        @on-cancel="hideCancel"
        @on-visible-change="changCancel"
      >
        确定取消上架该商品？
      </Modal>
      <!--提示弹框-->
      <Modal
        title="提示"
        v-model="goodTip"
        :mask-closable = "false"
      >
        <p ref="goodTip"></p>
        <div slot="footer">
          <Button type="info"  @click="del">确定</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
import axios from "../../axios/axios";
import * as base from '../../axios/base';
export default {
    data(){
        return {
          statusNo:true,
          userId:'',
          loading:false,
            total:0,
            isopen: false,
            goodTip:false,
            confirmOperate:false,
            confirmCancel:false,
            opens: '展开',
            list: [
              {nickname:'全部商品'},
              {nickname:'出售中'},
              {nickname:'已下架'},
              {nickname:'待审批'},
              {nickname:'无库存'}
            ],
            checkindex: 0,
            firstClassList:[],
            secondClassList:[],
            searchParams:{ //详细搜索参数
              searchCriteria: '',//综合搜索条件
              goodsName:'', //商品名称
              goodsNo:'', //商品编码
              lowPrice:null, //最低价格
              highPrice:null, //最高价格
              lowCountSale:null, //最低销量
              countSale:null, //最高销量
              firstClassLevel:'', //商品一级分类id
              secondClassLevel:'', //商品二级分类id
              status:null, //商品状态
              storeId:'', //商店id
              pageNum:1, //页码
              limit:10 //条数
            },
            statusId:'',
            goodsList:[],
          //待审批状态下取消上架参数
          cancelGoodsId:'',
        }
    },
    mounted(){
      this.userId = sessionStorage.getItem('userId');
      this.searchParams.storeId = sessionStorage.getItem('shopId');
      if (sessionStorage.getItem('checkIndex') !== null) {
        this.checkindex = parseInt(sessionStorage.getItem('checkIndex'));
      } else {
        this.checkindex = 0;
      }
      if (sessionStorage.getItem('searchStatus') !== null && sessionStorage.getItem('searchStatus') !== 'null') {
        this.searchParams.status = parseInt(sessionStorage.getItem('searchStatus'));
      } else {
        this.searchParams.status = null
      }
      this.getAllGoodList();
      this.getFirstClass();
    },
    methods: {
        //获取商品列表
        getAllGoodList:function () {
          document.getElementsByClassName('list-container')[0].scrollTop = 0;
          this.loading = true;
          axios.ProductGetGoodList(this.searchParams)
            .then(res => {
              //console.log(res);
              if (res.code === '0') {
                this.loading = false;
                this.goodsList = res.data;
                this.total = res.count;
              }
            })
            .catch(error => {
              console.log(error);
              this.goodTip = true;
              this.$refs.goodTip.innerHTML = '查询商品失败！';
            })
        },
        //获取商品一级分类
        getFirstClass:function () {
          axios.ProductFirstClass()
            .then(res => {
              //console.log(res);
              this.firstClassList = res;
            })
            .catch(error => {
              console.log(error);
            })
        },
      //获取二级分类
      getSecond:function (value) {
          axios.ProductSecondClass({parentId:value,flagId:-1})
            .then(res => {
              //console.log(res);
              this.secondClassList = res;
            })
            .catch(error => {console.log(error)})
      },
      showConfirm:function (e,num) {
        this.statusNo = num;
        this.statusId = e.currentTarget.dataset.id; //获取对应id
        this.confirmOperate = true;
      },
      hideConfirm:function () {
        this.statusId = '';
      },
      changConfirm:function (value) {
          if (!value) {
            this.statusId = '';
          }
      },
      //上架 下架商品
      changStatus:function () {
        axios.ProductChangeStatus({id:this.statusId,type:1,userId :this.userId})
          .then(res => {
            //console.log(res);
            this.confirmOperate = false;
            if (res.code === '0') {
              this.goodTip = true;
              this.$refs.goodTip.innerHTML = res.data;
              this.getAllGoodList();
            } else {
              this.goodTip = true;
              this.$refs.goodTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.confirmOperate = false;
            this.goodTip = true;
            this.$refs.goodTip.innerHTML = '操作失败！';
          })
      },
        // 切换展开和隐藏详细搜索
        openToggle(){
            this.isopen = !this.isopen;
            this.opens = this.isopen === true ? '隐藏' : '展开';
            if (!this.isopen) {
              this.resetSearch();
            }
        },
        // 切换主体商品呈现类别
        toggleCategory(index){
          sessionStorage.setItem('checkIndex',index);
          this.isopen = false;
          this.checkindex = parseInt(sessionStorage.getItem('checkIndex'));
          switch (index) {
            case 0:
              this.searchParams.status = null;
              break;
            case 1:
              this.searchParams.status = 0;
              break;
            case 2:
              this.searchParams.status = 1;
              break;
            case 3:
              this.searchParams.status = 3;
              break;
            case 4:
              this.searchParams.status = 2;
              break;
          }
          sessionStorage.setItem('searchStatus',this.searchParams.status);
          this.searchParams.pageNum = 1;
          this.searchParams.goodsName = '';
          this.searchParams.goodsNo = '';
          this.searchParams.lowPrice = null;
          this.searchParams.highPrice = null;
          this.searchParams.lowCountSale = null;
          this.searchParams.countSale = null;
          this.searchParams.firstClassLevel = '';
          this.searchParams.secondClassLevel = '';
          this.searchParams.searchCriteria = '';
          this.getAllGoodList();
        },
        // 综合搜索商品
        searchGoods(){
          this.searchParams.goodsName = '';
          this.searchParams.goodsNo = '';
          this.searchParams.lowPrice = null;
          this.searchParams.highPrice = null;
          this.searchParams.lowCountSale = null;
          this.searchParams.countSale = null;
          this.searchParams.firstClassLevel = '';
          this.searchParams.secondClassLevel = '';
          this.searchParams.pageNum = 1;
          this.getAllGoodList();
        },
        //详细搜索商品
        exactSearchGoods:function () {
          this.searchParams.searchCriteria = '';
          this.searchParams.pageNum = 1;
          this.getAllGoodList();
        },
      resetSearch:function () {
        this.searchParams.goodsName = '';
        this.searchParams.goodsNo = '';
        this.searchParams.lowPrice = null;
        this.searchParams.highPrice = null;
        this.searchParams.lowCountSale = null;
        this.searchParams.countSale = null;
        this.searchParams.firstClassLevel = '';
        this.searchParams.secondClassLevel = '';
      },
      goodPageChangeSize:function (size) {
        this.searchParams.limit = size;
        this.getAllGoodList();
      },
      goodPageChange:function (page) {
        this.searchParams.pageNum = page;
        this.getAllGoodList();
      },
      del:function () {
        this.goodTip = false;
      },
      openAddWindow:function () {
        const {href} = this.$router.resolve({
          name: "productAddNew",
          query: {}
        });
        window.open(href, '_blank');
      },
      openEditWindow:function (id) {
        const {href} = this.$router.resolve({
          name: "productEdit",
          query: {
            id:id
          }
        });
        window.open(href, '_blank');
      },
      openLookWindow:function (id) {
        const {href} = this.$router.resolve({
          name: "productLook",
          query: {
            id:id
          }
        });
        window.open(href, '_blank');
      },
      cancelStatusOk:function () {
        axios.ProductCancelUp({goodsId:this.cancelGoodsId,userId:this.userId})
          .then(res => {
            this.confirmCancel = false;
            if (res.code === '0') {
              this.goodTip = true;
              this.$refs.goodTip.innerHTML = '操作成功！';
              this.getAllGoodList();
            } else {
              this.goodTip = true;
              this.$refs.goodTip.innerHTML = res.message;
            }
          })
          .catch(error => {
            console.log(error);
            this.confirmCancel = false;
            this.goodTip = true;
            this.$refs.goodTip.innerHTML = '操作失败！';
          })
      },
      hideCancel:function () {
        this.cancelGoodsId = '';
      },
      changCancel:function (value) {
        if (!value){
          this.cancelGoodsId = '';
        }
      },
      showCancel:function (e) {
          this.cancelGoodsId = e.currentTarget.dataset.id;
        this.confirmCancel = true;
      }
    },
}
</script>

<style lang="less" scoped>
.productManage-container{
    width: 100%;
    // 商品搜索导航
    .nav-title{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      li{
        width: 80px;
        height: 40px;
        margin-right: 5px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #F2F3F7;
        border-bottom: 0;
        background:rgba(234,237,238,1);
        border-radius:2px 8px 0 0;
        &:hover{
          cursor: pointer;
        }
      }
      .active{
        background-color: #2DB7F5;
        color: #ffffff;
      }
    }
    .content{
        width: 100%;
        background-color: #fff;
        border-top: 1px solid #F2F3F7;
        color: #666;
        padding-bottom: 10px;
        .content-search{
            width: 100%;
            height: 80px;
            padding: 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .search-text{
              width: 800px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              height: 40px;
              line-height: 40px;
              span{
                display: inline-block;
                margin-left: 35px;
                &:hover{
                  cursor: pointer;
                }
              }
            }
        }

        // 详细搜索
        .search-exact{
            width: 100%;
            padding: 0 0 20px 20px;
            color: #000;
            font-size: 12px;
            .exact-container{
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              flex-wrap: wrap;
              width: 820px;
              .exact-detail{

              }
              .long-width{
                width: 350px;
              }
              .small-width{
                width: 200px;
              }
            }
            .price{
                width: 100px;
            }
            .price-f{
                margin-right: 0;
            }
            .product-category{
                margin-top: 10px;
                margin-bottom: 8px;
            }
        }
    }
}
.list-row::-webkit-scrollbar{
  width: 5px;
  height: 5px;
}
.list-row::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #A2DCF8;
}
.list-row::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 10px;
  background: #EDEDED;
}
.list-most{
  background-color: #ffffff;
  padding: 20px;
}
.list-tit{
  height: 50px;
  line-height: 50px;
  background:rgba(228,234,236,1);
  border-radius:4px 4px 0 0;
  font-weight: bold;
}
  .list-container{
    font-size: 12px;
    border-bottom: 1px solid #EBEEF1;
    .list-row{
      height: 500px;
      overflow-y: scroll;
      label{
        margin-bottom: 0!important;
      }
      .list-detail{
        border: 1px solid #EBEEF1;
        border-top: none;
        padding: 10px 0;
        font-weight: normal;
        .single-height{
          height: 70px;
          line-height: 70px;
        }
        .list-name{
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          img{
            width: 70px;
            height: 70px;
            border-radius: 5px;
          }
          p{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 70px;
            width: 100%;
            padding-right: 5px;
            span{
              height: 35px;
            }
            span:first-child{
              display: inline-block;
              width: 100%;
              line-height: 15px;
              color: #3E97F1;
            }
            span:last-child{
              line-height: 50px;
            }
          }
        }
        .list-price{
          p{
            height: 35px;
            line-height: 35px;
          }
        }
        .list-check,.list-status{
          p{
            height: 35px;
            line-height: 35px;
          };
        }
        .list-operate{
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          height: 70px;
          line-height: 70px;
          padding-left: 50px;
        }
      }
    }
  }
.list-detail:hover{
  background-color: #F5F7F9;
}
  .user-click{
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    user-select:none;
  }
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
.demo-spin-col{
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
<style>
  .ivu-input-search{
    background-color: #57c5f7!important;
    border-color: #57c5f7!important;
  }
</style>
