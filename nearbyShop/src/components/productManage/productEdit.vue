<template>
  <div>
    <Breadcrumb class="bread-container">
      <BreadcrumbItem to="/productManage">商品管理</BreadcrumbItem>
      <BreadcrumbItem>编辑商品</BreadcrumbItem>
    </Breadcrumb>
    <div class="edit-container mt20 pos-re">
      <Spin fix v-if="loading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>加载中...</div>
      </Spin>
      <Form class="edit-form" ref="editData" :model="editData" :rules="rules" :label-width="120" inline>
        <div class="bgf">
          <p><span class="line"></span><span class="ml15 pf">基本信息</span></p>
          <FormItem label="商品名称：" style="width: 78%;" prop="goodsName">
            <Input v-model="editData.goodsName" placeholder="请输入，允许最多75个字符" :maxlength=75></Input>
          </FormItem>
          <FormItem label="商品型号：" style="width: 26%;margin-right: 0;" prop="modelNumber">
            <Input v-model="editData.modelNumber" placeholder="请输入，允许最多10个字符" :maxlength=10></Input>
          </FormItem>
          <FormItem label="一级分类：" style="width: 26%;margin-right: 0" prop="firstLevel">
            <Select style="width: 100%" v-model="editData.firstLevel" clearable @on-change="getSecondLevel" :label-in-value="true">
              <Option v-for="(item,index) in firstLevelList" :key="index" :value="item.id">{{item.typeName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="二级分类：" style="width: 26%;margin-right: 0" prop="goodTypeId">
            <Select style="width: 100%" v-model="editData.goodTypeId" clearable @on-change="changeHas">
              <Option v-for="(item,index) in secondLevelList" :key="index" :value="item.id">{{item.typeName}}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="mt20 bgf">
          <template v-if="isPhone && isHas">
            <p class=""><span class="line"></span><span class="ml15 pf">规格参数</span></p>
            <FormItem label="手机品牌：" style="width: 26%;margin-right: 0;" prop="brand">
              <Input v-model="editData.brand" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="运行内存：" style="width: 26%;margin-right: 0;" prop="runRam">
              <Input v-model="editData.runRam" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="机身内存：" style="width: 26%;margin-right: 0;" prop="bodyMemory">
              <Input v-model="editData.bodyMemory" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="手机型号：" style="width: 26%;margin-right: 0;" prop="modelNumberPhone">
              <Input v-model="editData.modelNumberPhone" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="上市时间：" style="width: 26%;margin-right: 0;" prop="marketTime">
              <Input v-model="editData.marketTime" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="系统版本：" style="width: 26%;margin-right: 0;" prop="systemVersion">
              <Input v-model="editData.systemVersion" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="后摄像头像素：" style="width: 26%;margin-right: 0;" prop="rearCamera">
              <Input v-model="editData.rearCamera" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="摄像头数量：" style="width: 26%;margin-right: 0;" prop="cameraNum">
              <Input v-model="editData.cameraNum" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="机身颜色：" style="width: 26%;margin-right: 0;" prop="color">
              <Input v-model="editData.color" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="屏幕尺寸：" style="width: 26%;margin-right: 0;" prop="screenSize">
              <Input v-model="editData.screenSize" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="cpu型号：" style="width: 26%;margin-right: 0;" prop="cpuModel">
              <Input v-model="editData.cpuModel" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="cpu品牌：" style="width: 26%;margin-right: 0;" prop="cpuBrand">
              <Input v-model="editData.cpuBrand" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="机身宽度：" style="width: 26%;margin-right: 0;" prop="bodyWidth">
              <Input v-model="editData.bodyWidth" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="机身厚度：" style="width: 26%;margin-right: 0;" prop="bodyHeight">
              <Input v-model="editData.bodyHeight" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="机身重量：" style="width: 26%;margin-right: 0;" prop="bodyWeight">
              <Input v-model="editData.bodyWeight" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="机身长度：" style="width: 26%;margin-right: 0;" prop="bodyLength">
              <Input v-model="editData.bodyLength" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="双卡机类型：" style="width: 26%;margin-right: 0;" prop="doubleCardModel">
              <Input v-model="editData.doubleCardModel" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="sim卡尺寸：" style="width: 26%;margin-right: 0;" prop="simSize">
              <Input v-model="editData.simSize" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="4g网络制式：" style="width: 26%;margin-right: 0;" prop="fourNetworkType">
              <Input v-model="editData.fourNetworkType" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="3g网络制式：" style="width: 26%;margin-right: 0;" prop="threeNetworkType">
              <Input v-model="editData.threeNetworkType" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
            <FormItem label="2g网络制式：" style="width: 26%;margin-right: 0;" prop="twoNetworkType">
              <Input v-model="editData.twoNetworkType" placeholder="请输入，允许最多13个字符" :maxlength=13></Input>
            </FormItem>
          </template>
          <template v-else-if="!isPhone && isHas">
            <p class=""><span class="line"></span><span class="ml15 pf">规格参数</span><span><Button icon="md-add" size="small" type="primary" class="ml30" @click="addParams = true">添加</Button></span></p>
            <div v-for="(item,index) in specsParamsList" :key="'tit' + index">
              <div style="padding-left: 30px" class="fw">{{item.title}}：</div>
              <FormItem style="width: 26%;margin-right: 0"
                        v-for="(it,ind) in item.list"
                        :key="'param' + ind"
                        :label="it.name + '：'"
              >
                <Row>
                  <Col span="22">
                    <Input v-model="it.value" placeholder="请输入参数内容，允许最多20个字符" :maxlength=20></Input>
                  </Col>
                  <Col span="1" offset="1">
                    <Button shape="circle" icon="md-close" size="small" @click="deleParams(index,ind)"></Button>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </template>
        </div>
        <div class="mt20 bgf">
          <p class=""><span class="line"></span><span class="ml15 pf">销售信息</span></p>
          <!--<FormItem label="市场指导价：" style="width: 26%" prop="guidePrice">-->
          <!--<Input v-model="editData.guidePrice" placeholder="请输入"></Input>-->
          <!--</FormItem>-->
          <FormItem label="市场指导价：" style="width: 26%" prop="goodsPrice">
            <InputNumber v-model="editData.goodsPrice" placeholder="请输入，最高999999" :max="999999" @on-blur="computeIntegral" style="width: 100%"></InputNumber>
          </FormItem>
          <FormItem label="实际售价：" style="width: 26%" prop="integralPrice">
            <InputNumber v-model="editData.integralPrice" placeholder="请输入，最高999999" :max="999999" @on-blur="computeIntegral" style="width: 100%"></InputNumber>
          </FormItem>
          <FormItem label="所需积分：" style="width: 26%">
            <Input placeholder="自动计算" disabled v-model="editData.maxDeductionIntegral"></Input>
          </FormItem>
          <FormItem label="快递费用：" style="width: 26%" prop="freight">
            <InputNumber v-model="editData.freight" placeholder="请输入，默认为0" :max="999999" style="width: 100%"></InputNumber>
          </FormItem>
          <FormItem label="管理费：" style="width: 26%" prop="goodsServiceRate">
            <InputNumber v-model="editData.goodsServiceRate" placeholder="例，5代表销售额的5%" style="width: 100%"
                         :min="1"
                         :max="99"
                         :formatter="value => `${value}%`"
                         :parser="value => value.replace('%', '')"
            ></InputNumber>
          </FormItem>
          <FormItem label="销售类型：" style="width: 26%" prop="saleType">
            <Select v-model="editData.saleType" clearable>
              <Option v-for="(item,index) in saleTypeList" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
        </div>
        <div class="mt20 bgf">
          <p class=""><span class="line"></span><span class="ml15 pf">规格库存</span><span><Button icon="md-add" type="primary" size="small" class="ml30" ghost @click="addSpecsStock">添加</Button></span></p>
          <FormItem :label-width="0" style="width: 50%"
                    v-for="(item,index) in stockList"
                    v-if="item.status"
                    :key="'stock' + index"
          >
            <Row style="padding-left: 30px;">
              <Col span="8">
                <FormItem style="width: 100%">
                  <Input placeholder="规格型号，允许最多16个字符" :maxlength=16 v-model="item.specs" style="width: 100%"></Input>
                </FormItem>
              </Col>
              <Col span="1" class="text-center">
                --
              </Col>
              <Col span="4">
                <FormItem>
                  <Input placeholder="库存" :maxlength=6 v-model="item.stock" style="width: 100%"></Input>
                </FormItem>
              </Col>
              <Col span="2" class="ml10">
                <Button shape="circle" icon="md-close" size="small" @click="stockRemove(index)"></Button>
              </Col>
            </Row>
          </FormItem>
        </div>
        <div class="mt20 bgf">
          <p class=""><span class="line"></span><span class="ml15 pf">商品主图</span><i class="ml10">长宽比例为1:1，推荐800*800；第一张商品主图将用于商品列表图</i></p>
          <FormItem :label-width="0" style="padding-left: 20px">
            <upload-revise ref="editMainImg" :upload-url="uploadUrl" :length="20" con-width="100%" :default-list="mainImgDefault" :list-value="isShowMain" v-on:success-callback="mainImgSuccess" v-on:remove-callback="mainImgRmove" v-on:position-callback="mainPositionChange"></upload-revise>
          </FormItem>
        </div>
        <div class="mt20 bgf">
          <p class=""><span class="line"></span><span class="ml15 pf">商品描述</span></p>
          <FormItem :label-width="0" style="width: 75%;padding-left: 30px">
            <Input type="textarea" v-model="editData.goodsDesc" placeholder="请输入商品描述，允许最多300个字符" :maxlength=300></Input>
          </FormItem>
        </div>
        <div class="mt20 bgf">
          <p class=""><span class="line"></span><span class="ml15 pf">商品长图</span><i class="ml10">单张图片推荐720*1200；如果图片较长请剪切为多张图片</i></p>
          <FormItem :label-width="0" style="padding-left: 20px">
            <upload-revise ref="editLargeImg" :upload-url="uploadUrl" :length="20" con-width="100%" :default-list="largeImgDefault" :list-value="isShowLarge" v-on:success-callback="largeImgSuccess" v-on:remove-callback="largeImgRmove" v-on:position-callback="largePositionChange"></upload-revise>
          </FormItem>
        </div>
        <div class="mt20 bgf">
          <p class=""><span class="line"></span><span class="ml15 pf"></span>包装清单</p>
          <FormItem :label-width="0" style="width: 75%;padding-left: 30px" prop="packingList">
            <Input type="textarea" v-model="editData.packingList" placeholder="请仔细填写商品包装清单，并以“，”隔开。例：手机×1，耳机×1，充电器×1，允许最多300个字符" :maxlength=300></Input>
          </FormItem>
        </div>
        <div class="mt20 bgf">
          <p class=""><span class="line"></span><span class="ml15 pf">售后服务</span><span><Button icon="md-add" type="primary" size="small" class="ml30" ghost @click="addService">添加</Button></span></p>
          <FormItem :label-width="0" style="width: 100%"
                    v-for="(item,index) in saleServiceList"
                    :key="'service' + index"
                    v-if="item.status"
          >
            <Row style="padding-left: 30px">
              <Col span="1" class="mt30">
                <Button shape="circle" icon="md-close" size="small" @click="deleteService(index)"></Button>
              </Col>
              <Col span="4">
                <FormItem label="服务标题"  :label-width="70" style="width: 100%" label-position="top">
                  <Input v-model="item.title"></Input>
                </FormItem>
              </Col>
              <Col span="14" class="ml30">
                <FormItem label="服务内容" :label-width="70" style="width: 100%" label-position="top">
                  <Input type="textarea" v-model="item.content" :autosize="true" :rows="3" style="width: 100%;"></Input>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem class="mt50">
            <Button type="success" size="large" @click="submitEditProduct" :loading="spinLoading">提交</Button>
            <Button size="large" @click="cancelEditPro">取消</Button>
          </FormItem>
        </div>
      </Form>
      <!--新增规格参数弹框-->
      <Modal
        title="新增规格参数"
        v-model="addParams"
        :loading="modalLoading"
        :mask-closable = "false"
        ref="addParams"
        @on-ok="confirmAddParams"
        @on-cancel="cancelAdd"
        @on-visible-change="changModal"
      >
        <Form ref="specsParamsForm" :model="specsParamsForm" :rules="paramRules" :label-width="100">
          <FormItem label="参数类型：" prop="paramTitle">
            <Input v-model="specsParamsForm.paramTitle" placeholder="请输入参数标题，允许最多6个字符" :maxlength=6></Input>
          </FormItem>
          <FormItem label="参数名称：" prop="paramName">
            <Input v-model="specsParamsForm.paramName" placeholder="请输入参数标题，允许最多7个字符" :maxlength=7></Input>
          </FormItem>
          <FormItem label="参数内容：" prop="paramCon">
            <Input v-model="specsParamsForm.paramCon" placeholder="请输入参数内容，允许最多20个字符" :maxlength=20></Input>
          </FormItem>
        </Form>
        <p class="text-center">例：参数类型（外观），参数名称（机身尺寸），参数内容（177.00mm）</p>
      </Modal>
    </div>
    <!--提示弹框-->
    <Modal
      title="提示"
      v-model="saveTip"
      :mask-closable = "false"
    >
      <p ref="saveTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
    <!--成功弹框-->
    <Modal
      title="提示"
      v-model="saveSuccess"
      :mask-closable = "false"
    >
      <p ref="saveSuccess"></p>
      <div slot="close"></div>
      <div slot="footer">
        <Button type="success"  @click="goList">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  export default {
    name: "productEdit",
    data () {
      const validatePrice = (rule, value, callback) => {
        if (value >= this.editData.goodsPrice) {
          callback(new Error('实际售价必须小于市场指导价'));
        } else {
          callback();
        }
      };
      return {
        loading:false,
        uploadUrl:base.baseUrl.serviceOne + '/documents/saveFile',
        goodsId:'',
        spinLoading:false,
        isPhone:false,
        isHas:false,
        addParams:false,
        modalLoading:true,
        isShowMain:false,
        isShowLarge:false,
        saveTip:false,
        saveSuccess:false,
        firstLevelList:[],
        secondLevelList:[],
        specsParamsList:[],
        stockList:[],
        saleServiceList:[],
        saleTypeList:[
          {
            value:0,
            label:'可购买'
          },
          {
            value:1,
            label:'展示'
          }
        ],
        mainImgDefault:[],
        largeImgDefault:[],
        editData:{
          userId:'',
          id:'', //商品id
          shopId:'', //商店id  登录之后获取
          goodsName:'', //商品名称
          // deliveryService:'', //配送服务
          firstLevel:'',//一级分类，做验证用
          goodTypeId:'', //商品二级分类id
          guidePrice:'', //市场指导价
          goodsPrice:null, //商品原价
          integralPrice:null, //实际售价
          freight:null, //快递费用
          maxDeductionIntegral:'', //所需积分
          //presentIntegral:'', //赠送积分
          goodsStandard:'', //商品规格库存
          imgstr:'', //商品主图
          imgstrbanner:'', //商品长图
          goodsDesc:'', //商品描述
          packingList:'', //包装清单
          afterService:'', //售后服务
          specificParam:'', //非手机规格参数
          saleType:'', //销售类型
          goodsServiceRate:null, //商品管理费
          goodsProfitId:null,//管理费id
          modelNumber:'',//型号
          type:'2',
          /*手机规格参数*/
          phoneId:'',//手机规格模板id
          brand:'',//品牌
          runRam:'',//运行内存
          bodyMemory:'',//机身内存
          modelNumberPhone:'',//手机型号
          marketTime:'',//上市时间
          systemVersion:'',//系统版本
          rearCamera:'',//后摄像头像素
          cameraNum:'',//摄像头数量
          color:'',//机身颜色
          screenSize:'',//屏幕尺寸
          cpuModel:'',//cpu型号
          cpuBrand:'',//cpu品牌
          bodyWidth:'',//机身宽度
          bodyHeight:'',//机身厚度
          bodyWeight:'',//机身重量
          bodyLength:'',//机身长度
          doubleCardModel:'',//双卡机类型
          simSize:'',//sim卡尺寸
          fourNetworkType:'',//4g网络制式
          threeNetworkType:'',//3g网络制式
          twoNetworkType:'',//2g网络制式
        },
        rules:{
          goodsName:[
            {required: true, message: '请填写商品名称'},
          ],
          modelNumber:[
            {required: true, message: '请填写商品型号'},
          ],
          firstLevel:[
            {required: true, message: '请选择一级分类'},
          ],
          goodTypeId:[
            {required: true, message: '请选择二级分类'},
          ],
          brand:[
            {required: true, message: '请填写品牌'},
          ],//品牌
          runRam:[
            {required: true, message: '请填写运行内存'},
          ],//运行内存
          bodyMemory:[
            {required: true, message: '请填写机身内存'},
          ],//机身内存
          modelNumberPhone:[
            {required: true, message: '请填写手机型号'},
          ],//手机型号
          marketTime:[
            {required: true, message: '请填写上市时间'},
          ],//上市时间
          systemVersion:[
            {required: true, message: '请填写系统版本'},
          ],//系统版本
          rearCamera:[
            {required: true, message: '请填写后摄像头像素'},
          ],//后摄像头像素
          cameraNum:[
            {required: true, message: '请填写摄像头数量'},
          ],//摄像头数量
          color:[
            {required: true, message: '请填写机身颜色'},
          ],//机身颜色
          screenSize:[
            {required: true, message: '请填写屏幕尺寸'},
          ],//屏幕尺寸
          cpuModel:[
            {required: true, message: '请填写cpu型号'},
          ],//cpu型号
          cpuBrand:[
            {required: true, message: '请填写cpu品牌'},
          ],//cpu品牌
          bodyWidth:[
            {required: true, message: '请填写机身宽度'},
          ],//机身宽度
          bodyHeight:[
            {required: true, message: '请填写机身厚度'},
          ],//机身厚度
          bodyWeight:[
            {required: true, message: '请填写机身重量'},
          ],//机身重量
          bodyLength:[
            {required: true, message: '请填写机身长度'},
          ],//机身长度
          doubleCardModel:[
            {required: true, message: '请填写双卡机类型'},
          ],//双卡机类型
          simSize:[
            {required: true, message: '请填写sim卡尺寸'},
          ],//sim卡尺寸
          fourNetworkType:[
            {required: true, message: '请填写4g网络制式'},
          ],//4g网络制式
          threeNetworkType:[
            {required: true, message: '请填写3g网络制式'},
          ],//3g网络制式
          twoNetworkType:[
            {required: true, message: '请填写2g网络制式'},
          ],//2g网络制式
          guidePrice:[
            {required: true, message: '请填写市场指导价'},
          ], //市场指导价
          goodsPrice:[
            {required: true, message: '请填写商品原价'},
          ], //商品原价
          integralPrice:[
            {required: true, message: '请填写实际售价'},
            {validator:validatePrice}
          ], //实际售价
          freight:[
            {required: true, message: '请填写快递费用'},
          ], //快递费用
          saleType:[
            {required: true, message: '请选择销售类型'},
          ], //销售类型
          goodsServiceRate:[
            {required: true, message: '请填写商品管理费'},
            { message: '请填写1-99之间的整数', pattern:/^\+?[1-9][0-9]*$/}
          ], //商品管理费
          goodsDesc:[
            {required: true, message: '请填写商品描述'},
          ],
          packingList:[
            {required: true, message: '请填写包装清单'},
          ],
        },
        specsParamsForm:{
          paramTitle:'',
          paramName:'',
          paramCon:'',
        },
        paramRules:{
          paramTitle:[
            {required: true, message: '请填写参数类型'},
          ],
          paramName:[
            {required: true, message: '请填写参数名称'},
          ],
          paramCon:[
            {required: true, message: '请填写参数内容'},
          ]
        },

      }
    },
    mounted () {
      this.editData.userId  = sessionStorage.getItem('userId');
      this.editData.shopId = sessionStorage.getItem('shopId');
      this.goodsId = this.$route.query.id;
      this.getGoodsMessage();
      this.getSaleService();
    },
    methods:{
      //获取一级分类
      getFirstLevel:function () {
        axios.ProductFirstClass()
          .then(res => {
            //console.log(res);
            this.firstLevelList = res;
          })
          .catch(error => {
            console.log(error);
          })
      },
      getSecondLevel:function (value) {
        if (value && value !== 'undefined') {
          let label = value.label.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
          this.isPhone = label === '手机数码';
          this.isHas = label === '手机数码';
          this.getSec(value.value);
        } else {
          this.secondLevelList = [];
          this.isPhone = false;
          this.isHas = false;
        }
      },
      changeHas:function (value) {
        this.specsParamsList = [];
        if (this.isPhone) {
          this.isHas = this.isPhone;
        } else {
          this.isHas = !!(value && value !== 'undefined');
          //获取其他类型的规格参数
         this.getParamsBySec();
        }
      },
      //获取二级分类
      getSec:function (id) {
        axios.ProductSecondClass({parentId:id,flagId:-1})
          .then(res => {
            this.secondLevelList = res;
          })
          .catch(error => {console.log(error)})
      },
      //根据二级分类查询规格参数
      getParamsBySec:function () {
        axios.ProductGetParams({goodsTypeId:this.editData.goodTypeId,goodsId:this.goodsId})
          .then(res => {
            // console.log(res);
            if (res.code === '0' && res.data) {
              this.isHas = true;
              res.data.forEach(item => {
                let tit = item.title;
                let param = item.specific;
                let list = [];
                param.forEach(it => {
                  list.push({
                    name:it.name,
                    value:it.value,
                    id:it.id
                  });
                });
                this.specsParamsList.push({
                  title:tit,
                  list:list
                })
              });
              //console.log(this.specsParamsList)
            }
          })
          .catch(error => {console.log(error)})
      },
      //获取商品详情
      getGoodsMessage:function () {
        this.loading = true;
        axios.ProductDetail({id:this.goodsId})
          .then(res => {
            //console.log(res);
            this.loading = false;
            this.isShowMain = true;
            this.isShowLarge = true;
            this.isPhone = res.data.firstClassLevel === '手机数码';
            this.editData.id = res.data.id;
            this.editData.goodsName = res.data.goodsName;
            this.editData.modelNumber = res.data.modelNumber;
            this.editData.firstLevel = parseInt(res.data.firstClassId);
            this.editData.goodTypeId = parseInt(res.data.goodsTypeId);
            this.editData.guidePrice = res.data.guidePrice;
            this.editData.goodsPrice = res.data.goodsPrice;
            this.editData.integralPrice = res.data.integralPrice;
            this.editData.maxDeductionIntegral = res.data.maxDeductionIntegral;
            this.editData.freight = res.data.freight;
            this.editData.goodsServiceRate = res.data.goodsProfitDistribution.goodsServiceRate;
            this.editData.goodsProfitId = res.data.goodsProfitDistribution.id;
            this.editData.saleType = res.data.saleType;
            res.data.goodsSpecifications.forEach(item => {
              this.stockList.push({
                status:1,
                specs:item.typeName,
                stock:item.inStock,
                id:item.id
              })
            });
            let mainArr = [];
            let largeArr = [];
            res.data.wImgs.forEach(item => {
              this.mainImgDefault.push({url:item.imgUrl,status:'finished'});
              mainArr.push(item.imgUrl);
            });
            res.data.goodsBannerImgList.forEach(item => {
              this.largeImgDefault.push({url:item.imgUrl,status:'finished'})
              largeArr.push(item.imgUrl);
            });
            this.editData.imgstr = mainArr.join();
            this.editData.imgstrbanner = largeArr.join();
            this.editData.goodsDesc = res.data.goodsDesc;
            this.editData.packingList = res.data.packingList;
            //手机数码参数
            // phoneId:'',//手机规格模板id
            let arr = Object.keys( res.data.goodsPhoneParam);
            if (arr.length !== 0) {
              this.editData.brand = res.data.goodsPhoneParam.brand;//品牌
              this.editData.runRam = res.data.goodsPhoneParam.runRam;//运行内存
              this.editData.bodyMemory = res.data.goodsPhoneParam.bodyMemory;//机身内存
              this.editData.modelNumberPhone = res.data.goodsPhoneParam.modelNumber;//手机型号
              this.editData.marketTime = res.data.goodsPhoneParam.marketTime;//上市时间
              this.editData.systemVersion = res.data.goodsPhoneParam.systemVersion;//系统版本
              this.editData.rearCamera = res.data.goodsPhoneParam.rearCamera;//后摄像头像素
              this.editData.cameraNum = res.data.goodsPhoneParam.cameraNum;//摄像头数量
              this.editData.color = res.data.goodsPhoneParam.color;//机身颜色
              this.editData.screenSize = res.data.goodsPhoneParam.screenSize;//屏幕尺寸
              this.editData.cpuModel = res.data.goodsPhoneParam.cpuModel;//cpu型号
              this.editData.cpuBrand = res.data.goodsPhoneParam.cpuBrand;//cpu品牌
              this.editData.bodyWidth = res.data.goodsPhoneParam.bodyWidth;//机身宽度
              this.editData.bodyHeight = res.data.goodsPhoneParam.bodyHeight;//机身厚度
              this.editData.bodyWeight = res.data.goodsPhoneParam.bodyWeight;//机身重量
              this.editData.bodyLength = res.data.goodsPhoneParam.bodyLength;//机身长度
              this.editData.doubleCardModel = res.data.goodsPhoneParam.doubleCardModel;//双卡机类型
              this.editData.simSize = res.data.goodsPhoneParam.simSize;//sim卡尺寸
              this.editData.fourNetworkType = res.data.goodsPhoneParam.fourNetworkType;//4g网络制式
              this.editData.threeNetworkType = res.data.goodsPhoneParam.threeNetworkType;//3g网络制式
              this.editData.twoNetworkType = res.data.goodsPhoneParam.twoNetworkType;//2g网络制式
            }
            this.getFirstLevel();
            this.getSec(this.editData.firstLevel);
            this.getParamsBySec();
          })
          .catch(error => {console.log(error)})
      },
      //获取售后服务清单
      getSaleService:function () {
        axios.ProductSaleServiceMessage({shopId:this.editData.shopId,goodsId:this.goodsId})
          .then(res => {
            //console.log(res);
            res.data.forEach(item => {
              this.saleServiceList.push({
                title:item.title,
                content:item.content,
                id:item.id,
                status:1
              })
            })
          })
          .catch(error => {console.log(error)})
      },
      confirmAddParams:function () {
        this.$refs.specsParamsForm.validate(valid => {
          let isNew = false;
          if (valid) {
            if (this.specsParamsList.length === 0) {
              this.specsParamsList.push({
                title:this.specsParamsForm.paramTitle,
                list:[{
                  name:this.specsParamsForm.paramName,
                  value:this.specsParamsForm.paramCon,
                  id:null
                }
                ]
              });
            } else {
              for (let i = 0;i < this.specsParamsList.length;i++){
                let t = this.specsParamsList[i];
                if (t.title === this.specsParamsForm.paramTitle) {
                  t.list.push({
                    name:this.specsParamsForm.paramName,
                    value:this.specsParamsForm.paramCon,
                    id:null
                  });
                  isNew = false;
                  break;
                } else {
                  isNew = true
                }
              }
              if (isNew) {
                this.specsParamsList.push({
                  title:this.specsParamsForm.paramTitle,
                  list:[{
                    name:this.specsParamsForm.paramName,
                    value:this.specsParamsForm.paramCon,
                    id:null
                  }
                  ]
                });
              }
            }
            this.addParams = false;
          } else {
            this.okNextTick();
          }
        })
      },
      cancelAdd:function () {
        this.$refs.specsParamsForm.resetFields();
      },
      changModal:function (value) {
        if (!value) {
          this.$refs.specsParamsForm.resetFields();
        }
      },
      okNextTick: function () {
        this.modalLoading = false;
        this.$nextTick(() => {
          this.modalLoading = true;
        });
      },
      deleParams:function (index,ind) {
        this.specsParamsList[index].list.splice(ind,1);
        if (this.specsParamsList[index].list.length === 0) {
          this.specsParamsList.splice(index,1)
        }
      },
      computeIntegral:function () {
        if (this.editData.goodsPrice !== '' && this.editData.integralPrice !== '') {
          axios.ProductIntegral({goodsPrice:this.editData.goodsPrice,integralPrice:this.editData.integralPrice})
            .then(res => {
              // console.log(res);
              if (res.code === '0') {
                this.editData.maxDeductionIntegral = res.data;
              }
            })
            .catch(error => {console.log(error)})
        }
      },
      addSpecsStock:function () {
        this.stockList.push({
          specs:'',
          stock:'',
          status:1,
          id:null
        })
      },
      stockRemove:function (index) {
        this.stockList.splice(index,1);
      },
      mainImgSuccess:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.editData.imgstr = arr.join();
      },
      mainImgRmove:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.editData.imgstr = arr.join();
      },
      largeImgSuccess:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.editData.imgstrbanner = arr.join();
      },
      largeImgRmove:function (file,fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.editData.imgstrbanner = arr.join();
      },
      addService:function () {
        this.saleServiceList.push({
          title:'',
          content: '',
          id:null,
          status:1
        })
      },
      deleteService:function (index) {
        this.saleServiceList.splice(index,1);
      },
      submitEditProduct:function () {
        this.$refs.editData.validate(valid => {
          if (valid) {
            this.spinLoading = true;
            let paramArr= [];
            let stockArr = [];
            let saleArr = [];
            //遍历除手机外的规格参数
            this.specsParamsList.forEach(item => {
              item.list.forEach(i => {
                paramArr.push({
                  title:item.title,
                  name:i.name,
                  value:i.value,
                  id:i.id
                });
              });
            });
            this.editData.specificParam = JSON.stringify(paramArr);
            //遍历规格库存
            this.stockList.forEach(item => {
              if (item.specs !== '' && item.stock !== ''){
                stockArr.push({
                  specifications:item.specs,
                  inStock:item.stock,
                  id:item.id
                })
              }
            });
            if (stockArr.length === 0) {
              this.saveTip = true;
              this.$refs.saveTip.innerHTML = '至少填写一项规格库存！';
              return;
            } else {
              this.editData.goodsStandard = JSON.stringify(stockArr);
            }
            //遍历售后服务
            this.saleServiceList.forEach(item => {
              saleArr.push({
                title:item.title,
                content:item.content,
                id:item.id
              })
            });
            this.editData.afterService = JSON.stringify(saleArr);
            if (this.editData.imgstr === '') {
              this.saveTip = true;
              this.$refs.saveTip.innerHTML = '至少上传一张商品主图！';
              return;
            }
            if (this.editData.imgstrbanner === '') {
              this.saveTip = true;
              this.$refs.saveTip.innerHTML = '至少上传一张商品长图！';
              return;
            }
            axios.ProductSave(this.editData)
              .then(res => {
                console.log(res);
                if (res.code === '0') {
                  this.saveSuccess = true;
                  this.$refs.saveSuccess.innerHTML = '商品修改成功！';
                } else {
                  paramArr = [];
                  stockArr = [];
                  saleArr = [];
                  this.spinLoading = false;
                  this.saveTip = true;
                  this.$refs.saveTip.innerHTML = res.message;
                }
              })
              .catch(error => {
                console.log(error);
                paramArr = [];
                stockArr = [];
                saleArr = [];
                this.spinLoading = false;
                this.saveTip = true;
                this.$refs.saveTip.innerHTML = '商品保存失败！';
              })
          }
        })
      },
      cancelEditPro:function () {
        this.$router.push({path:'/productManage'});
      },
      del:function () {
        this.saveTip = false;
      },
      goList:function () {
        this.$router.push({path:'/productManage'});
      },
      mainPositionChange:function (fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.editData.imgstr = arr.join();
      },
      largePositionChange:function (fileList) {
        let arr = [];
        fileList.forEach(item => {
          arr.push(item.url);
        });
        this.editData.imgstrbanner = arr.join();
      }
    }
  }
</script>

<style lang="less" scoped>
  .bread-container {
    height: 40px;
    line-height: 40px;
    background-color: #ffffff;
    padding-left: 10px;
  }
  .edit-container{
    .edit-form{
      .bgf{
        background-color: #ffffff;
      }
      p{
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
        background-color:#ffffff;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(241,241,241,1);
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        .pf{
          font-size:16px;
          font-weight:400;
          color:rgba(51,51,51,1);
        }
        .line{
          display: inline-block;
          width: 4px;
          height: 20px;
          background-color:  #417AFC;
          margin-top: 20px;
        }
      }
    }
  }
</style>
