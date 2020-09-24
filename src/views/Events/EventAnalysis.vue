<template>
   <div>
     <q-splitter v-model="splitterModel">
        <div class="q-pa-md">
          <div class="q-gutter-md">
            <q-input
              v-model="search"
              debounce="500"
              filled
              placeholder="请输入关键字搜索"
              style="margin-bottom: 10px;"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <q-list bordered  style="height: 730px;">
            <q-item clickable v-ripple>
              <q-item-section>Single line item</q-item-section>
            </q-item>

            <q-separator spaced inset />

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>Item with caption</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset />

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label overline>OVERLINE</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset />
          </q-list>
       </div>
     </q-splitter>
   </div>
</template>
<script>
export default {
  data () {
    return {
      splitterModel: 20,
      search: '',
      api_name: '',
      selected: '',
      simple: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
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
<style scoped>
  .svgContent {
    height: 100%;
    width: 100%;
  }
  .main_content {
    height: 100%;
    width: 100%;
  }

</style>
