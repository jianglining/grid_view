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
              v-model="treeSearch"
              input-class="text-right"
              class="q-ml-md"
              label-color="primary"
              @keyup.enter.native="ontreeSearch"
            >
              <template v-slot:append>
                <q-icon v-if="treeSearch === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="treeSearch = ''" />
              </template>
            </q-input>
             <q-separator inset />
            <!-- 树结构 -->
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
              <q-dialog v-model="increase" persistent :maximized="maximizedToggle">
                <q-card  style="min-width: 45%;max-width: 70%;min-height: 50%;max-height: 70%">
                <q-card-section class="bg-light-blue-6">
                  <div class="text-h6">新增API说明
                    <q-btn class="float-right" flat icon="close" v-close-popup size="12px" >
                      <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
                    </q-btn>
                    <q-btn class="float-right" flat icon="crop_square" size="12px" @click="maximizedToggle = true" :disable="maximizedToggle">
                      <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">最大化</q-tooltip>
                    </q-btn>
                    <q-btn class="float-right" flat icon="minimize" size="12px" @click="maximizedToggle = false" :disable="!maximizedToggle">
                      <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">最小化</q-tooltip>
                    </q-btn>
                  </div>
                </q-card-section>
                <form>
                <q-card-section>
                  <div class="text-h6">
                    <div style="width: 90%;height: 80%">
                    <q-input
                      v-model="api_name"
                      type="text"
                      dense
                      outlined
                      autogrow
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || '请输入API名称']"
                    >
                    <template v-slot:before>
                      <span class="input-label text-right q-pl-lg" style="font-size:18px">
                        API名称:
                      </span>
                    </template>
                    </q-input>
                    </div>
                    <div style="width: 90%;height: 80%">
                    <q-input
                      v-model="api_description"
                      type="textarea"
                      dense
                      outlined
                    >
                    <template v-slot:before>
                      <span class="input-label text-right q-pl-lg" style="font-size:18px">
                        API说明:
                      </span>
                    </template>
                    </q-input>
                    </div>
                  </div>
                </q-card-section>
                </form>
                <div class="absolute-bottom-right">
                <q-card-actions class="text-primary " >
                  <q-btn size="13px" color="primary" icon="send" label="保存" @click="save"/>
                </q-card-actions>
                </div>
                </q-card>
              </q-dialog>
              <!-- 编辑 -->
              <q-dialog v-model="edited" persistent :maximized="maximizedToggle">
                <q-card style="min-width: 45%;max-width: 70%;min-height: 50%;max-height: 70%">
                <q-card-section class="bg-light-blue-6">
                  <div class="text-h6">编辑
                    <q-btn class="float-right" flat icon="close" v-close-popup size="12px">
                      <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
                    </q-btn>
                    <q-btn class="float-right" flat icon="crop_square" size="12px" @click="maximizedToggle = true" :disable="maximizedToggle">
                      <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">最大化</q-tooltip>
                    </q-btn>
                    <q-btn class="float-right" flat icon="minimize" size="12px" @click="maximizedToggle = false" :disable="!maximizedToggle">
                      <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">最小化</q-tooltip>
                    </q-btn>
                  </div>
                </q-card-section>
                <form>
                <q-card-section class="q-pt-none q-mt-md">
                  <div class="text-h6">
                    <div style="width: 90%;height: 80%">
                    <q-input
                      v-model="addData.api_name"
                      dense
                      outlined
                      autogrow
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || '请输入API名称']"
                    >
                    <template v-slot:before>
                      <span class="input-label text-right q-pl-lg" style="font-size:18px">
                        API名称:
                      </span>
                    </template>
                    </q-input>
                    <q-input
                      v-model="addData.api_description"
                      type="textarea"
                      dense
                      outlined
                    >
                    <template v-slot:before>
                      <span class="input-label text-right q-pl-lg" style="font-size:18px">
                        API说明:
                      </span>
                    </template>
                    </q-input>
                    </div>
                  </div>
                </q-card-section>
                <div class="absolute-bottom-right">
                <q-card-actions align="right" class="text-primary">
                  <q-btn size="13px" color="primary" icon="send" label="保存" @click="submitEdit"/>
                  <q-btn size="13px" color="primary" icon="close" label="取消" v-close-popup />
                </q-card-actions>
                </div>
                </form>
                </q-card>
              </q-dialog>
              <!-- 删除 -->
              <q-dialog v-model="deleted" persistent>
                <q-card style="width: 25%;">
                <q-card-section class="bg-light-blue-6">
                  <div class="text-h6">删除
                    <q-btn class="float-right" flat icon="close" v-close-popup>
                      <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
                    </q-btn>
                  </div>
                </q-card-section>

                <q-card-section class="q-pt-none q-mt-md">
                  <div class="text-h6">是否删除已勾选的1个API说明？</div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn size="12px" color="primary" icon="send" label="确定" @click="onDelete"/>
                  <q-btn size="12px" color="primary" icon="close" label="取消" v-close-popup />
                </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </div>
      </template>

      <template v-slot:after>
        <!-- 内容显示区域 -->
        <div class="q-gutter-xs q-px-lg q-pt-lg">
          {{ addData.api_description }}
        </div>
      </template>
    </q-splitter>
  </div>
