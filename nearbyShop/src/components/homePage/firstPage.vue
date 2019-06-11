<template>
  <div class="firstPage-container">
    <div class="amount-container">
      <div class="static-container">
        <div class=" content-container">
          <p class="tit-p fs16 fw"><span><img src="../../assets/icon/saleT.png"/></span><span class="ml10" style="color:rgba(79,85,110,1);">销售统计（玄乐）</span></p>
          <div class="detail-content">
            <p>
              <span class="fs14" style="color:rgba(124,137,160,1);">销售总额</span>
              <span class="col-num mt10 fs16 fw" style="color:rgba(65,122,252,1);">{{salesTotal}}</span>
            </p>
            <p class="line"></p>
            <p>
              <span class="fs14" style="color:rgba(124,137,160,1);">今日销量</span>
              <span class="col-num mt10 fs16 fw" style="color:rgba(65,122,252,1);">{{todaySalesTotal}}</span>
            </p>
            <p class="line"></p>
            <p>
              <span class="fs14" style="color:rgba(124,137,160,1);">我的玄乐</span>
              <span class="col-num mt10 fs16 fw" style="color:rgba(65,122,252,1);">{{myXuanle}}</span>
            </p>
          </div>
        </div>
        <div class="content-container">
          <p class="tit-p fs16 fw"><span><img src="../../assets/icon/orderT.png"/></span><span class="ml10" style="color:rgba(79,85,110,1);">订单统计（笔）</span></p>
          <div class="detail-content">
            <p>
              <span class="fs14" style="color:rgba(124,137,160,1);">今日订单</span>
              <span class="col-num mt10 fs16 fw" style="color:rgba(65,122,252,1);">{{todayOrderNum}}</span>
            </p>
            <p class="line"></p>
            <p>
              <span class="fs14" style="color:rgba(124,137,160,1);">待发货</span>
              <span class="col-num mt10 fs16 fw" style="color:rgba(65,122,252,1);">{{waitShip}}</span>
            </p>
            <p class="line"></p>
            <p>
              <span class="fs14" style="color:rgba(124,137,160,1);">待审批</span>
              <span class="col-num mt10 fs16 fw" style="color:rgba(65,122,252,1);">{{waitApproval}}</span>
            </p>
            <p class="line"></p>
            <p>
              <span class="fs14" style="color:rgba(124,137,160,1);">待退款</span>
              <span class="col-num mt10 fs16 fw" style="color:rgba(65,122,252,1);">{{waitRefund}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="rank-container">
        <p class="tit-p fs16 fw"><span><img src="../../assets/icon/saleRank.png"/></span><span class="ml10" style="color:rgba(79,85,110,1);">销量排行</span></p>
        <Table :columns="columns" :data="rankData" class="mt10" height="190"></Table>
        <div class="text-center mt10">
          <Page :total="total"  show-total show-elevator @on-change="rankPageChange"/>
        </div>
      </div>
    </div>
    <div class="charts-container mt20 fs16">
      <div class="sales-container" >
        <div class="tit-p">
          <p class="tit-p-p"><span><img src="../../assets/icon/saleMoney.png"/></span><span class="ml10">销售金额趋势图</span></p>
          <Select v-model="saleType" @on-change="getSalesMount" style="width: 100px;margin-right: 10px">
            <Option v-for="(item,index) in typeList" :key="item.value" :value="item.value">
              {{item.label}}
            </Option>
          </Select>
        </div>
        <div ref="saleChart" class="sale-chart mt20"></div>
      </div>
      <div class="order-container">
        <div class="tit-p">
          <p class="tit-p-p"><span><img src="../../assets/icon/saleOrder.png"/></span><span class="ml10">销售订单趋势图</span></p>
          <Select v-model="orderType" @on-change="getOrderAmount" style="width: 100px;margin-right: 10px">
            <Option v-for="(item,index) in typeList" :key="item.value" :value="item.value">
              {{item.label}}
            </Option>
          </Select>
        </div>
        <div ref="orderChart" class="order-chart mt20"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  let echarts = require('echarts');
  export default {
    name: "firstPage",
    data(){
      return {
        total:0,
        page:1,
        shopId:'', //登录信息里面获取
        loginName:'', //登录信息里面获取
        salesTotal:'',
        todaySalesTotal:'',
        myXuanle:'',
        todayOrderNum:'',
        waitShip:'',
        waitApproval:'',
        waitRefund:'',
        rankData:[],
        columns:[
          {
            title:'排名',
            type: 'index',
            width: 80,
            align: 'center'
          },
          {
            title:'商品编码',
            key:'goodsNo',
            align:'center'
          },
          {
            title:'商品名称',
            key:'goodsName',
            align:'center',
            tooltip:true
          },
          {
            title:'销量',
            key:'goodsNum',
            align:'center'
          },
        ],
        typeList:[
          {
            value:'day',
            label:'按日统计'
          },
          {
            value:'week',
            label:'按周统计'
          },
          {
            value:'month',
            label:'按月统计'
          }
        ],
        saleType:'day',
        orderType:'day'
       }
    },
    mounted () {
      this.shopId = sessionStorage.getItem('shopId');
      this.loginName = sessionStorage.getItem('loginName');
      this.getSaleStatic();
      this.getOrderStatic();
      this.getSaleRank();
      this.getSalesMount();
      this.getOrderAmount();
    },
    methods:{
      //获取销售统计
      getSaleStatic:function () {
        axios.HomeSaleStatic({shopId:this.shopId,loginName:this.loginName})
          .then(res => {
            //console.log(res);
            if (res.code === '0') {
              if (String(res.data.salesTotal).indexOf('.') > 0) {
                this.salesTotal = res.data.salesTotal;
              } else {
                this.salesTotal = res.data.salesTotal + '.00';
              }
              if (String(res.data.todaySalesTotal).indexOf('.') > 0) {
                this.todaySalesTotal = res.data.todaySalesTotal;
              } else {
                this.todaySalesTotal = res.data.todaySalesTotal + '.00';
              }
              if (String(res.data.myXuanle).indexOf('.') > 0) {
                this.myXuanle = res.data.myXuanle;
              } else {
                this.myXuanle = res.data.myXuanle+'.00';
              }
            } else {
              this.salesTotal = '暂无数据';
              this.todaySalesTotal = '暂无数据';
              this.myXuanle = '暂无数据';
            }
          })
          .catch(error => {console.log(error)})
      },
      //获取订单统计
      getOrderStatic:function () {
        axios.HomeOrderStatic({shopId:this.shopId})
          .then(res => {
            if (res.code === '0') {
              this.todayOrderNum = res.data.todayOrderNum;
              this.waitShip = res.data.waitShip;
              this.waitApproval = res.data.waitApproval;
              this.waitRefund = res.data.waitRefund;
            } else {
              this.todayOrderNum = '暂无数据';
              this.waitShip = '暂无数据';
              this.waitApproval = '暂无数据';
              this.waitRefund = '暂无数据';
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      //获取销量排行
      getSaleRank:function () {
        axios.HomeSaleRank({shopId:this.shopId,page:this.page,rows:10})
          .then(res => {
            if (res.code === '0') {
              this.total = res.count;
              this.rankData = res.data;
            } else {

            }
          })
          .catch(error => {console.log(error)})
      },
      rankPageChange:function(page){
        this.page = page;
        this.getSaleRank();
      },
      //获取金额趋势
      getSalesMount:function () {
        axios.HomeSaleAmount({shopId:this.shopId,type:this.saleType})
          .then(res => {
            if (res.code === '0') {
              let timeArr = [];
              let dataArr = [];
              res.data.salesAmountTrendList.forEach(item => {
                timeArr.push(item.reTime);
                dataArr.push(item.salesTotal);
              });
              this.saleAmountChart(timeArr,dataArr);
            } else {

            }
          })
          .catch(error => {console.log(error)})
      },
      //获取订单趋势
      getOrderAmount:function () {
        axios.HomeOrderAmount({shopId:this.shopId,type:this.orderType})
          .then(res => {
            let _time = [];
            let _data = [];
            res.data.salesOrderTrendList.forEach(item => {
              _time.push(item.reTime);
              _data.push(item.salesOrder);
            });
            this.orderChart(_time,_data);
          })
          .catch(error => {console.log(error)})
      },
      //金额趋势图
      saleAmountChart:function (arr1,arr2) {
        let myChart_1 = echarts.init(this.$refs.saleChart);
        myChart_1.setOption({
          tooltip: {
            show:true
          },
          legend:{
            data:['销售额']
          },
          xAxis: {
            type: 'category',
            boundaryGap : true,
            data: arr1,
            //name:'月份'
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name:'销售额',
              data: arr2,
              type: 'bar',
              barWidth:30,
              itemStyle:{
                color:'#417AFC'
              },
              label:{
                show:true,
                position:'top'
              }
            }
          ]
        });
      },
      //订单趋势图
      orderChart:function (arr1,arr2) {
        let myChart_2 = echarts.init(this.$refs.orderChart);
        myChart_2.setOption({
          tooltip: {
            show:true
          },
          legend:{
            data:['订单量']
          },
          xAxis: {
            type: 'category',
            boundaryGap : true,
            data: arr1,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name:'订单量',
              data: arr2,
              type: 'bar',
              barWidth:30,
              itemStyle:{
                color:'#417AFC'
              },
              label:{
                show:true,
                position:'top'
              }
            }
          ]
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .firstPage-container{
    .amount-container{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .static-container{
        width: 49%;
        height: 320px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .content-container{
          height: 150px;
          background-color: #ffffff;
          border-radius: 5px;
          .tit-p{
            padding: 10px 0 ;
            border-bottom: 1px solid rgba(214,214,214,1);
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            margin: 0 28px;
            span:last-child{
              height: 42px;
              line-height: 42px;
            }
          }
          .detail-content{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            padding: 20px;
            p{
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              span{
                display: inline-block;
                width: 150px;
                text-align: center;
              }
              .col-num{color: #FA6130}
            }
            .line{
              width: 2px;
              height: 30px;
              margin-top: 10px;
              background-color: #2D8CF0;
            }
          }
        }
      }
      .rank-container{
        width: 49%;
        background-color: #ffffff;
        padding: 5px;
        height: 320px;
        border-radius: 5px;
        .tit-p{
          padding: 10px 0 10px 10px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          span:last-child{
            height: 42px;
            line-height: 42px;
          }
        }
      }
    }
    .charts-container{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-radius: 5px;
      .sales-container{
        width: 49%;
        background-color: #ffffff;
        height: 500px;
        .tit-p{
          padding: 10px 0;
          margin: 0 28px;
          border-bottom: 1px solid rgba(214,214,214,1);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .tit-p-p{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            span:last-child{
              height: 42px;
              line-height: 42px;
            }
          }
        }
        .sale-chart{
          width: 100%;
          height: 400px;
        }
      }
      .order-container{
        width: 49%;
        background-color: #ffffff;
        height: 500px;
        border-radius: 5px;
        .tit-p{
          padding: 10px 0;
          margin: 0 28px;
          border-bottom: 1px solid rgba(214,214,214,1);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .tit-p-p{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            span:last-child{
              height: 42px;
              line-height: 42px;
            }
          }
        }
        .order-chart{
          width: 100%;
          height: 400px;
        }
      }
    }
  }
</style>
