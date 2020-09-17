<template>
    <div>
      <q-card class="main_content" >
        <q-card-section>
          <ul>
            <h5>递归实现动态菜单，理论上支持无限扩展</h5>

            菜单数据结构：menuList:[
            <!-- 先从origin获得对应的数据 -->
            <span v-for="(value,index) in menuList" :key="index">
              {{value}}
            </span>
            ]
          </ul>
          <div id="main">
            <mavon-editor v-model="mavonValue"/>
          </div>
        </q-card-section>
      </q-card>

    </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      mavonValue: '',
      menuList: [
        {
          icon: 'inbox',
          label: '菜单1',
          children: [
            {
              icon: 'perm_identity',
              label: '菜单1-1',
              path: '/about'
            },
            {
              icon: 'delete',
              label: '菜单1-2',
              children: [
                {
                  icon: 'settings',
                  label: '菜单2-1',
                  path: '/noty'
                }
              ]
            }
          ]
        },
        {
          isItemLabel: true,
          Label_text: 'item-label '
        },
        {
          icon: 'feedback',
          label: '菜单数据结构',
          path: '/test',
          hidden: false
        }
      ],
      buttonList: [
        { text: '关于我们' },
        { text: 'Press' },
        { text: 'Copyright' },
        { text: '联系我们' },
        { text: 'Creators' },
        { text: '广告' },
        { text: '开发者' }
      ]
    }
  }
}
</script>
