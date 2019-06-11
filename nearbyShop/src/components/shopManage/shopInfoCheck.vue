<template>
  <div class="shopInfoCheck-container">
    <div class="basic-container">
      <div class="default-tit">
        <span class="line"></span>
        <span class="pf ml15">基本信息</span>
        <span class="ml30"><Button type="primary" icon="ios-checkmark" size="small" ghost :loading="basicLoading" @click="saveBasic">保存</Button></span>
      </div>
      <div >
        <Form :model="basicData" ref="basicData" :rules="basicRules" class="basicForm" label-position="top">
          <FormItem label="商户名称" class="ml30">
            <Input style="width: 250px" disabled v-model="basicData.shopName"></Input>
          </FormItem>
          <FormItem label="商户编码" class="ml30">
            <Input style="width: 250px" disabled v-model="basicData.shopNo"></Input>
          </FormItem>
          <FormItem label="入驻时间" class="ml30">
            <Input style="width: 250px" disabled v-model="basicData.createTime"></Input>
          </FormItem>
          <FormItem label="商户性质" class="ml30">
            <Select style="width: 250px;" disabled v-model="basicData.shopNature">
              <Option v-for="(item,index) in natureList" :key="'nature' + index" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="商户类型" class="ml30">
            <Input style="width: 250px" disabled v-model="basicData.shopTypeName"></Input>
          </FormItem>
          <FormItem label="玄乐账号" class="ml30">
            <Input style="width: 250px" disabled v-model="basicData.loginName"></Input>
          </FormItem>
          <FormItem label="联系人" class="ml30">
            <Input style="width: 250px" v-model="basicData.linkman"></Input>
          </FormItem>
          <!--<FormItem label="联系电话1" class="ml30">-->
            <!--<Input style="width: 250px" v-model="basicData.mobile"></Input>-->
          <!--</FormItem>-->
          <!--<FormItem label="联系电话2" class="ml30">-->
            <!--<Input style="width: 250px" v-model="basicData.mobile2"></Input>-->
          <!--</FormItem>-->
          <FormItem label="营业时间" class="ml30" prop="">
            <TimePicker type="timerange" :editable="false" :value="busTime" separator="~"  format="HH:mm" @on-change="timeChange" @on-clear="timeClear" style="width: 250px;"></TimePicker>
            <!--<Input style="width: 250px" v-model="basicData.businessHours"></Input>-->
          </FormItem>
          <FormItem label="客服电话" class="ml30">
            <Input style="width: 250px" v-model="basicData.service_phone"></Input>
          </FormItem>
          <FormItem label="推荐人" class="ml30" v-if="basicData.shopNature == 1">
            <Input style="width: 250px" v-model="basicData.specialMan"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="position-container mt20">
      <div class="default-tit">
        <span class="line"></span>
        <span class="pf ml15">位置信息</span>
      </div>
      <div>
        <Form class="posForm" label-position="top">
          <FormItem label="商户地址" class="ml30">
            <Input style="width: 250px" v-model="locationData.adressDeatil"></Input>
          </FormItem>
          <FormItem label="地址坐标" class="ml30">
            <Input style="width: 400px" v-model="locationData.tude"></Input>
          </FormItem>
        </Form>
      </div>
      <div class="default-pad" id="mapContainer">
        <el-amap ref="map" vid="amapDemo" :amap-manager="aMapManager" :center="center" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
          <el-amap-marker vid="component-marker" :position="componentMarker.position"></el-amap-marker>
        </el-amap>
      </div>
    </div>
    <div class="rang-container mt50">
      <div class="default-tit">
        <span class="line"></span>
        <span class="pf ml15">经营范围</span>
        <span class="ml30"><Button type="primary" icon="ios-checkmark" size="small" ghost :loading="rangLoading" @click="saveRange">保存</Button></span>
      </div>
      <div class="default-pad">
        <Input type="textarea" v-model="rangData.shopBusinessScope"></Input>
      </div>
    </div>
    <div class="item-container mt20">
      <div class="default-tit">
        <span class="line"></span>
        <span class="pf ml15">商户特色</span>
        <span class="ml30"><Button type="primary" icon="ios-checkmark" size="small" ghost :loading="itemLoading" @click="saveItem">保存</Button></span>
      </div>
      <div class="default-pad">
        <Input type="textarea" v-model="itemData.shopFeature"></Input>
      </div>
    </div>
    <div class="describe-container mt20">
      <div class="default-tit">
        <span class="line"></span>
        <span class="pf ml15">商户描述</span>
        <span class="ml30"><Button type="primary" icon="ios-checkmark" size="small" ghost :loading="descLoading" @click="saveDesc">保存</Button></span>
      </div>
      <div class="default-pad">
        <Input type="textarea" v-model="descData.storeDesc"></Input>
      </div>
    </div>
    <div class="label-container mt20">
      <div class="default-tit">
        <span class="line"></span>
        <span class="pf ml15">特色标签<Button type="primary" icon="ios-add" size="small" ghost class="ml30" @click="addLabel">添加</Button></span>
        <span class="ml30"><Button type="primary" icon="ios-checkmark" size="small" ghost :loading="labelLoading" @click="saveLabel">保存</Button></span>
      </div>
      <div class="default-pad label-detail">
        <div v-for="(item,index) in labelList" :key="'label' + index" class="ml30 mt10">
          <span><Input style="width: 200px;" v-model="item.label" placeholder="特色标签" :maxlength=5></Input></span>
          <span class="ml10"><Button shape="circle" icon="md-close" size="small" @click="removeLabel(index)"></Button></span>
        </div>
      </div>
    </div>
    <div class="image-container mt20">
      <div class="logo-container">
        <div class="default-tit">
          <span class="line"></span>
          <span class="pf ml15">商户Logo<i class="fs12 ml10">长宽比例为1:1</i></span>
          <span class="ml30"><Button type="primary" icon="ios-checkmark" size="small" ghost @click="saveLogo" :loading="logoLoading">保存</Button></span>
        </div>
        <div class="default-pad ">
          <upload-revise ref="shopLogo" :upload-url="uploadUrl" :length="1" con-width="100%" :default-list="logoDefault" :list-value="isShowLogo" v-on:success-callback="logoSuccess" v-on:remove-callback="logoRemove"></upload-revise>
        </div>
      </div>
      <div class="bg-container">
        <div class="default-tit">
          <span class="line"></span>
          <span class="pf ml15">商户背景图<i class="fs12 ml10">长宽比例为1:1</i></span>
          <span class="ml30"><Button type="primary" icon="ios-checkmark" size="small" ghost @click="saveBg" :loading="bgLoading">保存</Button></span>
        </div>
        <div class="default-pad">
          <upload-revise ref="shopBg" :upload-url="uploadUrl" :length="1" con-width="100%" :default-list="bgDefault" :list-value="isShowBg" v-on:success-callback="bgSuccess" v-on:remove-callback="bgRemove"></upload-revise>
        </div>
      </div>
    </div>
    <div class="photo-container mt20">
      <div class="default-tit">
        <span class="line"></span>
        <span class="pf ml15">商家相册</span>
        <span class="ml30"><Button type="primary" icon="ios-checkmark" size="small" ghost @click="savePhoto" :loading="photoLoading">保存</Button></span>
      </div>
      <div class="default-pad">
        <upload-revise ref="shopPhoto" :upload-url="uploadUrl" :length="50" con-width="100%" :default-list="photoDefault" :list-value="isShowPhoto" v-on:success-callback="photoSuccess" v-on:remove-callback="photoRemove" v-on:position-callback="photoPosChange"></upload-revise>
      </div>
    </div>
    <!--提示弹框-->
    <Modal
      title="提示"
      v-model="shopTip"
      :mask-closable = "false"
    >
      <p ref="shopTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";
  import * as base from '../../axios/base';
  import { aMapManager } from 'vue-amap';
