<template>
  <div style="margin-left:20px">
    <!-- <upload-picture></upload-picture> -->
    <!-- <upload-picture-list></upload-picture-list> -->
    <!-- <upload-picture-list></upload-picture-list>
        <el-button @click="test">删除测试</el-button> -->
    <el-form style="margin-right: 100px;margin-left:100px;" label-width="100px">
      <el-form-item label="学号" align="left" style="margin-bottom:22px">
        <el-tag>{{ userid_display }}</el-tag>
      </el-form-item>
      <el-form-item label="学院" align="left" style="margin-bottom:22px" v-if="user_type == 'user'">
        <el-select v-model="user_info_form.department" filterable placeholder="请选择所在学院" style="width: 370px;">
          <el-option v-for="item in department_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" align="left" style="margin-bottom:22px" v-if="user_type == 'user'">
        <el-tag>{{ user_mobile_display }}</el-tag>
        <el-button @click="dialog_visible = true">修改手机</el-button>
      </el-form-item>
      <el-form-item label="宿舍" align="left" style="margin-bottom:22px" v-if="user_type == 'user'">
        <el-input v-model="user_info_form.dormitory" placeholder="请输入宿舍号"></el-input>
      </el-form-item>
      <el-form-item label="专业" align="left" style="margin-bottom:22px" v-if="user_type == 'user'">
        <el-input v-model="user_info_form.major" placeholder="请输入所在专业"></el-input>
      </el-form-item>
      <el-form-item label="昵称" align="left" style="margin-bottom:22px">
        <el-input v-model="user_info_form.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="性别" align="left" style="margin-bottom:22px">
        <el-radio v-model="user_info_form.sex" label="male">男</el-radio>
        <el-radio v-model="user_info_form.sex" label="female">女</el-radio>
      </el-form-item>
      <el-form-item label="QQ号" align="left" style="margin-bottom:22px" v-if="user_type == 'user'">
        <el-input v-model="user_info_form.qq" placeholder="请输入QQ号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-tooltip class="item" effect="dark" content="只能修改学院、宿舍、专业、昵称、性别和QQ号嗷 ₍ ᐢ.⌄.ᐢ ₎ ꜆˖.♡" v-if="isUser" placement="bottom">
          <el-button style="width: 100%;" @click="modify_information" type="primary">修改信息</el-button>
        </el-tooltip>
        <el-button style="width: 100%;" @click="modify_information" type="primary" v-if="!isUser">修改信息</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="修改手机" :visible.sync="dialog_visible" width="40%">
      <div v-if="changeMobilePage == 0">
        <el-form>
          <el-form-item label="原手机号" label-width="120px">
            <el-input v-model="origin_mobile" auto-complete="off" placeholder="请输入原手机号"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="changeMobilePage == 1">
        <el-form>
          <Vcode :show="vcode_isShow" @success="vcode_success" @close="vcode_close" class="z-index:999" />
          <el-form-item label="手机号码" label-width="120px">
            <el-input placeholder="请输入手机号" v-model="changeMobile.new_mobile"></el-input>
          </el-form-item>
          <el-form-item label="验证码" label-width="120px">
            <el-input v-model="changeMobile.verify_code" placeholder="请输入验证码" style="margin-right:4px;width: 300px;"></el-input>
            <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled == false" style="float: right;">发送验证码</el-button>
            <el-button type="button" @click="sendcode" :disabled="disabled" v-if="disabled == true" style="float: right;">{{ btntxt }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="changeMobileNext">{{ changeMobileNextButtonText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import UploadPictureList from '../common/UploadPictureList.vue'
import { department_options } from '../../assets/constants.js'
import Vcode from '../common/PuzzleVcode';
export default {
  //   components: { UploadPictureList, Vcode },
  components: { Vcode },
  name: 'info',
  data() {
    return {
      userid_display: 'null',
      user_type:'null',
      user_mobile_display: 'null',
      department_options: department_options,
      user_info_form: {
        department: '',
        dormitory: '',
        major: '',
        name: '',
        sex: 'male',
        qq: '',
      },
      dialog_visible: false,
      changeMobilePage: 0,
      changeMobileNextButtonText: '下一步',
      origin_mobile: '',
      changeMobile: {
        verify_code: '',
        new_mobile: '',
      },
      vcode_isShow: false,

      //验证码模块数据
      disabled: false,
      time: 0,
      btntxt: '重新发送',

      //判断是用户还是管理员
      isUser: false,
    }
  },
  methods: {
    test() {
      this.$axios.post('debug/commodity/delete_image', { image_name: 'qAMdWcFWRk.jpg' }).then((res) => {
        console.log(res.data)
      })
    },
    changeMobileNext() {
      if (this.changeMobilePage == 0) {
        this.$axios.post('user_info/get', { studentID: window.sessionStorage.getItem('user') }).then((res) => {
          var d = eval(res.data)
          if (d['mobile'] === this.origin_mobile) {
            this.changeMobilePage = 1
            this.changeMobileNextButtonText = '提交'
          } else {
            this.$message({ message: '原手机号输入错误', type: 'error', center: true, showClose: true })
          }
        })
      } else {
        if (this.changeMobile.new_mobile == '') {
          this.$message({ type: 'error', message: '新手机号不能为空！', center: true })
        }
        if (this.changeMobilePage.verify_code == '') {
          this.$message({ type: 'error', message: '验证码不能为空！', center: true })
        }
        this.$axios
          .post('/common/sms_verify', { verify_code: this.changeMobile.verify_code })
          .then((res) => {
            if (res.data === 'OK') {
              this.$message({ message: '新手机核验成功！正在修改', type: 'success', center: true })
              this.$axios
                .post('/user_info/set', {
                  studentID: window.sessionStorage.getItem('user'),
                  mobile: this.changeMobile.new_mobile,
                })
                .then((successResponse) => {
                  if (eval(successResponse.data)['is_success'] === 'true') {
                    this.$message({ message: '手机修改成功！', type: 'success', center: true })
                    this.dialog_visible = false
                    this.changeMobilePage = 0
                    location.reload()
                  } else {
                    this.$notify.error({ title: '手机修改失败！', message: eval(successResponse.data)['description'] })
                  }
                })
                .catch((failResponse) => {
                  this.$notify.error({ title: '手机修改失败', message: failResponse.data })
                })
            } else {
              this.$notify.error({ title: '手机验证失败！', message: res.data })
            }
          })
          .catch((failResponse) => {
            this.$notify.error({ title: '手机验证失败', message: failResponse.data })
          })
      }
    },
    modify_information() {
      this.$axios
        .post('/user_info/set', {
          userID: window.sessionStorage.getItem('user'),
          userType: window.sessionStorage.getItem('user_type'),
          name: this.user_info_form.name,
          sex: this.user_info_form.sex,
          college: this.user_info_form.department,
          major: this.user_info_form.major,
          dormitory: this.user_info_form.dormitory,
          qq: this.user_info_form.qq,
        })
        .then((res) => {
          var d = eval(res.data)
          if (d['is_success'] === 'true') {
            this.$message({ message: '修改成功！', type: 'success', center: true, showClose: true })
            
          } else {
            this.$message({ message: '修改失败', type: 'error', center: true, showClose: true })
          }
        })
        .catch((failResponse) => {
          this.$notify.error({ title: '修改异常！', message: failResponse.data })
        })
    },
    vcode_success() {
      this.vcode_isShow = false
      this.dialog_visible = true

      this.$axios
        .post('/common/sendsms', { phone: this.changeMobile.new_mobile })
        .then((res) => {
          if (res.data === 'OK') {
            this.$message({ message: '发送成功！请在5分钟之内完成验证', type: 'success', center: true })
            this.time = 60
            this.disabled = true
            this.timer()
          } else {
            this.$notify.error({ title: '发送失败！', message: successResponse.data })
          }
        })
        .catch((failResponse) => {
          this.$notify.error({ title: '发送异常！', message: failResponse.data })
        })
    },
    vcode_close() {
      this.vcode_isShow = false
    },
    //验证码模块函数
    sendcode() {
      const reg = 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/
      if (this.changeMobile.new_mobile == '') {
        this.$message({
          type: 'error',
          message: '手机号不能为空',
          center: true,
        })
        return
      }
      if (!reg.test(this.changeMobile.new_mobile)) {
        this.$message({
          type: 'error',
          message: '请输入正确的手机号',
          center: true,
        })
        return
      } else {
        this.vcode_isShow = true
        this.dialog_visible = false
      }
    },
    timer() {
      if (this.time > 0) {
        this.time--
        this.btntxt = this.time + 's后重新获取'
        setTimeout(this.timer, 1000)
      } else {
        this.time = 0
        this.btntxt = '获取验证码'
        this.disabled = false
      }
    },
  },
  mounted() {
    this.userid_display = window.sessionStorage.getItem('user')
    this.user_type = window.sessionStorage.getItem('user_type')
    this.$axios
      .post('/user_info/get', { userID: window.sessionStorage.getItem('user'), userType: window.sessionStorage.getItem('user_type') })
      .then((res) => {
        var d = eval(res.data)
        if (d['is_success'] === 'true') {
          this.user_mobile_display = d['mobile']?(d['mobile'].substr(0, 2) + '******' + d['mobile'].substr(8)):''
          this.user_info_form.name = d['name']
          this.user_info_form.sex = d['sex']
          this.user_info_form.department = d['college']
          this.user_info_form.major = d['major']
          this.user_info_form.dormitory = d['dormitory']
          this.user_info_form.qq = d['qq']
        } else {
          this.$message({ message: '调取用户信息失败', type: 'error', center: true, showClose: true })
        }
      })
      .catch((failResponse) => {
        this.$notify.error({ title: '调取用户信息异常！', message: failResponse.message })
      })
    
    //判断是用户还是管理员
    this.isUser = window.sessionStorage.getItem('user_type') === 'user';
  },
}
</script>
