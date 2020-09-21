<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 90vh">
      <template v-slot:before>
          <div class="q-pa-md q-gutter-sm">
            <!-- 搜索框 -->
            <q-input
              label="输入关键字搜索"
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
            <q-tree
              :nodes="simple"
              node-key="label"
              selected-color="primary"
              :selected.sync="selected"
              default-expand-all
           />
            <!-- 按钮 -->
            <div class="q-gutter-xs absolute-bottom">
              <q-btn size="12px" color="primary" icon="add" label="添加" @click="increase = true"/>
              <q-btn size="12px" color="primary" icon="colorize" label="编辑" @click="edited = true"/>
              <q-btn size="12px" color="primary" icon="delete" label="删除" @click="deleted = true"/>
              <!-- 弹出框 -->
              <!-- 增加 -->
              <q-dialog v-model="increase" persistent>
                <q-card  style="width: 65%;height: 45%">
                <q-card-section class="bg-light-blue-6">
                  <div class="text-h6">新增API说明
                    <q-btn class="float-right" flat icon="close" v-close-popup size="12px"/>
                    <q-btn class="float-right" flat icon="crop_square" size="12px"/>
                    <q-btn class="float-right" flat icon="minimize" auto-close size="12px"/>
                  </div>
                </q-card-section>
                <form>
                <q-card-section class="q-pt-none q-mt-md">
                  <div class="text-h6">
                    <q-input
                      filled
                      v-model="name"
                      label="API名称"
                      outlined
                      autogrow
                      dense
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please type something']"
                    >
                    <template v-slot:before>
                      <span class="input-label text-right " style="font-size:18px">
                        API名称:
                      </span>
                    </template>
                    </q-input>
                    <q-input
                      filled
                      v-model="text"
                      type="textarea"
                      label="API说明"
                      outlined
                      dense
                    >
                    <template v-slot:before>
                      <span class="input-label text-right " style="font-size:18px">
                        API说明:
                      </span>
                    </template>
                    </q-input>
                  </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="确定" @click="onsubmit"  />
                  <q-btn flat label="取消" v-close-popup />
                </q-card-actions>
                </form>
                </q-card>
              </q-dialog>
              <!-- 编辑 -->
              <!-- fit row wrap justify-end items-start content-start -->
              <q-dialog v-model="edited" persistent>
                <q-card style="width: 65%;height: 45%">
                <q-card-section class="bg-light-blue-6">
                  <div class="text-h6">编辑
                    <q-btn class="float-right" flat icon="close" v-close-popup size="12px"/>
                    <q-btn class="float-right" flat icon="crop_square" size="12px"/>
                    <q-btn class="float-right" flat icon="minimize" auto-close size="12px"/>
                  </div>
                </q-card-section>
                <form>
                <q-card-section class="q-pt-none q-mt-md">
                  <div class="text-h6">
                    <q-input
                      filled
                      v-model="name"
                      label="API名称"
                      outlined
                      autogrow
                      dense
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || 'Please type something']"
                    >
                    <template v-slot:before>
                      <span class="input-label text-right " style="font-size:18px">
                        API名称:
                      </span>
                    </template>
                    </q-input>
                    <q-input
                      filled
                      v-model="text"
                      type="textarea"
                      label="API说明"
                      outlined
                      dense
                    >
                    <template v-slot:before>
                      <span class="input-label text-right " style="font-size:18px">
                        API说明:
                      </span>
                    </template>
                    </q-input>
                  </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="确定"  @click="submitEdit" />
                  <q-btn flat label="取消" v-close-popup />
                </q-card-actions>
                </form>
                </q-card>
              </q-dialog>
              <!-- 删除 -->
              <q-dialog v-model="deleted" persistent>
                <q-card style="width: 25%;">
                <q-card-section class="bg-light-blue-6">
                  <div class="text-h6">删除
                    <!-- <div style="margin-left:200px;margin-bottom: 30px;border-style:solid;border-width:0.5px;"> -->
                      <q-btn class="float-right" flat icon="close" v-close-popup />
                    </div>
                  <!-- </div> -->
                </q-card-section>

                <q-card-section class="q-pt-none q-mt-md">
                  <div class="text-h6">是否删除已勾选的1个API说明？</div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="确定" v-close-popup />
                  <q-btn flat label="取消" v-close-popup />
                </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selected"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="获取网格设备列表信息">
            <div class="text-h4 q-mb-md">获取网格设备列表信息</div>
            <p>请求方式<br>
               请求地址<br>
               请求参数<br>
               响应结果
            </p>
          </q-tab-panel>

          <q-tab-panel name="获取网格告警列表信息">
            <div class="text-h4 q-mb-md">获取网格告警列表信息</div>
            <p>请求方式<br>
               请求地址<br>
               请求参数<br>
               响应结果
            </p>
          </q-tab-panel>

          <q-tab-panel name="获取网格卡号列表信息">
            <div class="text-h4 q-mb-md">获取网格卡号列表信息</div>
            <p>请求方式<br>
               请求地址<br>
               请求参数<br>
               响应结果
            </p>
          </q-tab-panel>

          <q-tab-panel name="获取网格下的子网格信息">
            <div class="text-h4 q-mb-md">获取网格下的子网格信息</div>
            <p>请求方式<br>
               请求地址<br>
               请求参数<br>
               响应结果
            </p>
          </q-tab-panel>

          <q-tab-panel name="通过网格ID和设备ID获取信息">
            <div class="text-h4 q-mb-md">通过网格ID和设备ID获取信息</div>
            <p>请求方式<br>
               请求地址<br>
               请求参数<br>
               响应结果
            </p>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script>
export default {
  data () {
    return {
      splitterModel: 22,
      search: '',
      deleted: false,
      increase: false,
      edited: false,
      address: '',
      name: '',
      text: '',
      selected: '获取网格设备列表信息',
      simple: [
        {
          label: '开放服务',
          icon: 'photo',
          // avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          children: [
            {
              label: '获取网格设备列表信息',
              icon: 'photo'
              // children: [
              //   { label: 'Quality ingredients' },
              //   { label: 'Good recipe' }
              // ]
            },
            {
              label: '获取网格告警列表信息',
              icon: 'room_service'
              // disabled: true
              // children: [
              //   { label: 'Prompt attention' },
              //   { label: 'Professional waiter' }
              // ]
            },
            {
              label: '获取网格卡号列表信息',
              icon: 'photo'
              // children: [
              //   {
              //     label: 'Happy atmosphere (with image)',
              //     img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png'
              //   },
              //   { label: 'Good table presentation' },
              //   { label: 'Pleasing decor' }
              // ]
            },
            {
              label: '获取网格下的子网格信息',
              icon: 'photo'
            },
            {
              label: '通过网格ID和设备ID获取信息',
              icon: 'photo'
            }
          ]
        }
      ]
    }
  },
  methods: {
    onsubmit () {
      if (this.text === '') {
        alert('请输入事件行为识别')
      } else {
        this.increase = false
      }
    },
    submitEdit () {
      if (this.text === '') {
        alert('请输入事件行为识别')
      } else {
        this.edited = false
      }
    }
  }
}
</script>