export default {
  name:'shopInfoCheck',
  data(){
    return {
      shopTip:false,
      uploadUrl:base.baseUrl.serviceOne + '/documents/saveFile',
      shopId:'',
      basicLoading:false,
      busTime:[],
      basicData:{
        id:'',//商户Id
        shopName:'',//商户名称
        shopNo:'',//商品编码
        createTime:'',//入住时间
        shopNature:'',//商户性质
        shopTypeName:'',//商户类型名称
        loginName:'',//玄乐账号
        linkman:'',//联系人
        businessHours:'',//营业时间
        mobile:'',//联系电话1
        mobile2:'',//联系电话2
        service_phone:'',//客服电话
        specialMan:'',//推荐人
      },
      basicRules:{

      },
      locationData:{
        adressDeatil:'',
        tude:'',
      },
      rangLoading:false,
      rangData:{
        id:'',
        shopBusinessScope:'',
      },
      itemLoading:false,
      itemData:{
        id:'',
        shopFeature:'',
      },
      descLoading:false,
      descData:{
        id:'',
        storeDesc:'',
      },
      labelLoading:false,
      labelData:{
        id:'',
        featuredLabel:'',
      },
      labelList:[],
      natureList:[
        {
          value:1,
          label:'附近小店'
        },
        {
          value:2,
          label:'全球集市'
        }
      ],
      //logo
      logoLoading:false,
      logoDefault:[],
      isShowLogo:false,
      logoData:{
        id:'',
        imgStr:'',
        shopNature:'',
      },
      //背景图
      bgLoading:false,
      bgDefault:[],
      isShowBg:false,
      bgData:{
        id:'',
        imgStr:'',
      },
      //相册
      photoLoading:false,
      photoDefault:[],
      isShowPhoto:false,
      photoData:{
        id:'',
        imgStr:'',
      },
      map:null,
      aMapManager,
      zoom: 18,
      center: [parseFloat(sessionStorage.getItem('longitude')),parseFloat(sessionStorage.getItem('latitude'))],
      events: {},
      plugin: ['ToolBar', {
        pName: 'MapType',
        defaultType: 0,
        events: {
          init(o) {
          }
        }
      }],
      componentMarker: {
        position: [parseFloat(sessionStorage.getItem('longitude')),parseFloat(sessionStorage.getItem('latitude'))]
      },
    }
  },
  mounted () {
    this.shopId = sessionStorage.getItem('shopId');
    this.getShopMessage();
  },
  methods: {
    addLabel:function () {
      if (this.labelList.length > 2) {
        this.$Message.warning('最多添加3个标签');
        return;
      }
      this.labelList.push({
        label:''
      })
    },
    removeLabel:function (index) {
      this.labelList.splice(index,1);
    },
    //获取小店信息
     getShopMessage:function () {
      this.labelList = [];
      this.logoDefault = [];
      this.bgDefault = [];
      this.photoDefault = [];
      this.busTime = [];
      axios.ShopOringalMessage({id:this.shopId})
        .then(res => {
          if (res.code === '0') {
            let shop = res.data.shop;
            this.basicData.id = shop.id;
            this.basicData.shopName = shop.shopName;
            this.basicData.shopNo = shop.shopNo;
            this.basicData.createTime = this.$tool.TransChinaTime(shop.createTime);
            this.basicData.shopNature = shop.shopNature;
            this.basicData.shopTypeName = shop.shopTypeName;
            this.basicData.loginName = shop.loginName;
            this.basicData.linkman = shop.linkman;
            this.basicData.mobile = shop.mobile;
            this.basicData.mobile2 = shop.mobile2;
            shop.businessHours.split('~').forEach(item => {
              this.busTime.push(item);
            });
            this.basicData.businessHours = shop.businessHours;
            this.basicData.service_phone = shop.service_phone;
            this.basicData.specialMan = shop.specialMan;
            this.locationData.adressDeatil = shop.adressDeatil;
            this.locationData.tude = shop.longitude + ' , ' + shop.latitude;
            this.rangData.shopBusinessScope = shop.shopBusinessScope;
            this.itemData.shopFeature = shop.shopFeature;
            this.descData.storeDesc = shop.storeDesc;
            res.data.shopLabelList.forEach(item => {
              this.labelList.push({
                label:item.labelName
              })
            });
            this.logoData.shopNature = shop.shopNature;
            this.logoData.imgStr = shop.shopLogo;
            this.isShowLogo = true;
            if (shop.shopLogo && shop.shopLogo !== '') {
              this.logoDefault.push({url:shop.shopLogo,status:'finished'});
            } else {
              this.logoDefault = [];
            }
            this.bgData.imgStr = shop.backgroundImage;
            this.isShowBg = true;
            if (shop.backgroundImage && shop.backgroundImage !== '') {
              this.bgDefault.push({url:shop.backgroundImage,status:'finished'});
            } else {
              this.bgDefault = [];
            }
            this.isShowPhoto = true;
            let imgArr = [];
            if (res.data.shopImgList.length > 0) {
              res.data.shopImgList.forEach(item => {
                this.photoDefault.push({url:item.imgUrl,status:'finished'});
                imgArr.push(item.imgUrl);
              });
              this.photoData.imgStr = imgArr.join();
            } else {
              this.photoDefault = [];
            }

          }
        })
        .catch(error => {console.log(error)})
    },
    del:function () {
      this.shopTip = false;
    },
    saveBasic:function () {
      if (this.basicData.linkman === '') {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '请填写联系人';
        return;
      }
      if (this.basicData.businessHours === '' || this.$tool.DeleteSpaceFromStr(this.basicData.businessHours) === '~') {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '请选择营业时间';
        return;
      }
      let arr = this.basicData.businessHours.split('~');
      if (this.$tool.DeleteSpaceFromStr(arr[0]) == this.$tool.DeleteSpaceFromStr(arr[1])) {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '营业开始时间不能和结束时间一样！';
        return;
      }
      if (this.basicData.service_phone === '') {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '请填写客服电话';
        return;
      }
      this.basicData.id = this.shopId;
      this.basicLoading = true;
      axios.ShopUpdateBasic({
        id:this.basicData.id,
        linkman:this.basicData.linkman,
        businessHours:this.basicData.businessHours,
        mobile:this.basicData.mobile,
        mobile2:this.basicData.mobile2,
        service_phone:this.$tool.DeleteSpaceFromStr(this.basicData.service_phone)
      })
        .then(res => {
          if (res.code === '0') {
            this.basicLoading = false;
            this.shopTip = true;
            this.$refs.shopTip.innerHTML = '保存成功！';
            this.getShopMessage();
          }
        })
        .catch(error => {console.log(error)})
    },
    saveRange:function () {
      if (this.$tool.DeleteSpaceFromStr(this.rangData.shopBusinessScope) === '') {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '经营范围不能为空！';
        return;
      }
      this.rangData.id = this.shopId;
      this.rangLoading = true;
      axios.ShopUpdateRange(this.rangData)
        .then(res => {
          if (res.code === '0') {
            this.rangLoading = false;
            this.shopTip = true;
            this.$refs.shopTip.innerHTML = '保存成功！';
            this.getShopMessage();
          }
        })
        .catch(error => {console.log(error)})
    },
    saveItem:function () {
      if (this.$tool.DeleteSpaceFromStr(this.itemData.shopFeature) === '') {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '商户特色不能为空！';
        return;
      }
      this.itemData.id = this.shopId;
      this.itemLoading = true;
      axios.ShopUpdateFeature(this.itemData)
        .then(res => {
          if (res.code === '0') {
            this.itemLoading = false;
            this.shopTip = true;
            this.$refs.shopTip.innerHTML = '保存成功！';
            this.getShopMessage();
          }
        })
        .catch(error => {console.log(error)})
    },
    saveDesc:function () {
      if (this.$tool.DeleteSpaceFromStr(this.descData.storeDesc) === '') {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '商户描述不能为空！';
        return;
      }
      this.descData.id = this.shopId;
      this.descLoading = true;
      axios.ShopUpdateDesc(this.descData)
        .then(res => {
          if (res.code === '0') {
            this.descLoading = false;
            this.shopTip = true;
            this.$refs.shopTip.innerHTML = '保存成功！';
            this.getShopMessage();
          }
        })
        .catch(error => {console.log(error)})
    },
    saveLabel:function () {
      this.labelData.id = this.shopId;
      let arr = [];
      this.labelList.forEach(item => {
        if (this.$tool.DeleteSpaceFromStr(item.label) !== ''){
          arr.push(item.label);
        }
      });
      if (arr.length === 0) {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '特色标签不能为空！';
        return;
      }
      this.labelData.featuredLabel = arr.join();
      this.labelLoading = true;
      axios.ShopUpdateLabel(this.labelData)
        .then(res => {
          if (res.code === '0') {
            this.labelLoading = false;
            this.shopTip = true;
            this.$refs.shopTip.innerHTML = '保存成功！';
            this.getShopMessage();
          }
        })
        .catch(error => {console.log(error)})
    },
    logoSuccess:function (file,fileList) {
      this.logoData.imgStr = file.url;
    },
    logoRemove:function (file,fileList) {
      this.logoData.imgStr = '';
    },
    saveLogo:function () {
      this.logoData.id = this.shopId;
      if (this.logoData.imgStr === '') {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = 'logo不能为空！';
        return;
      }
      this.logoLoading = true;
      axios.ShopUpdateLogo(this.logoData)
        .then(res => {
          if (res.code === '0') {
            this.logoLoading = false;
            this.shopTip = true;
            this.$refs.shopTip.innerHTML = '保存成功！';
            this.getShopMessage();
          }
        })
        .catch(error => {console.log(error)})
    },
    bgSuccess:function (file,fileList) {
      this.bgData.imgStr = file.url;
    },
    bgRemove:function (file,fileList) {
      this.bgData.imgStr = '';
    },
    saveBg:function () {
      this.bgData.id = this.shopId;
      if (this.bgData.imgStr === '') {
        this.shopTip = true;
        this.$refs.shopTip.innerHTML = '背景图不能为空！';
        return;
      }
      this.bgLoading = true;
      axios.ShopUpdateImage(this.bgData)
        .then(res => {
          if (res.code === '0') {
            this.bgLoading = false;
            this.shopTip = true;
            this.$refs.shopTip.innerHTML = '保存成功！';
            this.getShopMessage();
          }
        })
        .catch(error => {console.log(error)})
    },
    photoSuccess:function (file,fileList) {
      let arr = [];
      fileList.forEach(item => {
        arr.push(item.url);
      });
      this.photoData.imgStr = arr.join();
    },
    photoRemove:function (file,fileList) {
      let arr = [];
      fileList.forEach(item => {
        arr.push(item.url);
      });
      this.photoData.imgStr = arr.join();
    },
    savePhoto:function () {
      this.photoData.id = this.shopId;
      this.photoLoading = true;
      axios.ShopUpdatePgoto(this.photoData)
        .then(res => {
          if (res.code === '0') {
            this.photoLoading = false;
            this.shopTip = true;
            this.$refs.shopTip.innerHTML = '保存成功！';
            this.getShopMessage();
          }
        })
        .catch(error => {console.log(error)})
    },
    timeChange:function (value) {
      this.basicData.businessHours = value[0] + ' ~ ' + value[1];
    },
    timeClear:function () {
      this.basicData.businessHours = '';
    },
    photoPosChange:function (fileList) {
      let arr = [];
      fileList.forEach(item => {
        arr.push(item.url);
      });
      this.photoData.imgStr = arr.join();
    }
  }
}
</script>

