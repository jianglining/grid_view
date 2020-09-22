<template>

  <div class="b q-pa-md doc-container">
    <q-ajax-bar
      class="absolute-top"
      ref="bar"
      position="bottom"
      color="blue"
      size="5px"
      skip-hijack
    />

    <div class="mybg">
      <div>
        <div class="logon-card" style="font-size: xx-large">

          <q-card style="" class="shadow-20 bg-blue-9 text-white">
            <q-card-section horizontal>

              <q-img
                src="/bg.svg"
                style="width:1080px;"
              ></q-img>

              <div style="margin-top:30px;margin-left: 20px;margin-right: 20px; ">
                <div style="font-size: x-large;margin-bottom: 30px">
                  IOT perception platform<br/>
                  物 联 设 备 网 格 引 擎
                </div>
                <!-- 用户名 -->
                <q-input class="logon-input"
                         color="dark"
                         dark
                         clearable
                         standout
                         bottom-slots
                         v-model="username"
                         label="账号"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_circle"/>
                  </template>
                </q-input>

                <!-- 密码 -->
                <q-input class="logon-input"
                         dark
                         color="dark"
                         standout
                         bottom-slots
                         v-model="password"
                         label="密码"
                         :type="isPwd ? 'password' : 'text'" hint=""
                >
                  <template v-slot:prepend>
                    <q-icon name="vpn_key"/>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <!-- 登录按钮 -->
                <q-btn
                  class="logon-btn"
                  color="white"
                  text-color="black"
                  label=""
                  style="font-size: large;"
                  @click="logon"
                >登 录 系 统
                </q-btn>
                <div class="row justify-between" >
                  <q-btn flat text-color="white" label="忘记密码" />
                  <q-btn outline text-color="white" color="primary" label="我要注册" />
                </div>
              </div>

            </q-card-section>

          </q-card>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

import { fetchData } from '../api/index'

export default {
  name: 'logon',
  data () {
    return {
      msg: '欢迎！',
      isPwd: true,
      username: '',
      password: ''

    }
  },
  methods: {
    logon () {
      // this.$q.loadingBar.start()
      // const query = {
      //   url: 'http://10.168.2.206:8080/sys/login/admin/admin',
      //   method: 'post'
      // }
      // // 登录系统
      // fetchData(query).then(res => {
      //   localStorage.setItem('access_token', res.data.access_token)
      //   localStorage.setItem('refresh_token', res.data.refresh_token)
      //   this.$q.loadingBar.stop()
      //   this.$router.push('/home')
      //   this.getMenu()
      //   this.$q.notify({
      //     message: 'hi，cimo 欢迎回来',
      //     color: 'green',
      //     position: 'top',
      //     timeout: 1500
      //   })
      // }).catch(error => {
      //   console.log(error)
      //   this.$router.push('/home')
      // })
      this.$router.push('/home')
    },
    // 获取菜单
    getMenu () {
      const query = {
        url: 'http://10.168.2.206:8080/api-b/menus/me/giveanalarm-center'
      }
      fetchData(query).then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
    }
  },
  components: {}
}
</script>

<style scoped>
  .logon-btn {
    font-size: large;
    margin-top: 0px;
    margin-bottom: 20px;
    width: 100%;
  }

  .logon-input {
    margin-bottom: 20px;
    margin-top: 10px;
  }

  .logon-card {
    height: auto;
    width: auto;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -55%);
    left: 50%;
  }

  .b {
    min-height: 100%;
    margin: 0;
    padding: 0;
    font-family: "montserrat";
    background-image: linear-gradient(125deg, #192b3e, #868f96, #596164, #cfd9df);
    /*background-image: linear-gradient(125deg, #2c3e50, #27ae60, #2980b9, #e74c3c, #8e44ad);*/
    background-size: 400%;
    animation: bganimation 20s infinite;
  }

  .mybg {
    min-height: 100%;

    text-align: center;
    text-transform: uppercase;
    font-size: 22px;
  }

  @keyframes bganimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

</style>