</template>
<script>
import { uid } from 'quasar'
export default {
  data () {
    return {
      splitterModel: 22,
      deleted: false,
      increase: false,
      edited: false,
      maximizedToggle: false,
      treeSearch: '',
      filter: '',
      name: '',
      address: '',
      api_name: '',
      api_description: '',
      text: '',
      selected: '',
      simple: [],
      simpleBackup: [],
      detailData: [],
      addData: {
        id: '',
        api_name: '',
        api_description: [],
        label: ''
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    /**
    *  搜索
    */
    ontreeSearch () {
      console.log()
      if (this.treeSearch === '') {
        this.simple = this.simpleBackup
        return
      }
      this.simple = []
      for (let i = 0; i < this.simpleBackup.length; i++) {
        const searchValue = this.simpleBackup[i].label.indexOf(this.treeSearch)
        if (searchValue !== -1) {
          this.simple.push(this.simpleBackup[i])
        }
      }
    },
    /**
    *  新增按钮响应事件
    */
    save () {
      // this.addData.id = ''
      const uids = uid()
      this.addData.id = uids
      this.addData.api_name = this.api_name
      this.addData.api_description = this.api_description
      // this.addData.label = ''
      var url = '/api/dbsource/updateByParamKey'
      var data02 = [{
        sqlId: 'insert_api_description',
        params: [{
          id: this.addData.id,
          api_name: this.addData.api_name,
          api_description: this.addData.api_description
        }]
      }]
      // console.log(this.addData)
      // console.log('*****保存的addData******')
      // var data01 = { sqlId: 'select_api_description' }
      data02 = 'args=' + JSON.stringify(data02)
      // console.log('访问参数：', data01)
      // 后台数据访问
      this.dataAccess(url, data02, function (res) {
        // console.log('后端返回数据结果json：', res.data)
        // var insertDate = res.data.data.data
        // 再从后端返回数据结果json中再取出data字段就可以得到数据库查询的结果
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
      this.$q.notify({
        message: '保存成功',
        color: 'green',
        position: 'center',
        timeout: 5
      })
      this.increase = false
      location.reload()
    },
    /**
    *  编辑按钮响应事件
    */
    submitEdit () {
      // this.addData.id = this.selected
      // this.addData.api_name = this.api_name
      // this.addData.api_description = this.api_description
      // this.addData.label = ''
      var url = '/api/dbsource/updateByParamKey'
      var data03 = [{
        sqlId: 'update_api_description',
        params: [{
          id: this.addData.id,
          api_name: this.addData.api_name,
          api_description: this.addData.api_description
        }]
      }]
      // var data01 = { sqlId: 'select_api_description' }
      data03 = 'args=' + JSON.stringify(data03)
      // console.log('访问参数：', data01)
      // 后台数据访问
      // console.log(this.addData.id)
      // console.log(this.addData.api_name)
      // console.log(this.addData.api_description)
      this.dataAccess(url, data03, function (res) {
        // var result = res.data.data
        // for (let i = 0; i < result.length; i++) {
        //   result[i].label = result[i].api_name
        // }
        // console.log('后端返回数据结果json：', res.data)
        // var insertDate = res.data.data.data
        // 再从后端返回数据结果json中再取出data字段就可以得到数据库查询的结果
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
      // this.getList()
      this.$q.notify({
        message: '保存成功',
        color: 'green',
        position: 'center',
        timeout: 5
      })
      this.edited = false
      location.reload()
    },
    /**
    *  删除按钮事件
    */
    onDelete () {
      var url = '/api/dbsource/updateByParamKey'
      var data04 = [{
        sqlId: 'delete_api_description',
        params: [{
          id: this.addData.id,
          api_name: this.addData.api_name,
          api_description: this.addData.api_description
        }]
      }]
      data04 = 'args=' + JSON.stringify(data04)
      // console.log('访问参数：', data01)
      // 后台数据访问
      this.dataAccess(url, data04, function (res) {
        this.$q.notify({
          message: 'green',
          color: 'black',
          position: 'center',
          timeout: 5
        })
        // console.log('后端返回数据结果json：', res.data)
        // var insertDate = res.data.data.data
        // 再从后端返回数据结果json中再取出data字段就可以得到数据库查询的结果
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
      this.deleted = false
      location.reload()
    },
    /**
    *  响应事件
    */
    onsubmit () {
      if (this.text === '') {
        alert('请输入事件行为识别')
      } else {
        this.increase = false
      }
    },
    /**
    *  获取后台数据
    */
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
        that.simpleBackup = result
        // console.log(result)
        // console.log(this.selected)
        // console.log(this.addData.id)
        console.log('*****请求数据的simple******')
        console.log(that.simple)
        // // 查看有没有取到的数据
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
    }
  },
  /**
  *  监听左侧点击事件
  */
  watch: {
    selected: function (newData, oldData) {
      for (let i = 0; i < this.simple.length; i++) {
        if (this.simple[i].id === this.selected) {
          this.addData.id = this.simple[i].id
          this.addData.api_name = this.simple[i].api_name
          this.addData.api_description = this.simple[i].api_description
          var a = this.addData.api_description.split('\n')
          for (let i = 0; i < a.length; i++) {
            a[i] = a[i].replace('<p>', '')
            a[i] = a[i].replace('</p>', '')
            a[i] = a[i].replace(/['"\b\f\n\r\t]/g, '')
          }
          // console.log(this.addData.id)
          // console.log(this.addData.api_name)
          // console.log(this.addData.api_description)
          this.addData.api_description = a
          // console.log(a)
          break
        }
        // console.log(this.addData.api_description)
      }
    }
  }
}
</script>
