
<template>
  <body id="poster">
    <el-form :class="this.active_style?'login-container':'login-container_sign_up'" label-position="left"
           label-width="0px">
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="登录" name="sign_in">
        <h3 class="login_title">登录</h3>
        <el-form-item>
        <el-input type="text" v-model="loginForm.username"
                  auto-complete="off" placeholder="账号" class="username_style"></el-input>
        </el-form-item>
        <el-form-item>
        <el-input type="password" v-model="loginForm.password"
                  auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
        <el-checkbox v-model="remember_me" class="remember_me_style" v-show="false">记住我</el-checkbox>
        <el-button type="primary" class="login_button_style" v-on:click="login">登录</el-button>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="注册" name="sign_up">
        <!-- <el-row :gutter="20">
        <el-col :span="12"><div>
          <el-form-item label='学号'>
          <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="学号"></el-input>
          </el-form-item>
        </div></el-col>
        <el-col :span="12"><div>
          <el-form-item>
          <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
        </div></el-col>
        </el-row> -->
        <h3 class="login_title">注册</h3>
        <el-steps :active="active" finish-status="success" style="margin-bottom:20px" align-center>
          <el-step title="填写基本信息"></el-step>
          <el-step title="设置密码"></el-step>
          <el-step title="填写附加信息"></el-step>
        </el-steps>
        <div v-if="active == 0">
          <el-form label-width="80px" :rules="basic_info_rules" :model="basicSignUpForm" ref="basicSignUpForm">
            <el-form-item prop="id" label="学号" class="sign_up_style">
              <el-input placeholder="请输入学号" v-model="basicSignUpForm.id"></el-input>
            </el-form-item>
            <el-form-item prop="department" label="所在学院" class="sign_up_style">
              <el-select v-model="basicSignUpForm.department" filterable placeholder="请选择所在学院" style="width: 370px;">
              <el-option
                v-for="item in department_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </el-form-item>
            <Vcode :show="vcode_isShow" @success="vcode_success" @close="vcode_close" />
            <el-form-item prop="mobile" label="手机号码" class="sign_up_style">
              <el-input placeholder="请输入手机号" v-model="basicSignUpForm.mobile"></el-input>
            </el-form-item>

            <el-form-item prop="verify_code" class="code" label="验证码">
              <el-input v-model="basicSignUpForm.verify_code" placeholder="请输入验证码" style="margin-right:4px;width: 227px;"></el-input>
              <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==false" style="float: right;">发送验证码
              </el-button>
              <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled==true" style="float: right;">{{btntxt}}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="active == 1">
          <el-form :model="passwordForm" :rules="password_rules" ref="passwordForm" label-width="100px">
            <el-form-item label="新密码" prop="password" class="input_style">
              <el-input v-model="passwordForm.password" placeholder="请输入新密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirm_password" class="input_style">
              <el-input v-model="passwordForm.confirm_password" placeholder="请确认新密码" type="password"></el-input>
            </el-form-item>
            <el-form-item label="密码强度">
              <password-strength v-model="passwordForm.password" style="padding-top: 10px;"></password-strength>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="active == 2">
            <el-form label-width="80px">
              <el-form-item label="昵称" class="input_style">
                <el-input v-model="additionForm.name" placeholder="使用昵称能让其他用户更方便地记住你"></el-input>
              </el-form-item>
              <el-form-item label="性别" class="input_style">
                <el-radio v-model="additionForm.sex" label="'male'">男</el-radio>
                <el-radio v-model="additionForm.sex" label="'female'">女</el-radio>
              </el-form-item>
              <el-form-item label="专业" class="input_style">
                <el-input v-model="additionForm.major"></el-input>
              </el-form-item>
              <el-form-item label="宿舍地址" class="input_style">
                <el-input v-model="additionForm.dormitory"></el-input>
              </el-form-item>
              <el-form-item label="QQ号" class="input_style">
                <el-input v-model="additionForm.qq_number"></el-input>
              </el-form-item>
            </el-form>
        </div>
        <el-button style="margin-top: 12px;float: right;" @click="next">{{nextButtonText}}</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-form>
  </body>
</template>


