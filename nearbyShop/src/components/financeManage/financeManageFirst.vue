<template>
  <div class="financeManageFirst-container">
    <div class="static-container">
      <div class="container-size">
        <p class="fs16" style="color:rgba(102,102,102,1);">总销售额</p>
        <p class="fs24 fw" style="color: rgba(65,122,252,1);">{{staticData.totalMoney}}</p>
        <p class="fs14">
          <span>
            <span class="fs16">周环比</span>
            <span class="color-success" v-if="staticData.weekRatio > 0"><Icon type="md-arrow-round-up" /></span>
            <span class="color-error" v-if="staticData.weekRatio < 0"><Icon type="md-arrow-round-down" /></span>
            <span class="fs18 fw">{{staticData.weekRatio}}％</span>
          </span>
          <span class="ml15">
            <span class="fs16">日环比</span>
            <span class="color-success" v-if="staticData.dayRatio > 0"><Icon type="md-arrow-round-up" /></span>
            <span class="color-error" v-if="staticData.dayRatio < 0"><Icon type="md-arrow-round-down" /></span>
            <span class="fs18 fw">{{staticData.dayRatio}}％</span>
          </span>
        </p>
        <p class="line"></p>
        <p class="fs14 fw">当日销售额&nbsp;&nbsp;&nbsp;&nbsp;￥{{staticData.todayMoney}}</p>
      </div>
      <div class="container-size ml30">
        <p class="fs16" style="color:rgba(102,102,102,1);;">待收款项</p>
        <p class="fs24 fw" style="color: rgba(65,122,252,1);">{{staticData.shopShippingMoney}}</p>
        <p>
          <span class="fs16">订单数</span><span class="ml30 fs18 fw">{{staticData.shopShippingCount}}</span>
        </p>
        <p class="line"></p>
        <p class="fs14 fw">截止目前有{{staticData.shopShippingCount}}个未签收订单</p>
      </div>
      <div class="container-size ml30">
        <p class="fs16" style="color:rgba(102,102,102,1);">我的玄乐</p>
        <p class="fs24 fw" style="color: rgba(65,122,252,1);">{{staticData.totalXlb}}</p>
        <p></p>
        <p class="line mt10"></p>
        <p class="fs14 fw">玄乐余额</p>
      </div>
      <div class="container-size ml30">
        <p class="fs16" style="color:rgba(102,102,102,1);">我的积分</p>
        <p class="fs24 fw" style="color: rgba(65,122,252,1);">{{staticData.totalIntegral}}</p>
        <p></p>
        <p class="line mt10"></p>
        <p class="fs14 fw">积分余额</p>
      </div>
    </div>
    <div class="finance-table mt20">
      <div class="finance-condition-container">
        <div>
          <span>选择日期：</span>
          <DatePicker type="datetime" style="width: 200px" v-model="listParams.startTime" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
          <span>--</span>
          <DatePicker type="datetime" style="width: 200px" v-model="listParams.endTime" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
          <Button type="info" class="ml15" @click="checkFinance">确定</Button>
        </div>
        <p v-for="(item,index) in timeFlagList" :key="'time' + index" class="ml30" :class="{active: timeFlagIndex === index}" @click="toggleTimeFlag(index,item.timeFlag)">{{item.timeName}}</p>
      </div>
      <Table class="mt20" border :columns="columns" :data="listData" :loading="loading" height="450"></Table>
      <div class="mt20 text-center">
        <Page :total="total" :current="listParams.pageNum"  show-total show-elevator show-sizer @on-page-size-change="changeFinanceSize" @on-change="changeFinancePage" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios/axios";

