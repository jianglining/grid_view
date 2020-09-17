<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">

    <!-- 顶部状态栏 -->
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <toolbar v-on:is_left_hide="is_left_hide"/>
    </q-header>
    <!-- 顶部状态栏 end -->

    <!-- 动态菜单 -->
    <my-menu :is_hide.sync="leftDrawerOpen"/>
    <!-- 动态菜单 END -->

    <q-page-container>
      <transition appear enter-active-class="animated fadeIn">
        <router-view />
      </transition>
    </q-page-container>

  </q-layout>
</template>

<script>
import myMenu from '../components/menu/menu'
import toolbar from '../components/toolbar'
export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: true,
      search: ''
    }
  },
  components: {
    myMenu,
    toolbar
  },

  created () {

  },
  methods: {
    is_left_hide (e) {
      this.leftDrawerOpen = e
    }
  }
}
</script>

<style lang="sass">

</style>
