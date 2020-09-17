<template>
  <q-toolbar >
    <q-btn
      flat
      dense
      round
      @click="is_hide"
      aria-label="Menu"
      icon="menu"
    />
    <div class="justify-start row no-wrap">
    <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs">
      <!--          <q-icon :name="fabYoutube" color="red" size="28px" />-->
      <q-toolbar-title shrink class="text-weight-bold">
        物联设备网格系统
      </q-toolbar-title>
    </q-btn>
    <q-space/>
<!--    <q-tabs v-model="tab" shrink stretch class="my-special-class">-->
<!--      <q-tab name="tab1" label="平台管理"/>-->
<!--      <q-tab name="tab2" label="系统维护" />-->
<!--      <q-tab name="tab3" label="应用管理" />-->
<!--    </q-tabs>-->
    </div>
    <q-space/>
    <div class="YL__toolbar-input-container row no-wrap" >

    <q-space/>
      <!-- 搜索 -->
      <q-input  dense standout="bg-blue-6 text-white" v-model="search" input-class="text-right" class="q-ml-md" label-color="primary">
        <template v-slot:append>
          <q-icon v-if="search === ''" name="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
        </template>
      </q-input>

      <q-space/>

    <div class="q-gutter-sm row items-center no-wrap">
      <q-btn round dense flat color="grey-8" icon="video_call" v-if="$q.screen.gt.sm">
        <q-tooltip>创建</q-tooltip>
      </q-btn>
      <q-btn round dense flat color="grey-8" icon="apps" v-if="$q.screen.gt.sm">
        <q-tooltip>应用</q-tooltip>
      </q-btn>
      <q-btn round dense flat color="grey-8" icon="message" v-if="$q.screen.gt.sm">
        <q-tooltip>消息</q-tooltip>
      </q-btn>
      <q-btn round dense flat color="grey-8" icon="notifications">
        <q-badge color="red" text-color="white" floating>
          2
        </q-badge>
        <q-tooltip>通知</q-tooltip>
      </q-btn>

      <!-- 头像 -->
      <q-btn round flat>
        <q-avatar size="26px">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
        <q-tooltip>Account</q-tooltip>
        <q-menu>
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md">设置</div>
              <q-toggle v-model="mobileData" label="设置1" />
              <q-toggle v-model="bluetooth" label="设置2" />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/avatar4.jpg">
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">cimo</div>

              <q-btn
                color="primary"
                label="退出登录"
                push
                size="sm"
                v-close-popup
              />
            </div>
          </div>
        </q-menu>
      </q-btn>
    </div>
    </div>
  </q-toolbar>
</template>

<script>
export default {
  name: 'toobar',
  data () {
    return {
      leftDrawerOpen: true,
      search: '',
      mobileData: true,
      bluetooth: false
    }
  },
  methods: {
    is_hide () {
      this.leftDrawerOpen = !this.leftDrawerOpen
      this.$emit('is_left_hide', this.leftDrawerOpen)
    }
  }
}
</script>

<style lang="sass">
  .YL

    &__toolbar-input-container
      min-width: 100px
      width: 25%

    &__toolbar-input-btn
      margin: 1px 15px 1px 0px
      border-radius: 0
      border-style: solid
      border-width: 1px 1px 1px 0
      border-color: rgba(0, 0, 0, .24)
      max-width: 60px
      width: 100%

    &__drawer-footer-link
      color: inherit
      text-decoration: none
      font-weight: 500
      font-size: .75rem

      &:hover
        color: #000
</style>

<style lang="css">
  .my_toolbar {
    background: linear-gradient(125deg, #5B86E5, #36D1DC);
  }
</style>
