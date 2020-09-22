<template>
  <div>

    <!-- 动态菜单 -->
    <q-list>
      <my-q-menu-item :my-router="menu_test" :init-level="0"/>
    </q-list>

    <!-- 底部说明 -->
    <div class="q-py-md q-px-md text-grey-9 fixed-bottom">
      <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
        <a
          v-for="button in buttonList"
          :key="button.text"
          class="YL__drawer-footer-link"
          href="javascript:void(0)"
        >
          {{ button.text }}
        </a>
      </div>
    </div>

  </div>
</template>

<script>
import MyQMenuItem from './myQMenuItem'

export default {
  name: 'my-q-menu',
  components: { MyQMenuItem },
  data () {
    return {
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
                },
                {
                  icon: 'settings',
                  label: 'axios 测试',
                  path: '/request_test'
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
        // { text: '关于我们' },
        // { text: 'Press' },
        // { text: 'Copyright' },
        // { text: '联系我们' },
        // { text: 'Creators' },
        // { text: '广告' },
        // { text: '开发者' }
      ],
      menu_test: [
        {
          id: 87,
          parentId: 86,
          name: '网格管理',
          css: '',
          url: '/gridInfo',
          sort: 1001,
          createTime: '2020-07-13T00:50:12.000+0000',
          updateTime: '2020-08-13T06:13:56.000+0000',
          systemcode: 'giveanalarm-center',
          systemservice: null,
          child: [
            {
              id: 88,
              parentId: 87,
              name: '网格信息',
              css: '',
              url: '/api-alarm/pages/droolsconstant/droolsconstant.html',
              path: '/gridInfo',
              sort: 1002,
              createTime: '2020-07-13T00:51:07.000+0000',
              updateTime: '2020-08-13T06:28:01.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            },
            {
              id: 111,
              parentId: 87,
              name: '设备配置',
              css: '',
              url: '/api-alarm/pages/ruleManagement/ruleManagement.html',
              path: '/deviceConfig',
              sort: 1003001,
              createTime: '2020-08-13T05:31:44.000+0000',
              updateTime: '2020-08-13T05:34:18.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            }
          ]
        },
        {
          id: 89,
          parentId: 86,
          name: '设备管理',
          css: '',
          url: '/api-alarm/pages/ruleManagement/ruleManagement.html',
          sort: 1003,
          createTime: '2020-07-13T00:52:03.000+0000',
          updateTime: '2020-08-13T05:32:01.000+0000',
          systemcode: 'giveanalarm-center',
          systemservice: null,
          child: [
            {
              id: 88,
              parentId: 89,
              name: '设备信息',
              css: '',
              url: '/api-alarm/pages/droolsconstant/droolsconstant.html',
              path: '/device_info',
              sort: 1002,
              createTime: '2020-07-13T00:51:07.000+0000',
              updateTime: '2020-08-13T06:28:01.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            }
          ]
        },
        {
          id: 109,
          parentId: 86,
          name: '事件管理',
          css: '',
          url: '/api-alarm/pages/openservice/openapi.html',
          sort: 1004,
          createTime: '2020-08-13T05:24:24.000+0000',
          updateTime: '2020-08-13T05:24:24.000+0000',
          systemcode: 'giveanalarm-center',
          systemservice: null,
          child: [
            {
              id: 110,
              parentId: 109,
              name: '事件解析',
              css: '',
              url: '/api-alarm/pages/openservice/openapi.html',
              sort: 1004001,
              createTime: '2020-08-13T05:25:07.000+0000',
              updateTime: '2020-08-13T05:25:07.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            },
            {
              id: 110,
              parentId: 109,
              name: '事件行为',
              css: '',
              url: '/api-alarm/pages/openservice/openapi.html',
              sort: 1004001,
              createTime: '2020-08-13T05:25:07.000+0000',
              updateTime: '2020-08-13T05:25:07.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            }
          ]
        },
        {
          id: 108,
          parentId: 86,
          name: '数据处理',
          css: '',
          url: '/api-alarm/pages/alarmquery/alarmquery.html',
          sort: 1005,
          createTime: '2020-08-13T05:07:43.000+0000',
          updateTime: '2020-08-13T05:23:19.000+0000',
          systemcode: 'giveanalarm-center',
          systemservice: null,
          child: [
            {
              id: 110,
              parentId: 109,
              name: '定标信息',
              css: '',
              url: '/api-alarm/pages/openservice/openapi.html',
              sort: 1004001,
              createTime: '2020-08-13T05:25:07.000+0000',
              updateTime: '2020-08-13T05:25:07.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            },
            {
              id: 110,
              parentId: 109,
              name: '告警信息',
              css: '',
              url: '/api-alarm/pages/openservice/openapi.html',
              sort: 1004001,
              createTime: '2020-08-13T05:25:07.000+0000',
              updateTime: '2020-08-13T05:25:07.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            },
            {
              id: 110,
              parentId: 110,
              name: '数据统计',
              css: '',
              url: '/api-alarm/pages/openservice/openapi.html',
              sort: 1004001,
              createTime: '2020-08-13T05:25:07.000+0000',
              updateTime: '2020-08-13T05:25:07.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            }
          ]
        },
        {
          id: 109,
          parentId: 86,
          name: '开放服务',
          css: '',
          url: '/api-alarm/pages/openservice/openapi.html',
          sort: 1004,
          createTime: '2020-08-13T05:24:24.000+0000',
          updateTime: '2020-08-13T05:24:24.000+0000',
          systemcode: 'giveanalarm-center',
          systemservice: null,
          child: [

            {
              id: 110,
              parentId: 109,
              name: '开放服务',
              css: '',
              url: '/api-alarm/pages/openservice/openapi.html',
              path: '/openService',
              sort: 1004001,
              createTime: '2020-08-13T05:25:07.000+0000',
              updateTime: '2020-08-13T05:25:07.000+0000',
              systemcode: 'giveanalarm-center',
              systemservice: null,
              child: null
            }
          ]
        },
        {
          id: 111,
          parentId: 87,
          name: '场景配置',
          css: '',
          url: '/api-alarm/pages/ruleManagement/ruleManagement.html',
          path: '/sceneConfig',
          sort: 1003001,
          createTime: '2020-08-13T05:31:44.000+0000',
          updateTime: '2020-08-13T05:34:18.000+0000',
          systemcode: 'giveanalarm-center',
          systemservice: null,
          child: null
        }
      ]
    }
  }
}
</script>
