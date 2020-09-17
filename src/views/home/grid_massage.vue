<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 90vh">
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="row" style="margin:10px">
            <!-- 搜索 -->
            <q-input
              label="网格节点搜索"
              style="width: 265px;margin-left: 0px"
              dense
              standout="bg-blue-6 text-white"
              v-model="search"
              input-class="text-right"
              class="q-ml-md"
              label-color="primary"
            >
              <template v-slot:append>
                <q-icon v-if="search === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
              </template>
            </q-input>
          </div>
          <q-tree
            :nodes="simple"
            node-key="label"
            selected-color="primary"
            :selected.sync="selected"
            default-expand-all
          />
        </div>
      </template>

      <template v-slot:after>
        <!-- <q-tab-panels
          v-model="selected"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >

          <q-tab-panel name="Food">
            <div class="text-h4 q-mb-md">Food</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
          </q-tab-panel>

          <q-tab-panel name="Room service">
            <div class="text-h4 q-mb-md">Room service</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
          </q-tab-panel>

          <q-tab-panel name="Room view">
            <div class="text-h4 q-mb-md">Room view</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
          </q-tab-panel>
        </q-tab-panels>-->
        <router-view />
      </template>
    </q-splitter>
  </div>
</template>
<script>
export default {
  data () {
    return {
      splitterModel: 20,
      selected: 'Food',
      simple: [
        {
          label: '网格节点',
          children: [
            {
              label: '网格节点一',
              icon: 'restaurant_menu'
            },
            {
              label: '网格节点二',
              icon: 'room_service'
            },
            {
              label: '网格节点三',
              icon: 'photo'
            }
          ]
        }
      ],
      items: [{ message: 'Foo' }, { message: 'Bar' }]
    }
  },
  methods: {},
  watch: {
    // 监听事件
    selected: function (newQuestion, oldQuestion) {
      this.$router.push({ path: '/about' })
    }
  }
}
</script>
