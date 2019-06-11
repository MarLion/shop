<template>
  <div class="order-detail-container">
    <div class="detail-tit fs14">
      <p>订单管理</p>
      <p class="ml15">></p>
      <p class="ml15">订单详情</p>
      <p class="ml15">></p>
      <p class="ml15">订单状态</p>
      <p class="ml15">></p>
      <p v-if="orderStatus == 1" class="ml15">待发货</p>
      <p v-else-if="orderStatus == 2" class="ml30">待签收<span>（{{detail.surplusDate}}后系统将自动确认收货）</span></p>
      <p v-else-if="orderStatus == 3" class="ml30">已完成</p>
      <p v-else-if="orderStatus == 4" class="ml30">待审批</p>
      <p v-else-if="orderStatus == 8" class="ml30">已退款</p>
      <p v-else-if="orderStatus == 6" class="ml30">待退款</p>
      <p v-else="orderStatus == 5" class="ml30">已取消</p>
    </div>
    <div class="detail-message fs14 mt20">
      <ul class="nav-title">
        <li v-for="(item,index) in messageTitle" :key="'title' + index" :class="{active: checkindex === index}" @click="checkindex=index">{{item.name}}</li>
      </ul>
      <template v-if="checkindex === 0">
        <div class="detail-buyer-message">
          <p>归&nbsp;属&nbsp;门&nbsp;店：{{detail.shopInfoName}}</p>
          <p class="mt20 detail-span">
            <span>客&nbsp;户&nbsp;昵&nbsp;称：{{detail.userName}}</span>
            <span>联系电话：{{detail.userMobile}}</span>
            <span>玄乐账号：{{detail.userLoginName}}</span>
          </p>
          <p class="mt20 detail-span">
            <span>特&nbsp;&nbsp;&nbsp;约&nbsp;&nbsp;&nbsp;人：{{detail.referrerName}}</span>
            <span>联系电话：{{detail.referrerMobile}}</span>
            <span>玄乐账号：{{detail.referrerLoginName}}</span>
          </p>
          <p class="mt20 detail-span">
            <span>收货人姓名：{{detail.addressRealName}}</span>
            <span>收货电话：{{detail.phone}}</span>
          </p>
          <p class="mt20">收&nbsp;货&nbsp;地&nbsp;址：{{detail.address}}</p>
        </div>
      </template>
     <template v-else-if="checkindex === 1">
       <div class="detail-deliver-message color-3" v-if="orderStatus == 1 || orderStatus == 5">等待卖家发货</div>
       <div class="detail-deliver-message fs14" v-else>
         <p><span class="color-3">配送方式：</span><span class="color-6">{{expressData.sendStyle}}</span><Button type="error" ghost class="ml100" @click="showSendModal(detail.id,1)" v-if="expressData.sendStyle != '送货上门' &&  orderStatus == 2">修改物流信息</Button></p>
         <p class="mt30"><span class="color-3">快递公司：</span><span class="color-6">{{expressData.sendStyle == '送货上门' ? '无' : expressData.company}}</span></p>
         <p class="mt30"><span class="color-3">快递单号：</span><span class="color-6">{{expressData.sendStyle == '送货上门' ? '无' : expressData.trackingNum}}</span></p>
         <div :class="[orderStatus == 3 ? 'detailDeliverMessageListSuccess' : 'detailDeliverMessageList']" style="margin-top: 40px">
           <p v-for="(item,index) in expressData.expressList" :key="'express'+ index"><span class="list-icon"></span><span>{{item.dateTime}}</span><span class="ml30">{{item.remark}}</span></p>
         </div>
       </div>
     </template>
      <template v-else-if="checkindex === 2">
        <div class="tranceCommon">
          <div :class="[orderStatus == 3 ? 'detailTranceSuccess' : 'detailTrance','trance-list-com']">
            <div v-for="(item,index) in tranceList" :key="'trance' + index" class="mt50 trance-for">
              <span class="trance-icon"></span>
              <p class="trance-time">
                <span>{{item.time}}</span>
                <span>{{item.date}}</span>
              </p>
              <p class="trance-detail">{{item.content}}</p>
            </div>
            <div class="trance-line"></div>
          </div>
        </div>
      </template>
    </div>
    <div class="order-list-container mt30 pos-re">
      <Spin fix v-if="loading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>加载中...</div>
      </Spin>
      <div class="list-title fs14 fw">
        <Row>
          <Col span="8"><div class="text-center">商品</div></Col>
          <Col span="2"><div class="text-center">售价</div></Col>
          <Col span="2"><div class="text-center">数量</div></Col>
          <Col span="4"><div class="text-center">收货地址</div></Col>
          <Col span="2"><div class="text-center">实际支付</div></Col>
          <Col span="2"><div class="text-center">商家货款</div></Col>
          <Col span="2"><div class="text-center">管理费</div></Col>
          <Col span="2"><div class="text-center">操作</div></Col>
        </Row>
      </div>
      <div class="list-detail mt10">
        <div class="list-order-tit">
          <div>
            <span class="ml15" style="color: #999999;">{{$tool.TransChinaTime(detail.createTime)}}</span>
            <span  class="ml15" >订单编号：{{detail.orderNo}}</span>
            <span v-if="detail.sendShop === 0" class="ml15">（配送到门店）</span>
            <!--<span class="ml15" style="color: #999999;">{{detail.shopInfoName}}</span>-->
            <!--<span class="ml15" style="color: #999999;">特约人：{{detail.referrerName}}（{{detail.referrerMobile}}）</span>-->
          </div>
          <div>
            <span style="margin-right: 20px;">紧急联系人：{{detail.shopManager}}（{{detail.shopManagerMobile}}）</span>
            <span v-if="detail.orderStatus === 1" class="color-error">待发货</span>
            <span v-else-if="detail.orderStatus === 2">待签收</span>
            <span v-else-if="detail.orderStatus === 3">已完成</span>
            <span v-else-if="detail.orderStatus === 4" class="color-error">待审批</span>
            <span v-else-if="detail.orderStatus === 8">已退款</span>
            <span v-else-if="detail.orderStatus === 6" class="color-error">待退款</span>
            <span v-else>已取消</span>
          </div>
        </div>
        <div class="list-order-message">
          <Row>
            <Col span="8">
              <div class="flex-col h">
                <div class="goods-name h-common" v-for="(it,ind) in detail.orderGoodsList" :key="'name' + ind">
                  <img :src="it.goodsImg"/>
                  <div class="ml15">
                    <p>{{it.goodsName}}</p>
                    <p>编码：{{it.goodsNo}}</p>
                    <p>规格：{{it.goodsSpecificationName}}</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col span="2">
              <div class="flex-col h">
                <div class="text-center goods-price h-common" v-for="(it,ind) in detail.orderGoodsList" :key="'price' + ind">
                  <p>{{it.integralPrice}}玄乐&nbsp;&nbsp;+</p>
                  <p style="margin-top: 5px;">{{it.maxDeductionIntegral}}积分</p>
                  <p style="margin-top: 5px;">（管理费：{{it.goodsServiceRate}}%）</p>
                </div>
              </div>
            </Col>
            <Col span="2">
              <div class="flex-col h">
                <div class="text-center goods-count h-common" v-for="(it,ind) in detail.orderGoodsList" :key="'num' + ind">
                  <p style="margin-top: 3px">{{it.goodsNum}}</p>
                </div>
              </div>
            </Col>
            <Col span="4">
              <div class="goods-address text-center h h-flex" :style="{height:length * 90 + 'px'}">
                <p><span>{{detail.realName}}</span><span class="ml10">{{detail.phone}}</span></p>
                <p style="margin-top: 5px;">{{detail.address}}</p>
              </div>
            </Col>
            <Col span="2">
              <div class="goods-money text-center h h-flex" :style="{height:length * 90 + 'px'}">
                <p>{{detail.totalMoney}}玄乐&nbsp;&nbsp;+</p>
                <p style="margin-top: 5px">{{detail.totalIntegral}}积分</p>
              </div>
            </Col>
            <Col span="2">
              <div class="text-center h h-flex" :style="{height:length * 90 + 'px'}">{{detail.shopMoney}}玄乐</div>
            </Col>
            <Col span="2">
              <div class="text-center h h-flex" :style="{height:length * 90 + 'px'}">{{detail.serviceFee}}玄乐</div>
            </Col>
            <Col span="2">
              <div class="goods-operate text-center h-flex" :style="{height:length * 90 + 'px'}">
                <p>
                  <Button type="error" size="small" v-if="detail.orderStatus === 1" @click="showSendModal(detail.id,0)">立即发货</Button>
                  <Button type="error" size="small" v-else-if="detail.orderStatus === 4" @click="showReturnModal(detail.id)">同意退货</Button>
                  <Button type="error" size="small" v-else-if="detail.orderStatus === 6" @click="showDrawbackModal(detail.id)">立即退款</Button>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <!--提示弹框-->
    <Modal
      title="提示"
      v-model="orderTip"
      :mask-closable = "false"
    >
      <p ref="orderTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <!--退货-->
    <Modal
      title="同意退货"
      v-model="returnGoods"
      :loading="returnLoading"
      :mask-closable = "false"
      @on-ok="returnGoodOk"
    >
      <div>请确认是否同意退货！</div>
    </Modal>
    <!--退款-->
    <Modal
      title="确认退款"
      v-model="drawBack"
      :loading="drawbackLoading"
      :mask-closable = "false"
      @on-ok="drawbackOk"
    >
      <div>请确认是否退款，确认退款后商品货款将返还给用户！</div>
    </Modal>
    <!--立即发货-->
    <Modal
      :title="sendTitle"
      v-model="sendGoods"
      :loading="sendLoading"
      :mask-closable = "false"
      @on-ok="sendGoodsOk"
      @on-visible-change="sendGoodsVis"
    >
      <Form :model="sendData" ref="sendData" :rules="sendRule" :label-width="100">
        <FormItem label="配送方式：" prop="sendType">
          <Select v-model="sendData.sendType">
            <Option v-for="(item,index) in sendMethod" :key="'method' + index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <template v-if="sendData.sendType === 2">
          <FormItem label="物流公司：" prop="expressId">
            <Select v-model="sendData.expressId">
              <Option v-for="(item,index) in sendCompany" :key="'com' + index" :value="item.id">{{item.com}}</Option>
            </Select>
          </FormItem>
          <FormItem label="物流单号：" prop="expressNo">
            <Input v-model="sendData.expressNo"/>
          </FormItem>
        </template>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "orderDetail",
    data () {
      return {
        checkindex:0,
        loading:false,
        orderId:'',
        orderStatus:'',
        detail:{},
        length:0,
        orderTip:false,
        //同意退货
        returnGoods:false,
        returnLoading:true,
        returnId:'',
        //确认退款
        drawBack:false,
        drawbackLoading:true,
        drawId:'',
        //立即发货
        sendTitle:'',
        sendGoods:false,
        sendLoading:true,
        sendId:'',
        sendMethod:[
          {
            value:1,
            label:'送货上门'
          },
          {
            value:2,
            label:'快递发送'
          }
        ],
        sendCompany:[],
        sendData:{
          orderId:'',
          expressId:'',
          expressNo:'',
          sendType:'',
          isSend:''
        },
        sendRule:{
          sendType:[
            {required:true,message:'请选择配送方式'}
          ],
          expressId:[
            {required:true,message:'请选择物流公司'}
          ],
          expressNo:[
            {required:true,message:'请填写物流单号'}
          ],
        },
        expressData:{},
        messageTitle:[
          {
            name:'订单详情',
            value:0
          },
          {
            name:'物流信息',
            value:1
          },
          {
            name:'订单追踪',
            value:2
          }
        ],
        tranceList:[],
      }
    },
    mounted () {
      this.orderId = this.$route.query.id;
      this.getOrderDetail();
      this.getExpressMessage();
      this.getExpressCompany();
    },
    methods:{
      //订单追踪
      getTranceMessage:function () {
        axios.OrderContract({orderId:this.orderId})
          .then(res => {
            if (res.code === '0') {
              res.data.forEach(item => {
                let date = item.createTime.split(' ')[0];
                let  time = item.createTime.split(' ')[1];
                this.tranceList.push({
                  date:date,
                  time:time,
                  content:item.detail
                })
              })
              console.log(this.tranceList);
            }
          })
          .catch(error => {console.log(error)})
      },
      //获取订单详情
      getOrderDetail:function () {
        this.loading = true;
        axios.OrderDetail({id:this.orderId})
          .then(res => {
            if (res.code === '0') {
              this.loading = false;
              this.orderStatus = res.data.orderStatus;
              this.getTranceMessage();
              this.detail = res.data;
              this.length = res.data.orderGoodsList.length;
            }
          })
          .catch(error => {console.log(error)})
      },
      showReturnModal:function (id) {
        this.returnGoods = true;
        this.returnId = id;
      },
      returnGoodOk:function () {
        axios.OrderReturnGoods({orderId:this.returnId})
          .then(res => {
            this.returnGoods = false;
            this.returnId = '';
            this.orderTip = true;
            if (res.code === '0') {
              this.$refs.orderTip.innerHTML = '退货成功！';
              this.getOrderDetail();
              this.getExpressMessage();
            } else {
              this.$refs.orderTip.innerHTML = res.message;
            }
          })
          .catch(error => {console.log(error)})
      },
      showDrawbackModal:function (id) {
        this.drawBack = true;
        this.drawId = id;
      },
      drawbackOk:function () {
        axios.OrderDrawBack({orderId:this.drawId})
          .then(res => {
            this.drawBack = false;
            this.drawId = '';
            this.orderTip = true;
            if (res.code === '0') {
              this.$refs.orderTip.innerHTML = '退款成功！';
              this.getOrderDetail();
              this.getExpressMessage();
            } else {
              this.$refs.orderTip.innerHTML = res.message;
            }
          })
          .catch(error => {console.log(error);})
      },
      showSendModal:function (id,isSend) {
        this.sendGoods = true;
        this.sendId = id;
        this.sendData.isSend = isSend;
        isSend == 1 ? this.sendTitle = '修改物流' : this.sendTitle = '立即发货';
      },
      sendGoodsOk:function () {
        this.$refs.sendData.validate(valid => {
          if (valid) {
            this.sendData.orderId = this.sendId;
            axios.OrderSendGoods(this.sendData)
              .then(res => {
                if (res.code === '0') {
                  this.sendGoods = false;
                  this.$refs.sendData.resetFields();
                  this.sendData.orderId = '';
                  this.sendId = '';
                  this.orderTip = true;
                  this.$refs.orderTip.innerHTML = '操作成功！';
                  this.getOrderDetail();
                  this.getExpressMessage();
                } else {
                  this.$Message.error({content:'操作失败！',duration:4});
                  this.changSendLoading();
                }
              })
              .catch(error => {console.log(error)})
          } else {
            this.changSendLoading();
          }
        })
      },
      sendGoodsVis:function (value) {
        if (!value) {
          this.$refs.sendData.resetFields();
          this.sendData.orderId = '';
        }
      },
      changSendLoading:function () {
        this.sendLoading = false;
        this.$nextTick(() => {
          this.sendLoading = true;
        });
      },
      //获取快递公司
      getExpressCompany:function () {
        axios.OrderExpressList()
          .then(res => {
            if (res.code === '0') {
              this.sendCompany = res.data;
            }
          })
          .catch(error => {console.log(error)})
      },
      del:function () {
        this.orderTip = false;
      },
      //获取物流信息
      getExpressMessage:function () {
        axios.OrderExpressMessage({orderId:this.orderId})
          .then(res => {
            if (res.code === '0') {
              this.expressData = res.data;
            }
          })
          .catch(error => {console.log(error)})
      },
    }
  }
