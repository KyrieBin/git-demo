<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username" class="item-el">
            <el-input ref="useInput" class="input" placeholder="请输入用户名" :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" class="item-el">
            <el-input class="input" placeholder="请输入密码" type="password" :prefix-icon="Lock" v-model="loginForm.password"
              show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading=loading class="login_btn" type="primary" @click="login()">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'

import useUserStore from '@/store/modules/user'
const userStore = useUserStore();

import { useRouter, useRoute } from 'vue-router';

import { ElNotification, ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue'

import getTime from '@/unitl/Time'

let useInput = ref()

// 收集表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 数据请求过来之前展示loading
let loading = ref(false);

// 获取路由
let $router = useRouter();
let $route = useRoute();

// 点击登录按钮
const login = async () => {
  // 保证全部表单校验通过后再往下执行
  await loginForms.value.validate();   //就这一行代码

  loading.value = true;

  userStore.userLogin(loginForm).then(() => {
    let rediract = $route.query.rediract;
    if (rediract) {
      $router.push({ path: `${rediract}` });    //跳转到之前页
    } else {
      $router.push({ path: '/' });    //跳转到首页
    }
    setTimeout(() => {
      ElNotification({   //登录成功提示框
        type: 'success',
        message: '登录成功',
        title: `Hi~ ${getTime()}好`
      })
    }, 500)

    loading.value = false;

  }, (error) => {
    ElMessage.error(`${error}`);
    useInput.value.focus();
    loading.value = false;
  })
}

// 登录方法


// 自定义校验规则 <用户名>
// const validatePass = (value: any, callback: any) => {
//   if (value.length <= 6) {
//     callback(new Error('用户名长度至少是6位'));
//   } else {
//     callback();
//   }
// }

// 打一个标识，用来做校验
let loginForms = ref();   //el-form 表单

// 校验规则
const rules = reactive({
  username: [
    {
      required: true,  //必填项
      message: '请输入用户名',   //输入框下的提示信息
      trigger: 'blur'   //失去焦点时触发校验
    },
    {
      min: 2, max: 10,  //长度
      message: '用户名必须是2到10位字母',
      trigger: 'blur'
    }],

  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 2, max: 10,
      message: '密码必须是2到10位',
      trigger: 'blur'
    },
  ],
})


</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      height: 40px;
      width: 100%;
      color: #fff
    }
  }
}

.item-el {
  margin-bottom: 20px;

  .input {
    height: 40px;
  }
}
</style>