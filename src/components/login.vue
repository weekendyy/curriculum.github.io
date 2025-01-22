<template>
  <div :class="`login-box-outer ${showLogin?'show-login-box-outer':''}`">
    <van-icon name="close" class="close-icon" v-if="closeIconVisible" @click="showLogin=false" />
    <div :class="`login-box`">
      <img src="../images/classlogo.jpg" :class="`classlogo ${showLogin?'show-classlogo':''}`" />
      <h2>LOGIN</h2>
      <form :class="`login-form ${showLogin?'show-login-form':''}`">
        <div class="user-box">
          <input type="text" name="" v-model="user" :disabled="submiting" required="">
          <label>student ID</label>
        </div>
        <div class="user-box">
          <input type="password" name="" v-model="password" :disabled="submiting" required="">
          <label>password</label>
        </div>
        <div class="submit-button" @click="handleSubmit">
          <template v-if="submiting">
            <span class="loader-44"></span>
          </template>
          <template v-else>
            submit
          </template>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

// import request from "../utils/request"
import { weekOption } from "../utils/const"
import CryptoJS from 'crypto-js';
import userData from "../config/user_table_data"
export default {
  name: 'LoginComponent',
  data() {
    return {
      showLogin: false,
      closeIconVisible: true,
      password: "",
      user: "",
      weekOption: weekOption,
      submiting: false,
      // 数据加解密
      encrypted: '',
      decrypted: '',
      secretKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoweekendyyas#$GGVpqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=', // 密钥，应保密且随机
    }
  },
  watch: {
    showLogin(newval){
      if(newval){
        const user = localStorage.getItem("user")
        const password = localStorage.getItem("password")
        if(user){
          this.user = this.decrypt(user)
        }
        if(password){
          this.password = this.decrypt(password)
        }
      }
    }
  },
  methods: {
    showDialog(){
      this.showLogin = true;
      this.closeIconVisible = true
    },
    handleSubmit(){
      // if(!this.user.trim()){
      //   this.$toast("请输入学号")
      //   return
      // }
      // if(!this.password.trim()){
      //   this.$toast("请输入密码")
      //   return
      // }
      // 从接口获取数据
      // const reqData = {
      //   username: this.user,
      //   password: this.password,
      //   semester: "20242"
      // }
      // this.submiting = true
      userData.map(v=>{
        const weeks = this.getWeeks(v.ZCMC)
        const duration = `${this.parseTime(v.KSSJ)} - ${this.parseTime(v.JSSJ)}`
        const item = {
          dayIndex: v.XQ === 7 ? 0 : v.XQ,
          address: v.JASMC,
          courseName: v.KCMC,
          teacher: v.JSXM,
          remark: v.KBBZ,
          time: [`第${v.KSJCDM}节 ${duration}`],
          duration,
          weeks,
          courseIndex: v.KSJCDM,
          KCDM: v.KCDM,
          hidden: false
        }
        weeks.forEach(w=>{
          this.weekOption[w-1].course.unshift(JSON.parse(JSON.stringify(item)))
        })
      })
      this.submiting = false
      this.showLogin = false
      // 存储data到本地缓存
      localStorage.setItem('table_data', JSON.stringify(this.weekOption));
      localStorage.setItem('user', this.encrypt(this.user));
      localStorage.setItem('password', this.encrypt(this.user));
      this.$emit("updateData",this.weekOption)
      return
      // request.post('/timetable',reqData).then(res=>{
      //   const { data, code } = res
      //   console.log(code)
      // }).catch(error=>{
      //   console.log(error)
      //   this.submiting = false
      //   this.$toast(error.message || "登录出错")
      // })
    },
    getWeeks(data){
      let weeks = data.replace(/[^\d-,]/g,"").split(",")
      weeks = weeks.map(v=>{
        if(v.includes("-")){
          let start = v.split("-")[0]
          let end = v.split("-")[1]
          let numbers = [];  
          for (let i = Number(start); i <= end; i++) {  
              numbers.push(i);  
          } 
          return numbers
        }else{
          return Number(v)
        }
      })
      return weeks.flat()
    },
    parseTime(str){
      str = String(str)
      let newStr = str.slice(0, length - 2) + ':' + str.slice(length - 2); 
      return newStr
    },
    // 加密数据
    encrypt(data) {
      return CryptoJS.AES.encrypt(data, this.secretKey).toString();
    },
    // 解密数据
    decrypt(encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
  },
  created(){
    // let localData = localStorage.getItem("table_data")
    // if(localData && JSON.parse(localData)){
    //   this.weekOption = JSON.parse(localData)
    //   this.$emit("updateData",this.weekOption)
    // }else{
    //   this.showLogin = true;
    //   this.closeIconVisible = false
    // }

    this.handleSubmit()
  }
}
</script>

<style scoped>
.login-box-outer {
  background-image: url('../images/mob.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 111;
  opacity: 0;
  pointer-events: none;
  transition: 0.3s;
}
.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 25px;
  color: rgba(0,0,0,0.3);
}
.show-login-box-outer {
  opacity: 1;
  pointer-events: auto;
}
.classlogo {
  width: 80px;
  height: 80px;
  border-radius: 100%;
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translate(-50%, -60%);
  z-index: 1112;
  padding: 10px;
  background-color: #fff;
  box-shadow:  5px 5px 5px #cccccc,
                10px 10px 10px #ffffff,
                0 0 0 #cccccc inset,
                0 0 0 #ffffff inset;
  border: 1px solid #f8edd7;
  transition: 0.3s;
  opacity: 0;
  pointer-events: none;
}
.show-classlogo {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, -50%);
}
.login-box {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 80%;
  max-width: 400px;
  padding: 40px;
  padding-top: 60px;
  transform: translate(-50%, -40%);
  box-sizing: border-box;
  border-radius: 10px;
  z-index: 1111;
  border: 1px solid #f8edd7;
  transition: 0.3s;
  background: #f8f8f8;
  box-shadow:  10px 10px 10px #cccccc,
                10px 10px 10px #ffffff,
                0 0 0 #cccccc inset,
                0 0 0 #ffffff inset;
}
.login-form {
  transition: 0.3s;
  transform: translateY(20px);
}
.show-login-form {
  transform: translateY(0);
}
.login-box-background{
  width: 100vw;
  height: 100vh;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fac863;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #f8a602;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fac863;
  outline: none;
  background: transparent;
}
.login-box .user-box label {
  position: absolute;
  top:0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fac863;
  pointer-events: none;
  transition: .3s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input[disabled] ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: rgba(0,0,0,0.3);
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #fac863;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px
}
.submit-button {
  width: 100%;
  height: 40px;
  background: linear-gradient(to left top, #fa8a01, #f5bb74);
  border-radius: 40px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  margin-top: 20px;
}
.submit-button .loader-44 {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  color: #FFF;
  left: -125px;
  -webkit-animation: shadowRolling 2s linear infinite;
  animation: shadowRolling 2s linear infinite;
}

@keyframes shadowRolling {
  0% {
    box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }
  12% {
      box-shadow: 100px 0 white, 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }
  25% {
      box-shadow: 110px 0 white, 100px 0 white, 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }
  36% {
      box-shadow: 120px 0 white, 110px 0 white, 100px 0 white, 0px 0 rgba(255, 255, 255, 0);
  }
  50% {
      box-shadow: 130px 0 white, 120px 0 white, 110px 0 white, 100px 0 white;
  }
  62% {
      box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 white, 120px 0 white, 110px 0 white;
  }
  75% {
      box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 white, 120px 0 white;
  }
  87% {
      box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 white;
  }
  100% {
      box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
  }
}
</style>
