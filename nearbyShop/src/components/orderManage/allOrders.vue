<template>
  <div class="order-container" ref="orderCon">
    <!--订单切换-->
    <ul class="type-container">
      <li v-for="(item,index) in orderTypeList" :key="'type' + index" :class="{active:typeIndex === index}" @click="toggleType(index,item.typeValue)">{{item.typeName}}</li>
    </ul>
    <div class="order-statics">
      <div class="condition-container" v-if="typeIndex === 0">
        <div>
          <span>下单日期：</span>
          <DatePicker type="datetime" style="width: 200px" v-model="staticParams.startBuyDate" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
          <span>--</span>
          <DatePicker type="datetime" style="width: 200px" v-model="staticParams.endBuyDate" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
          <Button type="info" class="ml15" @click="checkStaticByTime">确定</Button>
        </div>
        <p v-for="(item,index) in timeFlagList" :key="'time' + index" class="ml30" :class="{active: timeFlagIndex === index}" @click="toggleTimeFlag(index,item.timeFlag)">{{item.timeName}}</p>
      </div>
      <div class="static-container mt10" v-if="typeIndex === 0">
        <p>
          <span class="s-s fs18">
            <span>订单总额</span>
            <span>{{staticsMessage.allOrder}}笔</span>
          </span>
          <span class="fs30" style="color:rgba(77,131,241,1);">{{staticsMessage.allMoney}}</span>
        </p>
        <p>
          <span class="s-s fs18">
            <span>已到账</span>
            <span>{{staticsMessage.hadOrder}}笔</span>
          </span>
          <span class="fs30" style="color:rgba(242,168,8,1);">{{staticsMessage.hadMoney}}</span>
        </p>
        <p>
          <span class="s-s fs18">
            <span>未到账</span>
            <span>{{staticsMessage.noOrder}}笔</span>
          </span>
          <span class="fs30" style="color:rgba(3,200,211,1);">{{staticsMessage.noMoney}}</span>
        </p>
        <p>
          <span class="s-s fs18">
            <span>已退款</span>
            <span>{{staticsMessage.backOrder}}笔</span>
          </span>
          <span class="fs30" style="color:rgba(246,63,44,1);">{{staticsMessage.backMoney}}</span>
        </p>
      </div>
      <div class="list-condition mt10">
        <div class="list-condition-one">
          <p>
            <span>商品名称：</span><Input style="width: 200px" v-model="orderListParams.goodsName"></Input>
          </p>
          <p class="ml30">
            <span>下单日期：</span>
            <DatePicker type="datetime" style="width: 200px" v-model="orderListParams.startBuyDate" format="yyyy-MM-dd HH:mm:ss" @on-change="buyDateChange"></DatePicker>
            <span style="width: 30px;text-align: center">--</span>
            <DatePicker type="datetime" style="width: 200px" v-model="orderListParams.endBuyDate" format="yyyy-MM-dd HH:mm:ss" @on-change="buyDateChange"></DatePicker>
          </p>
          <p class="ml30">
            <span>订单状态：</span>
            <Select multiple @on-change="getStatusIds" v-model="statusArr" style="min-width: 200px;width: auto;" v-if="orderListParams.orderStatus === ''">
              <Option v-for="(item,index) in orderStatusList" :key="'status' + index" :value="item.value">{{item.label}}</Option>
            </Select>
            <Input style="width: 200px" disabled v-else-if="orderListParams.orderStatus == '1'" value="待发货"/>
            <Input style="width: 200px" disabled v-else-if="orderListParams.orderStatus == '2'" value="待签收"/>
            <Input style="width: 200px" disabled v-else-if="orderListParams.orderStatus == '4'" value="待审批"/>
            <Input style="width: 200px" disabled v-else-if="orderListParams.orderStatus == '6'" value="待退款"/>
            <Input style="width: 200px" disabled v-else-if="orderListParams.orderStatus == '8'" value="已退款"/>
            <Input style="width: 200px" disabled v-else-if="orderListParams.orderStatus == '5'" value="已取消"/>
            <Input style="width: 200px" disabled v-else-if="orderListParams.orderStatus == '3'" value="已完成"/>
          </p>
        </div>
        <div class="list-condition-one mt20">
          <p>
            <span>订单编号：</span><Input v-model="orderListParams.orderNo" style="width: 200px"></Input>
          </p>
          <p class="ml30" v-if="orderListParams.orderStatus === ''">
            <span>发货日期：</span>
            <DatePicker type="datetime" style="width: 200px" v-model="orderListParams.startShipDate" format="yyyy-MM-dd HH:mm:ss" @on-change="shipDateChange"></DatePicker>
            <span style="width: 30px;text-align: center">--</span>
            <DatePicker type="datetime" style="width: 200px" v-model="orderListParams.endShipDate" format="yyyy-MM-dd HH:mm:ss" @on-change="shipDateChange"></DatePicker>
          </p>
          <p class="ml30">
            <span>归属门店：</span>
            <AutoComplete
              icon="ios-search"
              style="width: 200px"
              @on-search="checkShop"
             @on-change="searchChange"
              v-model="orderListParams.ownShopName"
            >
              <Option v-for="(item,index) in shopList" :key="'shop'+index" :value="item.shopName">
                <div class="demo-auto-complete-item" @click="getShopId(item.shopId)">{{item.shopName}}</div>
              </Option>
            </AutoComplete>
          </p>
        </div>
        <div class="list-condition-one mt20">
          <p>
            <span>买家昵称：</span><Input v-model="orderListParams.realName" style="width: 200px"></Input>
          </p>
          <p class="ml30" v-if="orderListParams.orderStatus === ''">
            <span>签收日期：</span>
            <DatePicker type="datetime" style="width: 200px" v-model="orderListParams.startSigningDate" format="yyyy-MM-dd HH:mm:ss" @on-change="signingDateChange"></DatePicker>
            <span style="width: 30px;text-align: center">--</span>
            <DatePicker type="datetime" style="width: 200px" v-model="orderListParams.endSigningDate" format="yyyy-MM-dd HH:mm:ss" @on-change="signingDateChange"></DatePicker>
          </p>
          <p class="ml30">
            <Button type="info" @click="checkList">查询</Button>
            <Button class="ml30" @click="resetCondition">重置</Button>
          </p>
        </div>
      </div>
      <div class="order-list-container mt20 pos-re">
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>加载中...</div>
        </Spin>
        <div>
          <Button type="info" @click="lotsExportExcel">批量导出</Button>
          <Button type="info" class="ml10" @click="lotsExport = true" v-if="orderListParams.orderStatus === '' || orderListParams.orderStatus == 1">批量出货</Button>
          <Button type="info" class="ml10" v-if="orderListParams.orderStatus === '' ||  orderListParams.orderStatus == 1" @click="shopExportExcel">门店导出</Button>
          <Button type="info" class="ml10" v-if="orderListParams.orderStatus === '' ||  orderListParams.orderStatus == 1" @click="shopExport = true">门店出货</Button>
        </div>
        <div class="list-title fs14 fw mt20">
          <Row>
            <Col span="2"><div style="padding-left: 10px"><input type="checkbox" @click="selectAll($event)" ref="allCheck" style="margin-right: 10px"/>全选</div></Col>
            <Col span="6"><div class="text-center">商品</div></Col>
            <Col span="2"><div class="text-center">售价</div></Col>
            <Col span="2"><div class="text-center">数量</div></Col>
            <Col span="4"><div class="text-center">收货地址</div></Col>
            <Col span="2"><div class="text-center">实际支付</div></Col>
            <Col span="2"><div class="text-center">商家货款</div></Col>
            <Col span="2"><div class="text-center">管理费</div></Col>
            <Col span="2"><div class="text-center">操作</div></Col>
          </Row>
        </div>
        <div class="list-detail mt10" v-for="(item,index) in orderList" :key="'order' + index">
          <div class="list-order-tit">
            <div>
              <!--<span><Checkbox :data-id="item.id" @on-change="checkOrder()"></Checkbox></span>-->
              <span><input type="checkbox" :data-id="item.id" @click="checkOrder($event)" ref="checkbox"/></span>
              <span class="ml15" style="color: #999999;">{{$tool.TransChinaTime(item.createTime)}}</span>
              <span class="ml15">订单编号：{{item.orderNo}}</span>
              <span v-if="item.sendShop === 0" class="ml15">（配送到门店）</span>
            </div>
            <div>
              <span class="name-icon">
                <span><img src="../../assets/icon/nameIcon.png"/></span>
                <span style="margin-left: 25px">{{item.shopInfoName}}</span>
              </span>
              <span>特约人：{{item.referrerName}}（{{item.referrerMobile}}）</span>
              <span class="ml15" style="margin-right: 44px">紧急联系人：{{item.shopManager}}（{{item.shopManagerMobile}}）</span>
              <span v-if="item.orderStatus === 1" class="color-error">待发货</span>
              <span v-else-if="item.orderStatus === 2">待签收</span>
              <span v-else-if="item.orderStatus === 3">已完成</span>
              <span v-else-if="item.orderStatus === 4" class="color-error">待审批</span>
              <span v-else-if="item.orderStatus === 8">已退款</span>
              <span v-else-if="item.orderStatus === 6" class="color-error">待退款</span>
              <span v-else>已取消</span>
            </div>
          </div>
          <div class="list-order-message">
            <Row>
              <Col span="8">
                <div class="flex-col h">
                  <div class="goods-name h-common" v-for="(it,ind) in item.orderGoodsList" :key="'name' + ind">
                    <img :src="it.goodsImg"/>
                    <div class="ml15">
                      <p style="padding-right: 5px">{{it.goodsName}}</p>
                      <p>编码：{{it.goodsNo}}</p>
                      <p>规格：{{it.goodsSpecificationName}}</p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span="2">
                <div class="flex-col h">
                  <div class="text-center goods-price h-common" v-for="(it,ind) in item.orderGoodsList" :key="'price' + ind">
                    <p>{{it.integralPrice}}玄乐&nbsp;&nbsp;+</p>
                    <p style="margin-top: 5px">{{it.maxDeductionIntegral}}积分</p>
                    <p style="margin-top: 5px">（管理费：{{it.goodsServiceRate}}%）</p>
                  </div>
                </div>
              </Col>
              <Col span="2">
                <div class="flex-col h">
                  <div class="text-center goods-count h-common" v-for="(it,ind) in item.orderGoodsList" :key="'num' + ind">
                    <p style="margin-top: 3px">{{it.goodsNum}}</p>
                  </div>
                </div>
              </Col>
              <Col span="4">
                <div class="goods-address text-center h h-flex" :style="{height:item.orderGoodsList.length * 90 + 'px'}">
                  <p><span>{{item.addressRealName}}</span><span class="ml10">{{item.phone}}</span></p>
                  <p style="margin-top: 5px;">{{item.address}}</p>
                </div>
              </Col>
              <Col span="2">
                <div class="goods-money text-center h h-flex" :style="{height:item.orderGoodsList.length * 90 + 'px'}">
                  <p>{{item.totalMoney}}玄乐&nbsp;&nbsp;+</p>
                  <p style="margin-top: 5px">{{item.totalIntegral}}积分</p>
                </div>
              </Col>
              <Col span="2">
                <div class="text-center h h-flex" :style="{height:item.orderGoodsList.length * 90 + 'px'}">{{item.shopMoney}}玄乐</div>
              </Col>
              <Col span="2">
                <div class="text-center h h-flex" :style="{height:item.orderGoodsList.length * 90 + 'px'}">{{item.serviceFee}}玄乐</div>
              </Col>
              <Col span="2">
                <div class="goods-operate text-center h-flex" :style="{height:item.orderGoodsList.length * 90 + 'px'}">
                  <p>
                    <Button type="error" size="small" class="" v-if="item.orderStatus === 1" @click="showSendModal(item.id)">立即发货</Button>
                    <Button type="error" size="small" class="" v-else-if="item.orderStatus === 4" @click="showReturnModal(item.id)">同意退货</Button>
                    <Button type="error" size="small" class="" v-else-if="item.orderStatus === 6" @click="showDrawbackModal(item.id)">立即退款</Button>
                  </p>
                  <p class="mt10"><Button type="primary" size="small" @click="goOrderDetail(item.id)">查看详情</Button></p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div class="mt30 bottom-area">
          <div>
            <span>已选{{idArr.length}}项</span>
            <span class="ml15">
              <Button type="default" @click="exportById" v-if="orderListParams.orderStatus === '' || orderListParams.orderStatus === '1'">批量出货</Button>
              <Button type="default" @click="exportExcelById" v-else>批量导出</Button>
            </span>
          </div>
          <Page :total="total" :current="orderListParams.pageNum" show-total show-elevator show-sizer @on-page-size-change="orderPageChangeSize" @on-change="orderPageChange"/>
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
    <!--批量出货-->
    <Modal
      title="批量出货"
      v-model="lotsExport"
      :loading="lotsLoading"
      :mask-closable = "false"
      @on-ok="lotsExportOk"
      @on-visible-change="lotsExportVis"
    >
      <Form :model="lotsData" ref="lotsData" :rules="lotsRule" :label-width="80">
        <FormItem label="下单日期：">
          <Row>
            <Col span="11">
              <FormItem prop="startSendDate">
                <DatePicker type="datetime" v-model="lotsData.startSendDate" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2">--</Col>
            <Col span=11>
              <FormItem prop="endSendDate">
                <DatePicker type="datetime"  v-model="lotsData.endSendDate" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <dl>
        <dt style="width: 80px;padding: 10px 12px 10px 0;text-align: right">注意事项：</dt>
        <dd style="text-indent: 2em;" class="mt10">批量出货适用于送货上门，如果有快递配送的订单，建议不要使用批量发货。</dd>
      </dl>
    </Modal>
    <!--门店导出-->
    <Modal
      title="门店导出"
      v-model="shopExcel"
      :loading="shopExcelLoaading"
      :mask-closable="false"
      @on-ok="shopExcelOk"
      @on-visible-change="shopExcelVis"
    >
      <Form :model="shopExcelData" ref="shopExcelData" :rules="shopExcelRules" :label-width="80">
        <FormItem label="选择日期：">
          <Row>
            <Col span="11">
              <FormItem prop="startBuyDate">
                <DatePicker type="datetime" v-model="shopExcelData.startBuyDate" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2">--</Col>
            <Col span=11>
              <FormItem prop="endBuyDate">
                <DatePicker type="datetime"  v-model="shopExcelData.endBuyDate" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
    <!--门店出货-->
    <Modal
      title="门店出货"
      v-model="shopExport"
      :loading="shopLoading"
      :mask-closable = "false"
      @on-ok="shopExportOk"
      @on-visible-change="shopExportVis"
    >
      <Form :model="shopData" ref="shopData" :rules="shopRule" :label-width="80">
        <FormItem label="下单日期：">
          <Row>
            <Col span="11">
              <FormItem prop="startSendDate">
                <DatePicker type="datetime" v-model="shopData.startSendDate" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2">--</Col>
            <Col span=11>
              <FormItem prop="endSendDate">
                <DatePicker type="datetime"  v-model="shopData.endSendDate" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="归属门店：" prop="shopName">
          <AutoComplete
            icon="ios-search"
            style="width: 200px"
            @on-search="exportCheckShop"
            @on-change="exportSearchChange"
            v-model="shopData.shopName"
          >
            <Option v-for="(item,index) in exportShopList" :key="'export'+index" :value="item.shopName">
              <div class="demo-auto-complete-item" @click="getExportShopId(item.shopId)">{{item.shopName}}</div>
            </Option>
          </AutoComplete>
        </FormItem>
      </Form>
      <dl>
        <dt style="width: 80px;padding: 10px 12px 10px 0;text-align: right">注意事项：</dt>
        <dd style="text-indent: 2em;" class="mt10">批量出货适用于送货上门，如果有快递配送的订单，建议不要使用批量发货。</dd>
      </dl>
    </Modal>
    <!--勾选批量出货-->
    <Modal
      title="批量出货"
      v-model="idExport"
      :loading="idLoading"
      :mask-closable = "false"
      @on-ok="idExportOk"
    >
      <dl style="padding-bottom: 20px;">
        <dt style="width: 80px;padding: 10px 12px 10px 0;text-align: right">注意事项：</dt>
        <dd style="text-indent: 2em;" class="mt10">批量出货适用于送货上门，如果有快递配送的订单，建议不要使用批量发货。</dd>
      </dl>
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
      title="立即发货"
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
  name:'allOrders',
  data(){
    const shopVali = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择归属门店'));
      } else {
        callback();
      }
    };
    return {
      loading:false,
      total:0,
      typeIndex:0,
      orderTip:false,
      lotsExport:false,
      lotsLoading:true,
      shopExport:false,
      shopLoading:true,
      orderTypeList:[
        {typeName:'全部订单',typeValue:''},
        {typeName:'待发货',typeValue:1},
        {typeName:'待签收',typeValue:2},
        {typeName:'待审批',typeValue:4},
        {typeName:'待退款',typeValue:6},
        {typeName:'已退款',typeValue:8},
        {typeName:'已取消',typeValue:5},
        {typeName:'已完成',typeValue:3}
      ],
      timeFlagIndex:0,
      timeFlagList:[
        {timeName:'全部',timeFlag:null},
        {timeName:'今日',timeFlag:0},
        {timeName:'昨日',timeFlag:1},
        {timeName:'最近7天',timeFlag:2},
        {timeName:'最近30天',timeFlag:3}
      ],
      staticParams:{ //订单统计查询参数
        stordId:'', //商户id 登录时获取
        timeFlag:null, //时间标签
        startBuyDate:'', //下单开始时间
        endBuyDate:'', //下单结束时间
      },
      staticsMessage:{
        allMoney:'',
        allOrder:'',
        hadMoney:'',
        hadOrder:'',
        noMoney:'',
        noOrder:'',
        backMoney:'',
        backOrder:'',
      },
      statusArr:[],
      orderListParams:{  //订单列表查询参数
        pageNum:1, //页码
        limit:10,//条数
        storeId:'',//门店id 登录时获取
        realName:'',//买家昵称
        orderStatus:'',//订单状态
        orderNo:'',//订单编号
        startShipDate:'',//发货开始时间
        endShipDate:'',//发货结束时间
        startSigningDate:'',//签收开始时间
        endSigningDate:'',//签收结束时间
        statusIds:'',//多选订单状态
        startBuyDate:'',//下单开始时间
        endBuyDate:'',//下单结束时间
        ownShopId:'',//归属门店
        goodsName:'',//商品名称
        ownShopName:'',
      },
      orderStatusList:[ //多选状态
        {label:'待发货',value:1},
        {label:'待签收',value:2},
        {label:'待审批',value:4},
        {label:'待退款',value:6},
        {label:'已退款',value:8},
        {label:'已取消',value:5},
        {label:'已完成',value:3}
      ],
      shopList:[],//门店列表
      orderList:[],
      //批量出货
      lotsData:{
        startSendDate:'',
        endSendDate:''
      },
      lotsRule:{
        startSendDate:[
          {required: true, message: '请选择下单开始时间',type:'date'}
        ],
        endSendDate:[
          {required: true, message: '请选择下单结束时间',type:'date'}
        ],
      },
      //门店导出
      shopExcel:false,
      shopExcelLoaading:true,
      shopExcelData:{
        startBuyDate:'',
        endBuyDate:''
      },
      shopExcelRules:{
        startBuyDate:[
          {required:true,message:'请选择导出开始时间'}
        ],
        endBuyDate:[
          {required:true,message:'请选择导出结束时间'}
        ]
      },
      //门店出货
      exportShopList:[],
      shopData:{
        startSendDate:'',
        endSendDate:'',
        storeId:'',
        shopName:'',
      },
      shopRule:{
        startSendDate:[
          {required: true, message: '请选择下单开始时间',type:'date'}
        ],
        endSendDate:[
          {required: true, message: '请选择下单结束时间',type:'date'}
        ],
        shopName:[
          {validator:shopVali}
        ]
      },
      //勾选批量导出
      idArr:[],
      idLoading:true,
      idExport:false,
      //同意退货
      returnGoods:false,
      returnLoading:true,
      returnId:'',
      //确认退款
      drawBack:false,
      drawbackLoading:true,
      drawId:'',
      //立即发货
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

    }
  },
  mounted () {
    this.staticParams.stordId = sessionStorage.getItem('shopId');
    this.orderListParams.storeId = sessionStorage.getItem('shopId');
    if (sessionStorage.getItem('orderType') !== null && sessionStorage.getItem('orderType') !== '') {
      this.orderListParams.orderStatus = parseInt(sessionStorage.getItem('orderType'));
    } else {
      this.orderListParams.orderStatus = '';
    }
    if (sessionStorage.getItem('orderTypeIndex') !== null) {
      this.typeIndex = parseInt(sessionStorage.getItem('orderTypeIndex'));
    } else {
      this.typeIndex = 0;
    }
    if (sessionStorage.getItem('timeFlagIndex') !== null) {
      this.timeFlagIndex = parseInt(sessionStorage.getItem('timeFlagIndex'));
    } else {
      this.timeFlagIndex = 0;
    }
    if (sessionStorage.getItem('timeFlag') !== null) {
      this.staticParams.timeFlag = parseInt(sessionStorage.getItem('timeFlag'));
    } else {
      this.staticParams.timeFlag = null;
    }
    this.getOrderStatucs();
    this.getOrderList();
    this.getExpressCompany();
  },
  methods: {
    orderPageChangeSize:function (size) {
      this.orderListParams.limit = size;
      this.getOrderList();
    },
    orderPageChange:function (page) {
      this.idArr = [];
      this.orderList = [];
      this.$refs.allCheck.checked = false;
      this.orderListParams.pageNum = page;
      this.getOrderList();
    },
    toggleType:function (index,type) {
      this.idArr = [];
      this.orderList = [];
      this.$refs.allCheck.checked = false;
      sessionStorage.setItem('orderTypeIndex',index);
      this.typeIndex = parseInt(sessionStorage.getItem('orderTypeIndex'));
      sessionStorage.setItem('orderType',type);
      this.orderListParams.orderStatus = sessionStorage.getItem('orderType');
      //清空搜索数据
      this.orderListParams.pageNum = 1;
      this.orderListParams.realName = '';//买家昵称
      this.orderListParams.orderNo = '';//订单编号
      this.orderListParams.startShipDate = '';//发货开始时间
      this.orderListParams.endShipDat = '';//发货结束时间
      this.orderListParams.startSigningDate = '';//签收开始时间
      this.orderListParams.endSigningDate = '';//签收结束时间
      this.orderListParams.statusIds = '';//多选订单状态
      this.statusArr = [];
      this.orderListParams.startBuyDate = '';//下单开始时间
      this.orderListParams.endBuyDate = '';//下单结束时间
      this.orderListParams.ownShopId = '';//归属门店
      this.orderListParams.goodsName = '';//商品名称
      this.getOrderList();
    },
    toggleTimeFlag:function (index,flag) {
      sessionStorage.setItem('timeFlagIndex',index);
      this.timeFlagIndex = parseInt(sessionStorage.getItem('timeFlagIndex'));
      if (flag === null) {
        sessionStorage.removeItem('timeFlag');
      }else {
        sessionStorage.setItem('timeFlag',flag);
      }
      this.staticParams.startBuyDate = '';
      this.staticParams.endBuyDate = '';
      this.staticParams.timeFlag = sessionStorage.getItem('timeFlag');
      this.getOrderStatucs();
    },
    checkStaticByTime:function () {
      if (this.staticParams.startBuyDate !== '') {
        this.staticParams.startBuyDate = this.$tool.TransChinaTime(this.staticParams.startBuyDate);
      }
      if (this.staticParams.endBuyDate !== '') {
        this.staticParams.endBuyDate = this.$tool.TransChinaTime(this.staticParams.endBuyDate);
      }
      this.staticParams.timeFlag = null;
      sessionStorage.removeItem('timeFlag');
      this.timeFlagIndex = 0;
      sessionStorage.removeItem('timeFlagIndex');
      this.getOrderStatucs();
    },
    //获取订单统计
    getOrderStatucs:function () {
      axios.OrderStatics(this.staticParams)
        .then(res => {
          if (res.code === '0') {
            this.staticsMessage.allMoney = res.data.totalMoney;
            this.staticsMessage.allOrder = res.data.totalOrderNum;
            this.staticsMessage.hadMoney = res.data.arrivalMoney;
            this.staticsMessage.hadOrder = res.data.arrivalOrderNum;
            this.staticsMessage.noMoney = res.data.noArrivalMoney;
            this.staticsMessage.noOrder = res.data.noArrivalOrderNum;
            this.staticsMessage.backMoney = res.data.refundMoney;
            this.staticsMessage.backOrder = res.data.refundOrderNum;
          } else {

          }
        })
        .catch(error => {console.log(error)})
    },
    getStatusIds:function (value) {
      this.orderListParams.statusIds = value.join();
    },
    //获取门店列表
    checkShop:function (query) {
      axios.OrderGetShopList({shopofName :query})
        .then(res => {
          this.shopList = res;
        })
        .catch(error => {
          console.log(error);
        })
    },
    getShopId:function(id){
      this.orderListParams.ownShopId = id;
    },
    searchChange:function(value){
      if (value === '') {
        this.orderListParams.ownShopId = '';
        this.shopList = [];
      }
    },
    //获取订单列表
    getOrderList:function () {
      this.loading = true;
      axios.OrderList(this.orderListParams)
        .then(res => {
          if (res.code === '0') {
            this.total = res.count;
            this.orderList = res.data;
            document.getElementsByClassName('main-pad')[0].scrollTop = 0;
            this.loading = false;
          } else {
            this.orderTip = true;
            this.$refs.orderTip.innerHTML = '订单列表查询出错！'
          }
        })
        .catch(error => {console.log(error)})
    },
    shipDateChange:function () {
      this.orderListParams.startSigningDate = '';
      this.orderListParams.endSigningDate = '';
      this.orderListParams.startBuyDate = '';
      this.orderListParams.endBuyDate = '';
    },
    signingDateChange:function () {
      this.orderListParams.startShipDate = '';
      this.orderListParams.endShipDate = '';
      this.orderListParams.startBuyDate = '';
      this.orderListParams.endBuyDate = '';
    },
    buyDateChange:function () {
      this.orderListParams.startSigningDate = '';
      this.orderListParams.endSigningDate = '';
      this.orderListParams.startShipDate = '';
      this.orderListParams.endShipDate = '';
    },
    checkList:function () {
      if (this.orderListParams.startShipDate !== '') {
        this.orderListParams.startShipDate = this.$tool.TransChinaTime(this.orderListParams.startShipDate);
      }
      if (this.orderListParams.endShipDate !== '') {
        this.orderListParams.endShipDate = this.$tool.TransChinaTime(this.orderListParams.endShipDate);
      }
      if (this.orderListParams.startSigningDate !== '') {
        this.orderListParams.startSigningDate = this.$tool.TransChinaTime(this.orderListParams.startSigningDate);
      }
      if (this.orderListParams.endSigningDate !== '') {
        this.orderListParams.endSigningDate = this.$tool.TransChinaTime(this.orderListParams.endSigningDate);
      }
      if (this.orderListParams.startBuyDate !== '') {
        this.orderListParams.startBuyDate = this.$tool.TransChinaTime(this.orderListParams.startBuyDate);
      }
      if (this.orderListParams.endBuyDate !== '') {
        this.orderListParams.endBuyDate = this.$tool.TransChinaTime(this.orderListParams.endBuyDate);
      }
      this.orderListParams.pageNum = 1;
      this.getOrderList();
    },
    resetCondition:function () {
      this.orderListParams.realName = '';//买家昵称
      this.orderListParams.orderNo = '';//订单编号
      this.orderListParams.startShipDate = '';//发货开始时间
      this.orderListParams.endShipDate = '';//发货结束时间
      this.orderListParams.startSigningDate = '';//签收开始时间
      this.orderListParams.endSigningDate = '';//签收结束时间
      this.orderListParams.statusIds = '';//多选订单状态
      this.statusArr = [];
      this.orderListParams.startBuyDate = '';//下单开始时间
      this.orderListParams.endBuyDate = '';//下单结束时间
      this.orderListParams.ownShopId = '';//归属门店
      this.shopList = [];
      this.orderListParams.ownShopName = '';
      this.orderListParams.goodsName = '';//商品名称
    },
    goOrderDetail:function (id) {
      const {href} = this.$router.resolve({
        path: "/orderDetail",
        query: {
          id:id
        }
      });
      window.open(href, '_blank');
    },
    del:function () {
      this.orderTip = false;
    },
    checkOrder:function (e) {
      let id = e.currentTarget.dataset.id;
      let checked = e.currentTarget.checked;
      if (checked) {
        this.idArr.push(id)
      } else {
        this.idArr.splice(this.idArr.indexOf(id),1);
        this.$refs.allCheck.checked = false;
      }
      // console.log(this.idArr);
    },
    lotsExportOk:function () {
      this.$refs.lotsData.validate(valid => {
        if (valid) {
          axios.OrderLotsExport({startSendDate:this.$tool.TransChinaTime(this.lotsData.startSendDate),endSendDate:this.$tool.TransChinaTime(this.lotsData.endSendDate),storeId:this.staticParams.stordId})
            .then(res => {
              if (res.code === '0') {
                this.lotsExport = false;
                this.$refs.lotsData.resetFields();
                this.orderTip = true;
                this.$refs.orderTip.innerHTML = '批量出货成功！';
                this.getOrderList()()
              } else {
                this.$Message.error({content:res.message,duration:4});
                this.changeLotsLoading();
              }
            })
            .catch(error => {console.log(error)})
        } else {
          this.changeLotsLoading();
        }
      })
    },
    lotsExportVis:function (value) {
      if (!value) {
        this.$refs.lotsData.resetFields();
      }
    },
    changeLotsLoading:function () {
      this.lotsLoading = false;
      this.$nextTick(() => {
        this.lotsLoading = true;
      });
    },
    //批量导出
    lotsExportExcel:function () {
      window.location.href = base.baseUrl.serviceOne + '/shoppingOrder/exportShoppingOrderToExcel?storeId='+this.orderListParams.storeId+'&realName='+this.orderListParams.realName+'&orderStatus='+this.orderListParams.orderStatus+'&orderNo='+this.orderListParams.orderNo+'&startShipDate='+this.orderListParams.startShipDate+'&endShipDate='+this.orderListParams.endShipDate+'&startSigningDate='+this.orderListParams.startSigningDate+'&endSigningDate='+this.orderListParams.endSigningDate+'&statusIds='+this.orderListParams.statusIds+'&startBuyDate='+this.orderListParams.startBuyDate+'&endBuyDate='+this.orderListParams.endBuyDate+'&ownShopId='+this.orderListParams.ownShopId+'&goodsName='+this.orderListParams.goodsName;
    },
    //门店导出
    shopExportExcel:function () {
      this.shopExcel = true;
    },
    shopExportOk:function () {
      this.$refs.shopData.validate(valid => {
        if (valid) {
          axios.OrderShopExport({startSendDate:this.$tool.TransChinaTime(this.shopData.startSendDate),endSendDate:this.$tool.TransChinaTime(this.shopData.endSendDate),storeId:sessionStorage.getItem('shopId'),ownShopId:this.shopData.storeId})
            .then(res => {
              if (res.code === '0') {
                this.shopExport = false;
                this.$refs.shopData.resetFields();
                this.shopData.storeId = '';
                this.exportShopList = [];
                this.shopData.shopName = '';
                this.orderTip = true;
                this.$refs.orderTip.innerHTML = '门店出货成功！';
                this.getOrderList();
              } else {
                this.$Message.error({content:res.message,duration:4});
                this.changShopLoading();
              }
            })
            .catch(error => {console.log(error)})
        } else {
          this.changShopLoading();
        }
      });
    },
    shopExportVis:function (value) {
      if (!value) {
        this.$refs.shopData.resetFields();
        this.shopData.storeId = '';
        this.exportShopList = [];
        //this.shopData.shopName = '';
      }
    },
    changShopLoading:function () {
      this.shopLoading = false;
      this.$nextTick(() => {
        this.shopLoading = true;
      });
    },
    exportCheckShop:function (query) {
      axios.OrderGetShopList({shopofName :query})
        .then(res => {
          this.exportShopList = res;
        })
        .catch(error => {
          console.log(error);
        })
    },
    exportSearchChange:function (value) {
      if (value === '') {
        this.shopData.storeId = '';
        this.exportShopList = [];
      }
    },
    getExportShopId:function (id) {
      this.shopData.storeId = id;
    },
    exportById:function () {
      if (this.idArr.length > 0) {
        this.idExport = true;
      } else {
        this.orderTip = true;
        this.$refs.orderTip.innerHTML = '请至少勾选一个订单！'
      }
    },
    selectAll:function (e) {
      let ch = e.currentTarget.checked;
      if (ch) {
        this.$refs.checkbox.forEach(item => {
          item.checked = ch;
          this.idArr.push(item.dataset.id);
        });
      }  else {
        this.$refs.checkbox.forEach(item => {
          item.checked = ch;
        });
        this.idArr = [];
      }

      // console.log(this.idArr);
    },
    idExportOk:function () {
      axios.OrderLotsExport({orderIds:this.idArr.join(),storeId:this.staticParams.stordId})
        .then(res => {
          if (res.code === '0') {
            this.idExport = false;
            this.orderTip = true;
            this.$refs.orderTip.innerHTML = '批量出货成功！';
            this.idArr = [];
            this.orderList = [];
            this.getOrderList();
          } else {
            this.$Message.error({content:res.message,duration:4});
            this.changIdLoading();
          }
        })
        .catch(error => {console.log(error);this.changIdLoading();})
    },
    changIdLoading:function () {
      this.idLoading = false;
      this.$nextTick(() => {
        this.idLoading = true;
      });
    },
    exportExcelById:function () {
      if (this.idArr.length > 0) {
        window.location.href = base.baseUrl.serviceOne + '/shoppingOrder/exportShoppingOrderToExcel?orderIds='+this.idArr.join();
      } else {
        this.orderTip = true;
        this.$refs.orderTip.innerHTML = '请至少勾选一个订单！'
      }
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
            this.getOrderList();
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
            this.getOrderList();
          } else {
            this.$refs.orderTip.innerHTML = res.message;
          }
        })
        .catch(error => {console.log(error);})
    },
    showSendModal:function (id) {
      this.sendGoods = true;
      this.sendId = id;
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
                this.$refs.orderTip.innerHTML = '发货成功！';
               this.getOrderList();
              } else {
                this.$Message.error({content:'发货失败！',duration:4});
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
    shopExcelOk:function () {
      this.$refs.shopExcelData.validate(valid => {
        if (valid) {
          window.location.href = base.baseUrl.serviceOne + '/shoppingOrder/exportOwnShoppingOrderToExcel?storeId='+this.orderListParams.storeId+'&startBuyDate='+this.$tool.TransChinaTime(this.shopExcelData.startBuyDate)+'&endBuyDate='+this.$tool.TransChinaTime(this.shopExcelData.endBuyDate);
          this.shopExcel = false;
        } else {
          this.changeShopExcelLoading();
        }
      })
    },
    shopExcelVis:function (value) {
      if (!value) {
        this.$refs.shopExcelData.resetFields();
      }
    },
    changeShopExcelLoading:function () {
      this.shopExcelLoaading = false;
      this.$nextTick(() => {
        this.shopExcelLoaading = true;
      });
    }
  }
}
</script>

