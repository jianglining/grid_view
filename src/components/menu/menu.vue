<template>

  <q-drawer
    v-model="is_hide_"
    show-if-above
    bordered
    content-class="bg-grey-2"
    :width="240"
  >

  <q-scroll-area class="fit">
    <!-- 递归实现 循环菜单 -->
    <my-q-menu/>

  </q-scroll-area>

  </q-drawer>

</template>

<script>
import MyQMenu from './myQMenu'
export default {
  name: 'myMenu',
  components: { MyQMenu },
  data () {
    return {

    }
  },
  methods: {

  },
  props: ['is_hide'],
  computed: {
    is_hide_: {
      get () {
        return this.is_hide
      },
      set () {

      }
    }
  },
  mounted () {

  }
}
</script>

<style lang="css">

</style>
