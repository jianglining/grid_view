<!--
   动态菜单 item 递归实现
   myRouter ： 菜单列表
   initLevel ： 菜单初始化缩进等级
   author ： ths
-->
<template>
  <div>

    <div v-for="(item,index) in myRouter" :key="index">

      <q-item-label v-if="item.isItemLabel" header class="text-weight-bold text-uppercase">
        {{item.name}}
      </q-item-label>

      <div v-if="!item.hidden && !item.isItemLabel">
        <!-- 当没有子菜单时，结束递归 -->
        <div v-if="item.child == null">
          <q-expansion-item
            :header-inset-level="initLevel"
            expand-icon="1"
            :to="item.path"
            :icon="item.css"
            :label="item.name"
          />
        </div>
        <!-- 子菜单依然存在时，继续递归 -->
        <div v-else>
          <q-expansion-item
            expand-separator
            :header-inset-level="initLevel"
            :to="item.path"
            :icon="item.css"
            :label="item.name"
          >
            <my-q-menu-item :my-router="item.child" :init-level="initLevel+0.3"/>
          </q-expansion-item>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'my-q-menu-item',
  data () {
    return {}
  },
  methods: {},
  props: ['myRouter', 'initLevel']
}
</script>