<script>
  import Vcode from 'vue-puzzle-vcode';
  import PasswordStrength from "./common/PasswordStrengthCheck";
  import UploadPicture from "./common/UploadPicture";
  export default {
    name: 'Login',
    components: { Vcode, PasswordStrength, UploadPicture},
    data () {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        responseResult: [],
        activeName:"sign_in",
        remember_me:false,
        nextButtonText:'下一步',

        active_style: true,
        active:0,
        
        //人机查验模块数据
        AI_check:true,
        vcode_isShow:false,

        //基本信息表单
        basicSignUpForm:{
          id:'',
          department:'',
          mobile:'',
          verify_code:''
        },
        basic_info_rules:{
          department: [{required: true,message: '请选择所在学院', trigger: 'change'}],
          id: [{required: true,message: '请输入学号', trigger: 'blur'}],
          mobile: [{required: true,message: '请输入手机号码', trigger: 'blur'}],
          verify_code: [{required: true,message: '请输入手机收到的验证码', trigger: 'blur'}]
        },
        
        //密码信息表单
        passwordForm:{
          password:'',
          confirm_password:''
        },
        password_rules:{
          password:[{required:true, message:'创建密码',trigger:'blur'},{ min: 6, max: 20, message: '密码长度须介于6与20之间！', trigger: 'blur' }],
          confirm_password:[{required:true,message:'确认密码',trigger:'blur'},{ validator:(rule,value,callback)=>{
            if(value==='') { callback(new Error('请再次输入密码')) }
            else if(value!==this.passwordForm.password){ callback(new Error('两次输入密码不一致')) }
            else{ callback() }}, trigger:'blur'}]
        },

        //附加信息表单
        additionForm:{
          qq_number:'',
          sex:'',
          name:'',
          major:'',
          dormitory:'',
        },
        addition_rules:{

        },
        //验证码模块数据
        disabled: false,
        time: 0,
        btntxt: "重新发送",

        department_options:[
          {value:'机械与汽车工程学院',label:'机械与汽车工程学院'},
          {value:'建筑学院',label:'建筑学院'},
          {value:'土木与交通学院',label:'土木与交通学院'},
          {value:'电子与信息学院',label:'电子与信息学院'},
          {value:'材料科学与工程学院（先进材料国际化示范学院）',label:'材料科学与工程学院（先进材料国际化示范学院）'},
          {value:'化学与化工学院',label:'化学与化工学院'},
          {value:'轻工科学与工程学院',label:'轻工科学与工程学院'},
          {value:'食品科学与工程学院',label:'食品科学与工程学院'},
          {value:'数学学院',label:'数学学院'},
          {value:'物理与光电学院',label:'物理与光电学院'},
          {value:'经济与金融学院',label:'经济与金融学院'},
          {value:'旅游管理系',label:'旅游管理系'},
          {value:'电子商务系',label:'电子商务系'},
          {value:'自动化科学与工程学院',label:'自动化科学与工程学院'},
          {value:'计算机科学与工程学院',label:'计算机科学与工程学院'},
          {value:'电力学院',label:'电力学院'},
          {value:'生物科学与工程学院',label:'生物科学与工程学院'},
          {value:'环境与能源学院',label:'环境与能源学院'},
          {value:'软件学院',label:'软件学院'},
          {value:'工商管理学院（创业教育学院）',label:'工商管理学院（创业教育学院）'},
          {value:'公共管理学院',label:'公共管理学院'},
          {value:'马克思主义学院',label:'马克思主义学院'},
          {value:'外国语学院',label:'外国语学院'},
          {value:'法学院（知识产权学院）',label:'法学院（知识产权学院）'},
          {value:'新闻与传播学院',label:'新闻与传播学院'},
          {value:'艺术学院',label:'艺术学院'},
          {value:'体育学院',label:'体育学院'},
          {value:'设计学院',label:'设计学院'},
          {value:'医学院（生命科学研究院）',label:'医学院（生命科学研究院）'},
          {value:'国际教育学院',label:'国际教育学院'},
          {value:'生物医学科学与工程学院',label:'生物医学科学与工程学院'},
          {value:'吴贤铭智能工程学院',label:'吴贤铭智能工程学院'},
          {value:'分子科学与工程学院（华南软物质科学与技术高等研究院）',label:'分子科学与工程学院（华南软物质科学与技术高等研究院 ）'},
          {value:'微电子学院',label:'微电子学院'}
        ]
      }
    },
    methods: {
      login () {
        window.sessionStorage.setItem('user',this.loginForm.username) 
        this.$router.replace({path: '/home'})
        return
        alert("haha")
        this.$axios
          .post('/login', {
            "userName": this.loginForm.username,
            "password": this.loginForm.password
          })
          .then(successResponse => {
            if (successResponse.status === 200) {
              this.$message({message:'登录成功！即将跳转到主页！',type:'success',center:true,showClose:true})
              this.$router.replace({path: '/index'})
            }
            else
            {
              this.$message({message:'登录失败！请检查账号或密码是否正确',type:'error',center:true,showClose:true})
            }
          })
          .catch(failResponse => {
            this.$notify.error({title: '登陆异常！',message: failResponse.message});
          })
      },
      next() {
        if(this.active == 0)
        {
          if(this.submitFormCheck('basicSignUpForm')) {
            this.$axios.post('/register/stage1', this.basicSignUpForm)
              .then(successResponse => {
                if (successResponse.data === 'OK') {
                  this.active++;
                }
                else
                {
                  this.$notify.error({title:'注册失败！',message: successResponse.data})
                  //console.log(successResponse)
                }
              })
            .catch(failResponse => {
            this.$notify.error({title: 'Stage1 failed！',message: failResponse.data});
            })
            
          }
        }
        else if(this.active == 1)
        {
          if(this.submitFormCheck('passwordForm')) {
            this.active++;
            this.nextButtonText='提交';
          }
        }
        else
        {
          console.log(this.additionForm.sex)
        }
        //if(this.active == 0)this.vcode_isShow = true;
        
        //if (this.active > 2) this.active = 0;
      },
      handleTabsClick: function (tab, event) {
        //console.log(event)
        if(event.target.getAttribute('id')==="tab-sign_in") this.active_style=true;
        else this.active_style=false;
      },
      vcode_success(){
        //alert("success!");
        this.AI_check = false;
        this.vcode_isShow=false;
        console.log(this.basicSignUpForm.mobile);

        this.$axios
          .post('/common/sendsms', {
            "phone": this.basicSignUpForm.mobile
          })
          .then(successResponse => {
            if (successResponse.data === 'OK') {
              this.$message({message: '发送成功！请在5分钟之内完成验证',type: 'success',center:true})
            }
            else
            {
              this.$notify.error({title:'发送失败！',message: successResponse.data})
              //console.log(successResponse)
            }
          })
          .catch(failResponse => {
            this.$notify.error({title: '发送异常！',message: failResponse.data});
          })

        this.time = 60;
        this.disabled = true;
        this.timer();
      },
      vcode_close(){
        this.vcode_isShow=false;
      },

      //验证码模块函数
      sendcode() {
        const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
        if (this.basicSignUpForm.mobile == '') {
            this.$message({
                type:'error',
                message:'手机号不能为空',
                center: true
            })
            return
        }
        if (!reg.test(this.basicSignUpForm.mobile)) {
            this.$message({
                type:'error',
                message:'请输入正确的手机号',
                center:true
            })
            return
        } else {
            this.vcode_isShow = true;
        }
      },
      timer() {
          if (this.time > 0) {
              this.time--;
              this.btntxt = this.time + "s后重新获取";
              setTimeout(this.timer, 1000);
          } else {
              this.time = 0;
              this.btntxt = "获取验证码";
              this.disabled = false;
          }
      },

      submitFormCheck(formName) {
        var result;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(formName+' submit successful!');
            result = true;
          } else {
            console.log(formName+' error submit!!');
            result = false;
          }
        });
        return result;
      },
    
    }
  }
