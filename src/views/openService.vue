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
              node-key="id"
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
        <div class="q-gutter-xs q-px-lg q-pt-lg">
          {{ detailData }}
        </div>
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
      name: '',
      address: '',
      api_name: '',
      text: '',
      selected: '',
      simple: [],
      detailData: ''
    }
  },
  mounted () {
    this.getList()
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
    },
    dataAccess (accessUrl, pdata, successCallback, errorCallback) {
      this.$axios({
        method: 'post',
        url: accessUrl,
        data: pdata,
        type: 'json'
      })
        .then(successCallback)
        .catch(errorCallback)
    },
    getList () {
      var that = this
      var url = 'api/dbsource/query'
      var data01 = { sqlId: 'select_api_description' }
      // var data01 = { sqlId: 'select_grid_info', whereId: '2', orderId: '0', params: { parent_bm: '-1' }, minRow: 0, maxRow: 19 }
      data01 = 'args=' + JSON.stringify(data01)
      // console.log('访问参数：', data01)
      // 后台数据访问
      this.dataAccess(url, data01, function (res) {
        // console.log('后端返回数据结果json：', res.data)
        var result = res.data.data
        for (let i = 0; i < result.length; i++) {
          result[i].label = result[i].api_name
          // result[i].icon = 'add'
          // 加小图标
        }
        // 再从后端返回数据结果json中再取出data字段就可以得到数据库查询的结果
        that.simple = result
        console.log(result)
        // console.log(that.simple)
        // // 查看有没有取到的数据
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
    }
  },
  watch: {
    selected: function (newData, oldData) {
      // console.log(this.selected)
      // console.log(this.simple)
      for (let i = 0; i < this.simple.length; i++) {
        if (this.simple[i].id === this.selected) {
          this.detailData = this.simple[i].api_description
          var a = this.detailData.split('\n')
          for (let i = 0; i < a.length; i++) {
            a[i] = a[i].replace('<p>', '')
            a[i] = a[i].replace('</p>', '')
          }
          this.detailData = a
          console.log(a)
          break
        }
        // console.log(this.detailData)
      }
    }
  }
}
</script>