<style lang="less" scoped>
.order-container{
  .type-container{
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
  .order-statics{
    padding: 20px;
    /*background-color: #ffffff;*/
    border-top: 1px solid rgba(213,213,213,1);
    .condition-container{
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
    .static-container{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 36px 50px;
      background-color: #ffffff;
      border-radius: 10px;
      height: 235px;
      //color: #ffffff;
      p{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 322px;
        height: 162px;
        /*text-align: center;*/
        font-weight: bold;
        padding: 40px 32px;
        border-radius: 10px;
        box-shadow:0 0 20px 0 rgba(0, 0, 0, 0.2);
        &:nth-child(1){
          border:2px solid rgba(77,131,241,1);
        }
        &:nth-child(2){
          border:2px solid rgba(242,168,8,1);
        }
        &:nth-child(3){
          border:2px solid rgba(42,208,217,1);
        }
        &:nth-child(4){
          border:2px solid rgba(246,63,44,1);
        }
        .s-s{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        /*span{*/
          /*margin-top: 10px;*/
        /*}*/
      }
    }
    .list-condition{
      background-color: #ffffff;
      padding: 20px;
      .list-condition-one{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        p{
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          height: 35px;
          line-height: 35px;
          span{
            display: inline-block;
            width: 65px;
          }
        };
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
          /*div:first-child{*/
            /*width: 33%;*/
          /*}*/
          /*div:nth-child(2){*/
            /*width: 21%;*/
          /*}*/
          /*div:last-child{*/
            /*width: 46%;*/
          /*}*/
          div:last-child{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
          }
          .name-icon{
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-right: 20px;
            span:first-child{
              position: relative;
            }
            img{
              width: 16px;
              height: 15px;
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto;
            }
          }
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
  }
  .bottom-area{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