</script>

<style scoped>
  #poster {
    background:url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602591084969&di=4d48c247ed1f1b1a8ea4cb72979e2df4&imgtype=0&src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F646%2F311%2F178%2Fe2a0d127977b4e5b9c4094cbeb80c253.jpg") no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
    left: 0px;
    top: 0px;
  }
  #app{
    text-align:left;
  }
  body{
    margin: 0px;
  }

  .login-container {
    border-radius: 30px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 15px 35px 30px 35px;
    background: #ffffff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login-container_sign_up {
    border-radius: 30px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 450px;
    padding: 15px 35px 30px 35px;
    background: #ffffff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  
  .login_title {
    margin: 0px auto 15px auto;
    text-align: center;
    color: #505458;
  }

  .username_style {
    margin: 0px auto 22px auto;
  }
  .login_button_style{
    
    background: #313538;
    width: 100%;
    border: none;
    margin-top:20px;
  }
  .remember_me_style{
    margin: 5px auto 5px auto;
  }
  .input_style{
    margin-bottom:20px; margin-top:20px;
  }

  .el-form-item{
    margin-bottom: 0px;
  }
  .sign_up_style{
    margin: 20px auto 20px auto
  }
  .el-scrollbar__wrap { 
    overflow-x: hidden; 
    overflow-y: hidden;
  }

</style>
