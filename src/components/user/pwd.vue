<template>
  <div>
    <el-form
      style="margin-right: 100px;margin-left:100px;"
      label-width="100px"
      ref="password_form"
      :rules="pwd_rules"
      :model="password_form"
    >
      <el-form-item
        label="原密码"
        prop="old_password"
        class='username_style'
      >
        <el-input
          v-model="password_form.old_password"
          placeholder="请输入原密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="new_password"
        class='username_style'
      >
        <el-input
          v-model="password_form.new_password"
          placeholder="请输入新密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认新密码"
        prop="new_password_confirm"
        class='username_style'
      >
        <el-input
          v-model="password_form.new_password_confirm"
          placeholder="请再次输入新密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          style="width: 100%;"
          round
          @click="pwd_modify_apply"
        >修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'pwd',
  data () {
    return {
      password_form: {
        new_password: '',
        new_password_confirm: '',
        old_password: ''
      },
      pwd_rules: {
        new_password: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, max: 20, message: '密码长度须介于6与20之间！', trigger: 'blur' }],
        new_password_confirm: [{ required: true, message: '确认密码', trigger: 'blur' }, {
          validator: (rule, value, callback) => {
            if (value === '') { callback(new Error('请再次输入密码')) }
            else if (value !== this.password_form.new_password) { callback(new Error('两次输入密码不一致')) }
            else { callback() }
          }, trigger: 'blur'
        }],
        old_password: [{ required: true, message: '请输入原密码', trigger: 'blur' }]
      },

    }
  },
  methods: {
    pwd_modify_apply: function () {
      console.log(this.password)
      if(this.submitFormCheck('password_form')){
        //alert('nnn')
        this.$axios.post('/user_info/set_pwd',{
          userName: window.sessionStorage.getItem('user'),
          oldPassword: this.password_form.old_password,
          newPassword: this.password_form.new_password,
          userType: window.sessionStorage.getItem('user_type')
        }).then(res=>{
          if(eval(res.data)['is_success']=='true'){
            this.$message({message:'修改密码成功！',type:'success',center:true,showClose:true})
          }
          else this.$notify.error({title:'修改失败！',message: eval(res.data)['description']})
        }).catch(failResponse=>{
          this.$notify.error({title: '修改异常！',message: failResponse.data});
        })
      }
      else this.$notify.error({title: '修改失败！',message: '请确保必填项目不为空！'});
    },
    submitFormCheck: function (formName) {
      var result;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(formName + ' submit successful!');
          result = true;
        } else {
          console.log(formName + ' error submit!!');
          result = false;
        }
      });
      return result;
    },
  }
}
</script>
<style scoped>
.username_style {
    margin: 0px auto 22px auto;
  }
</style>