</script>

<style lang="less" scoped>
.order-detail-container{
  .detail-tit{
    padding: 10px 0 10px 20px;
    background-color: #ffffff;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color:rgba(144,144,144,1);
    font-weight: 400;
    p{
      height: 30px;
      line-height: 30px;
      &:last-child{
        color: #3E97F1;
      }
    }
    .line{
      height: 30px;
      width: 2px;
      background-color: #2D8CF0;
    }
  }
  .detail-message{
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
    .detail-buyer-message{
      color: #333333;
      padding: 30px;
      background-color: #ffffff;
      .detail-span{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        span{
          width: 20%;
          margin-left: 20px;
          &:first-child{
            margin-left: 0;
          }
        }
      }
    }
    .detail-deliver-message{
      padding: 30px;
      background-color: #ffffff;
      min-height: 210px;
      .detailDeliverMessageList{
        border-left: 1px solid rgba(204,204,204,1);
        margin-left: 6px;
        p{
          padding-left: 20px;
          height: 12px;
          line-height: 12px;
          margin-top: 44px;
          position: relative;
          .list-icon{
            display: block;
            position: absolute;
            width: 12px;
            height: 12px;
            top: 0;
            left: -6px;
            background: url("../../assets/icon/point.png") 0 center no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .detailDeliverMessageListSuccess{
        border-left: 1px solid rgba(204,204,204,1);
        margin-left: 6px;
        p{
          padding-left: 20px;
          height: 12px;
          line-height: 12px;
          margin-top: 44px;
          position: relative;
          .list-icon{
            display: block;
            position: absolute;
            width: 12px;
            height: 12px;
            top: 0;
            left: -6px;
            background: url("../../assets/icon/point.png") 0 center no-repeat;
            background-size: 100% 100%;
          }
        }
        p:last-child{
          color: rgba(255,91,34,1);
        }
        p:last-child .list-icon{
          display: block;
          position: absolute;
          width: 22px;
          height: 22px;
          left: -11px;
          top: -6px;
          background: url("../../assets/icon/ico_hook.png") 0 center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .tranceCommon{
      background-color: #ffffff;
      min-height: 210px;
      padding: 30px;
      .trance-list-com{
        /*border-left: 1px solid rgba(204,204,204,1);*/
        position: relative;
        .trance-line{
          width: 1px;
          height: calc(100% - 41px);
          background-color: rgba(204,204,204,1);
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .trance-list-com .trance-for{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding-left: 24px;
        margin-top: 50px;
        .trance-time{
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 80px;
          text-align: center;
          span:first-child{
            color:rgba(51,51,51,1);
            font-size: 14px;
            height: 15px;
            line-height: 15px;
          }
          span:last-child{
            color:rgba(144,144,144,1);
            font-size: 14px;
            margin-top: 13px;
            height: 13px;
            line-height: 13px;
          }
        }
        .trance-detail{
          margin-left: 40px;
          color:rgba(34,34,34,1);
          font-size: 14px;
          height: 40px;
          line-height: 40px;
        }
        &:first-child{
          margin-top: 0;
        }
      }

    }
    .detailTrance{
      .trance-for{
        position: relative;
        .trance-icon{
          position: absolute;
          display: block;
          background: url("../../assets/icon/point.png") 0 center no-repeat;
          width: 12px;
          height: 12px;
          background-size: 100% 100%;
          top: 0;
          left: -6px;
        }
      }
      .trance-for:first-child{
        margin-top: 5px!important;
      }
    }
    .detailTranceSuccess{
      position: relative;
      .trance-for{
        position: relative;
        .trance-icon{
          position: absolute;
          display: block;
          background: url("../../assets/icon/point.png") 0 center no-repeat;
          width: 12px;
          height: 12px;
          background-size: 100% 100%;
          top: 0;
          left: -6px;
        }
      }
      .trance-for:first-child{
        margin-top: 5px!important;
      }
      .trance-for:last-child .trance-icon{
        position: absolute;
        display: block;
        background: url("../../assets/icon/ico_hook.png") 0 center no-repeat;
        width: 22px;
        height: 22px;
        background-size: 100% 100%;
        top: 0;
        left: -11px;
      }
    }
  }
  .detail-order{
    .detail-order-message{
      padding: 20px;
      background-color: #ffffff;
      .list-title{
        background-color: #D7DADE;
        height: 40px;
        line-height: 40px;
      }
      .list-detail{
        .list-order-tit{
          padding: 0 10px;
          height: 40px;
          line-height: 40px;
          background-color: #D7DADE;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        .list-order-message{
          background-color: #F5F7F9;
          padding: 10px;
          .goods-name{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            img{
              width: 70px;
              height: 70px;
              border-radius: 5px;
            }
            p{
              padding: 2px;
              &:first-child{
                color: #3E97F1;
              }
            }
          }
          .goods-price{

          }
        }
      }
    }
  }
}
.order-list-container{
  background-color: #ffffff;
  padding: 20px;
  .list-title{
    background-color: rgba(238,244,246,1);
    height: 50px;
    line-height: 50px;
    border:1px solid rgba(224,229,231,1);
    border-radius:4px 4px 0 0;
  }
  .list-detail{
    border-radius: 4px;
    border:1px solid rgba(224,229,231,1);
    .list-order-tit{
      padding: 0 10px;
      height: 50px;
      line-height: 50px;
      background-color: rgba(238,244,246,1);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom:1px solid rgba(224,229,231,1);
    }
    .list-order-message{
      background-color: #ffffff;
      padding: 10px;
      .goods-name{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 10px 0;
        img{
          width: 70px;
          height: 70px;
          border-radius: 5px;
        }
        p{
          padding: 2px;
          &:first-child{
            color: #3E97F1;
          }
        }
      }
      .goods-price{
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .goods-count{
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .h{
        border-right: 1px solid #D7DADE;
      }
      .h-common{
        height: 90px;
      }
      .h-flex{
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
}
.demo-auto-complete-item{
  cursor: pointer;
  padding: 4px 6px;
  border-bottom: 1px solid #F6F6F6;
}
.demo-auto-complete-item:hover{
  background-color: #F7F1F1;
}
.flex-col{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