<style lang="less" scoped>
.shopInfoCheck-container{
  padding-bottom: 20px;
  .default-tit{
    /*color: #fff;*/
    /*height: 40px;*/
    /*line-height: 40px;*/
    /*font-size: 16px;*/
    /*background-color: #808695;*/
    /*display: flex;*/
    /*flex-direction: row;*/
    /*justify-content: space-between;*/
    /*padding: 0 20px;*/
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
  .default-pad{
    padding: 20px;
    background-color: #ffffff;
  }
  .basic-container{
    background-color: #ffffff;
    .basicForm{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 20px;
    }
  }
  .position-container{
    background-color: #ffffff;
    .posForm{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 20px;
    }
  }
  .label-container{
    .label-detail{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
  }
  .image-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .logo-container,.bg-container{
      width: 49%;
      background-color: #ffffff;
    }
  }
}
  .amap-demo{
    height: 300px;
  }
</style>
<style>
  .ivu-input[disabled]{
    /*background-color: #ffffff!important;*/
    color: #333!important;
  }
  .ivu-select-disabled .ivu-select-selection{
    /*background-color: #ffffff!important;*/
    color: #333!important;
  }
  .ivu-input-number-disabled .ivu-input-number-input{
    /*background-color: #ffffff!important;*/
    color: #333!important;
    opacity: 100;
  }
</style>
