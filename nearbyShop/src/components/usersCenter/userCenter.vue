<template>
  <div class="user-container">
    <ul class="user-title">
      <li v-for="(item,index) in list" :key="index" :class="{active: checkIndex === index}" @click="toggleCategory(index)">{{item.nickname}}</li>
    </ul>
    <div v-if="checkIndex === 0" class="change-container">
      <Form :model="passwordData" ref="passwordData" :rules="passwordRules" :label-width="100">
        <FormItem label="旧密码" prop="oldPassword">
          <Input style="width: 200px;" v-model="passwordData.oldPassword"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
          <Input style="width: 200px;" v-model="passwordData.newPassword"></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="confirmPassword">
          <Input style="width: 200px;" v-model="passwordData.confirmPassword"></Input>
        </FormItem>
        <FormItem>
          <Button type="info" @click="savePwd" :loading="pwdLoading">修改密码</Button>
        </FormItem>
      </Form>
    </div>
    <div v-else class="service-container">
      <div style="padding-bottom: 20px;border-bottom: 1px solid rgba(241,241,241,1);" class="pos-re">
        <span style="width: 4px;height: 20px;background:rgba(65,122,252,1);display: inline-block;top: 5px;left: 0;" class="pos-ab"></span>
        <span class="ml15 fs16" style="color: rgba(51,51,51,1);font-weight: 400">通用售后服务模版</span>
        <Button  icon="md-add" type="primary" ghost @click="addService" class="ml30">添加</Button>
      </div>
      <div class="mt30">
        <Form>
          <FormItem :label-width="0" style="width: 100%"
                    v-for="(item,index) in saleServiceList"
                    :key="'service' + index"
          >
            <Row style="padding-left: 30px">
              <Col span="4">
                <FormItem label="服务标题："  :label-width="80" style="width: 100%" label-position="left">
                  <Input v-model="item.key" placeholder="请输入服务标题"></Input>
                </FormItem>
              </Col>
              <Col span="14" class="ml30">
                <FormItem label="服务内容：" :label-width="80" style="width: 100%" label-position="left">
                  <Input type="textarea" v-model="item.value" :autosize="true"  style="width: 100%;" placeholder="请输入服务内容"></Input>
                </FormItem>
              </Col>
              <Col span="1" class="mt30  ml15">
                <Button shape="circle" icon="md-close" size="small" @click="deleteService(index)"></Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem :label-width="70">
            <Button type="info" @click="saveService" :loading="serviceLoading">确定</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <!--提示弹框-->
    <Modal
      title="提示"
      v-model="centerTip"
      :mask-closable = "false"
    >
      <p ref="centerTip"></p>
      <div slot="footer">
        <Button type="info"  @click="del">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from "../../axios/axios";

  export default {
    name: "userCenter",
    data () {
      const pwdCheckValidate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (this.passwordData.newPassword != value) {
          callback(new Error('两次输入的新密码不一致'));
        } else {
          callback();
        }
      };
      return {
        shopId:'',
        checkIndex:0,
        pwdLoading:false,
        serviceLoading:false,
        centerTip:false,
        list:[
          {nickname:'修改密码'},
          {nickname:'售后服务'}
        ],
        passwordData:{
          userId:'',
          oldPassword:'',
          newPassword:'',
          confirmPassword:''
        },
        passwordRules:{
          oldPassword:[
            {required:true,message:'请输入旧密码'}
          ],
          newPassword:[
            {required:true,message:'请输入新密码'}
          ],
          confirmPassword:[
            {required:true,validator:pwdCheckValidate},
          ],
        },
        saleServiceList:[],
      }
    },
    mounted () {
      this.passwordData.userId = sessionStorage.getItem('userId');
      this.shopId = sessionStorage.getItem('shopId');
      this.getService();
    },
    methods:{
      toggleCategory:function (index) {
        this.checkIndex = index;
      },
      addService:function () {
        this.saleServiceList.push({
          id:null,
          key:'',
          value:''
        })
      },
      deleteService:function (index) {
        this.saleServiceList.splice(index,1);
      },
      savePwd:function () {
        this.$refs.passwordData.validate(valid => {
          if (valid) {
            this.pwdLoading = true;
            axios.CenterUpdatePassword(this.passwordData)
              .then(res => {
                this.pwdLoading = false;
                if (res.code === '0') {
                  this.centerTip = true;
                  this.$refs.centerTip.innerHTML = res.data;
                  this.$refs.passwordData.resetFields();
                } else {
                  this.centerTip = true;
                  this.$refs.centerTip.innerHTML = res.message;
                }
              })
              .catch(error => {console.log(error)})
          }
        })
      },
      //获取售后信息
      getService:function () {
        this.saleServiceList = [];
        axios.CenterGetService({shopId:this.shopId})
          .then(res => {
            res.forEach(item => {
              this.saleServiceList.push({
                id:item.id,
                key:item.title,
                value:item.content
              })
            });

          })
          .catch(error => {
            console.log(error);
          })
      },
      saveService:function () {
        this.serviceLoading = true;
        let arr = [];
        this.saleServiceList.forEach(item => {
          if (this.$tool.DeleteSpaceFromStr(item.key) !== '' && this.$tool.DeleteSpaceFromStr(item.value) !== '') {
            arr.push(item);
          }
        });
        axios.CenterSaveService({shopId:this.shopId,postData:JSON.stringify(arr),goodsId:''})
          .then(res => {
            if (res.code === '0') {
              this.serviceLoading = false;
              this.centerTip = true;
              this.$refs.centerTip.innerHTML = '保存成功！';
              this.getService();
            }
          })
          .catch(error => {console.log(error)})
      },
      del:function () {
        this.centerTip = false;
      }
    }
  }
</script>

<style lang="less" scoped>
.user-container{
  .user-title{
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
  .change-container{
    background-color: #fff;
    padding: 20px;
  }
  .service-container{
    background-color: #fff;
    padding: 20px;
  }
}
</style>