export default {
  name:'financeManageFirst',
  data(){
    return {
      loading:false,
      staticData:{},
      total:0,
      timeFlagIndex:0,
      timeFlagList:[
        {timeName:'全部',timeFlag:null},
        {timeName:'今日',timeFlag:0},
        {timeName:'昨日',timeFlag:1},
        {timeName:'最近7天',timeFlag:2},
        {timeName:'最近30天',timeFlag:3}
      ],
      listParams:{
        shopId:'',
        timeFlag:null,
        pageNum:1,
        limit:10,
        startTime:'',
        endTime:''
      },
      listData:[],
      columns:[
        {
          title:'编号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title:'日期',
          align:'center',
          render:(h,params) => {
            return h('div',{
              style:{
                height:'100%',
              }
            },this.$tool.TransChinaTime(params.row.updateTime))
          }
        },
        {
          title:'订单编号',
          key:'orderNo',
          align:'center'
        },
        {
          title:'事件',
          key:'eventName',
          align:'center'
        },
        {
          title:'用户账号',
          key:'userLoginName',
          align:'center'
        },
        {
          title:'用户昵称',
          key:'userName',
          align:'center'
        },
        {
          title:'金额',
          key:'financialMoney',
          align:'center'
        },
        {
          title:'门店',
          key:'shopName',
          align:'center'
        },
      ],
    }
  },
  mounted () {
    this.listParams.shopId = sessionStorage.getItem('shopId');
    // if (sessionStorage.getItem('financeFlagIndex') !== null) {
    //   this.timeFlagIndex = parseInt(sessionStorage.getItem('financeFlagIndex'));
    // } else {
    //   this.timeFlagIndex = 0;
    // }
    this.getFinanceStatic();
    this.getFinanceList();
  },
  methods: {
    toggleTimeFlag:function (index,type) {
      // sessionStorage.setItem('financeFlagIndex',index);
      // this.timeFlagIndex = parseInt(sessionStorage.getItem('financeFlagIndex'));
      this.timeFlagIndex = index;
      this.listParams.timeFlag = type;
      this.listParams.startTime = '';
      this.listParams.endTime = '';
      this.listParams.pageNum = 1;
      this.getFinanceList();
    },
    checkFinance:function () {
      this.listParams.timeFlag = null;
      this.timeFlagIndex = 0;
      this.getFinanceList();
    },
    //获取销售统计
    getFinanceStatic:function () {
      axios.FinanceStatic({shopId:this.listParams.shopId})
        .then(res => {
          if (res.code === '0') {
            this.staticData = res.data;
          }
        })
        .catch(error => {console.log(error)})
    },
    //获取财务列表
    getFinanceList:function () {
      this.loading = true;
      if (this.listParams.startTime !== '') {
        this.listParams.startTime = this.$tool.TransChinaTime(this.listParams.startTime);
      }
      if (this.listParams.endTime !== '') {
        this.listParams.endTime = this.$tool.TransChinaTime(this.listParams.endTime);
      }
      axios.FinaaceStaticList(this.listParams)
        .then(res => {
          if (res.code === '0') {
            this.loading = false;
            this.total = res.count;
            this.listData = res.data;
          }
        })
        .catch(error => {console.log(error)})
    },
    changeFinanceSize:function (size) {
      this.listParams.limit = size;
      this.getFinanceList();
    },
    changeFinancePage:function (page) {
      this.listParams.pageNum = page;
      this.getFinanceList();
    },
  }
}
</script>

<style lang="less" scoped>
.financeManageFirst-container{
  .static-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .container-size{
      width: 374px;
      height: 181px;
      background:rgba(255,255,255,1);
      box-shadow:0 0 20px 0 rgba(0, 0, 0, 0.2);
      border-radius:10px;
      padding: 25px 40px 20px 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      p:first-child{
        border-left: 5px solid rgba(65,122,252,1);
        height: 14px;
        line-height: 14px;
        padding-left: 10px;
      }
      .line{
        height: 1px;
        background-color: rgba(194,202,216,1);
      }
    }
  }
  .finance-table{
    background-color: #ffffff;
    padding: 20px;
    .finance-condition-container{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      height: 40px;
      line-height: 40px;
      p:hover{
        cursor: pointer;
      }
      .active{
        color: #EB6B0B;
      }
    }
  }
}
</style>
