<template>
  <div class="q-pa-md " >
    <q-table
      :data="data"
      :columns="columns"
      rowsNumber=100
      row-key="rn"
      :filter="filter"
      class="my-sticky-header-table"
      virtual-scroll
      separator="cell"
      card-style="height:85vh"
      selection="multiple"
      :selected.sync="selected"
      :pagination.sync="pagination"
      :no-data-label="dataLabel"
      table-header-class="bg-blue-8 text-white"
    >
    <!--操作选项-->
     <template v-slot:top>
          <strong style="float:left;margin-left:10px;margin-right:10px;">卡号</strong>
          <q-input
          outlined
          v-model.trim="filterForm.cardNumber"
          dense
          style="width:200px;float:left;margin-right:10px;" />
          <q-btn
          color="primary"
          dense
          label="查询"
          unelevated
          @click="search()"
          icon="search"
          style="float:left;height:37px;width:80px;margin-right:10px"/>
          <q-btn
          color="primary"
          dense
          label="重置"
          unelevated
           icon="refresh"
          @click="reset()"
          style="float:left;height:37px;width:80px;margin-right:10px"/>
     </template>

     <!--表格内容-->
    <template v-slot:body="props">
        <q-tr  :props="props" :class="{ 'selected': changeColor }" >
          <q-td @dblclick="look(props.row)">
            <q-checkbox key="props.row.rn" v-model="props.selected"/>
          </q-td>
          <q-td key="card_number" :props="props" @dblclick="look(props.row)">
            {{ props.row.card_number }}
          </q-td>
          <q-td key="equipment_name" :props="props" @dblclick="look(props.row)">
            {{ props.row.equipment_name }}
          </q-td>
          <q-td key="message" :props="props" @dblclick="look(props.row)">
            {{ props.row.message }}
          </q-td>
          <q-td key="identifier" :props="props" @dblclick="look(props.row)">
            {{ props.row.identifier }}
          </q-td>
          <q-td key="requesttime" :props="props" @dblclick="look(props.row)">
            {{ props.row.requesttime }}
          </q-td>
    </q-tr>
      <!--弹窗-->
      <q-dialog v-model="prompt" seamless >
      <q-card style="min-width: 47%;height:45%;box-shadow:0px 0px 3px #aaa;">
        <q-card-section class="text-h6 text-white bg-blue-8 " style="width:100%;height:60px;">
          <div>定标信息<q-icon name="close" style="float:right" v-close-popup/></div>
        </q-card-section>
        <!--弹框滚动条-->
        <div>
          <q-scroll-area style="width:100% ; height:200px; margin-top:0px" >
            <q-card-section style="width:100% ;height:40px;">
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex">
              <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                卡号：
              </div>
              <q-input outlined disable class="bg-grey-2" v-model="card_number" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              <div class="text-body1" style="width:100px;height:40px;float:left;text-align:left;line-height:40px;">
                设备名称：
              </div>
              <q-input outlined  disable class="bg-grey-2" v-model="equipment_name" :dense="true" style="height:40px;float:left"/>
              </div>
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex;margin-top:15px">
              <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                事件信息：
              </div>
              <q-input outlined  disable class="bg-grey-2" v-model="message" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              <div class="text-body1" style="width:100px;height:40px;float:left;text-align:left;line-height:40px;">
                事件时间：
              </div>
              <q-input outlined  disable class="bg-grey-2" v-model="requesttime" :dense="true" style="height:40px;float:left"/>
              </div>
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex;margin-top:15px">
              <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                设备ID：
              </div>
              <q-input outlined  disable class="bg-grey-2" v-model="devicename" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              <div class="text-body1" style="width:100px;height:40px;float:left;text-align:left;line-height:40px;">
                事件类型：
              </div>
              <q-input outlined  disable class="bg-grey-2" v-model="identifier" :dense="true" style="height:40px;float:left"/>
              </div>
             </q-card-section>
          </q-scroll-area>
          <q-separator inset size="1.5px" />
        </div>
        </q-card>
      </q-dialog>
      </template>
      <template v-slot:bottom class="justify-end">
          <span style="margin-right:5px;">
            显示{{startPage}}~{{ endPage}}条记录，总
            {{ pagination.rowsNumber }}
            条数据
          </span>
          <span style="margin-right:5px;">
            每页
          </span>
          <q-select
          outlined
          v-model="pagination.rowsPerPage"
          :options="options"
          dense
          @input="changeOptions"
          style="float:left;margin-right:5px;" />
          <span style="margin-right:5px;">
            条记录
          </span>
          <q-pagination
          style="float:right"
            v-model="pagination.page"
            :max="pages"
            :max-pages="5"
            ellipsess
            :direction-links="true"
            @input="changePagination"
          >
          </q-pagination>
          <span>跳至 </span>
          <q-input
            outlined
            v-model="toPage"
            dense
            class="pagination-input"
            @input="changeToPage"
            @keyup.enter.native="refreshTableData"
          ></q-input>
          <span> 页</span>
      </template>
    </q-table>
    </div>
</template>
<script>
export default {
  mounted () {
    this.getTableData(this.startPage - 1, this.endPage, this.filterForm.cardNumber)
  },
  methods: {
    /**
     * 查询
     */
    search () {
      if (this.filterForm.cardNumber === '') {
        this.$q.notify({
          message: '正在查询中......',
          color: 'black',
          position: 'center',
          timeout: 1
        })
        this.getTableData(1, 10, this.filterForm.cardNumber)
      } else {
        this.$q.notify({
          message: '正在查询中......',
          color: 'black',
          position: 'center',
          timeout: 1
        })
        this.getTableData(1, 10, this.filterForm.cardNumber)
      }
    },
    /**
     * 获取列表数据
     */
    getTableData (s, e, r) {
      var that = this
      var url = '/api/dbsource/queryByParamKey'
      let minR = 0
      let maxR = 0
      maxR = that.pagination.rowsPerPage
      if (that.pagination.page !== 1) {
        minR = that.pagination.page
      }
      if (s !== '') {
        minR = s
        maxR = e
      }
      var data01 = { sqlId: 'select_picketage_info', orderId: '0', params: { card_number: r, requesttime: '' }, minRow: minR, maxRow: maxR, whereId: '0' }
      data01 = 'args=' + JSON.stringify(data01)
      // 后台数据访问
      this.dataAccess(url, data01, function (res) {
        console.log('后端返回数据结果json：', res)
        // 获取数据传给basicData,data
        that.basicData = res.data.data.data
        that.data = that.basicData
        that.pagination.rowsNumber = res.data.data.count
        /* 设置分页页数 */
        if (res.data.data.count % that.pagination.rowsPerPage === 0) {
          that.pages = res.data.data.count / that.pagination.rowsPerPage
        } else {
          // 向上取整
          that.pages = Math.ceil(res.data.data.count / that.pagination.rowsPerPage)
        }
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    /**
     * 重置
     */
    reset () {
      this.$q.notify({
        message: '正在重置中......',
        color: 'black',
        position: 'center',
        timeout: 5
      })
      this.filterForm.cardNumber = ''
      this.getTableData(this.startPage - 1, this.endPage, this.filterForm.cardNumber)
    },
    /**
     * 双击查看详情
     * @param s 该行的数组
     */
    look (s) {
      this.prompt = true
      this.devicename = s.devicename
      this.equipment_name = s.equipment_name
      this.message = s.message
      this.card_number = s.card_number
      this.requesttime = s.requesttime
      this.identifier = s.identifier
    },
    /**
     * 数据访问
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
    /**
     * 改变显示条数
      */
    changeOptions (val) {
      this.startPage = (this.pagination.page - 1) * val + 1
      if (this.pagination.page * this.val > this.pagination.rowsNumber) {
        this.endPage = this.startPage + 1
      } else {
        this.endPage = this.pagination.page * val
      }
      this.getTableData(this.startPage - 1, this.endPage, this.filterForm.cardNumber)
    },
    /**
     * 改变分页
      */
    changePagination (val) {
      // 设置开始记录数
      this.startPage = (val - 1) * this.pagination.rowsPerPage + 1
      if (val * this.pagination.rowsPerPage > this.pagination.rowsNumber) {
        this.endPage = this.startPage + 1
      } else {
        this.endPage = val * this.pagination.rowsPerPage
      }
      this.toPage = val
      this.getTableData(this.startPage - 1, this.endPage, this.filterForm.cardNumber)
    },
    /**
      * 改变跳转分页
      */
    changeToPage (val) {
      this.selected = []
      var r = /^\+?[1-9][0-9]*$/
      if (r.test(val) && parseInt(val) <= this.pages) {
        // 输入正整数 且 小于最大页数
        // console.log(`input toPage: ${val} 是一个正整数`)
      } else {
        this.toPage = ''
      }
    },
    /**
      * 刷新数据表数据
      */
    refreshTableData () {
      if (this.toPage !== '') {
        this.startPage = (parseInt(this.toPage) - 1) * this.pagination.rowsPerPage + 1
        if (parseInt(this.toPage) * this.pagination.rowsPerPage > this.pagination.rowsNumber) {
          this.endPage = this.startPage + 1
        } else {
          this.endPage = parseInt(this.toPage) * this.pagination.rowsPerPage
        }
        this.pagination.page = parseInt(this.toPage)
        this.loading = true
        this.getTableData(this.startPage - 1, this.endPage, this.filterForm.cardNumber)
      }
    }
  },
  data () {
    return {
      options: [
        10, 30, 50, 100
      ],
      startPage: 1, // 开始记录数
      endPage: 10, // 结束记录数
      pages: '', // 数据总页数
      toPage: '', // 跳转至
      pagination: {
        page: '',
        rowsPerPage: 10,
        rowsNumber: '' // 总共数据条数
      },
      filterForm: {
        cardNumber: ''
      },
      dataLabel: '暂无数据',
      requesttime: '',
      message: '',
      changeColor: false,
      devicename: '',
      equipment_name: '',
      card_number: '',
      identifier: '',
      filter: '',
      checked: false,
      selected: [],
      dense: false,
      prompt: false,
      columns: [
        { name: 'card_number', align: 'center', label: '卡号', field: 'card_number' },
        { name: 'equipment_name', required: true, label: '备注名称', align: 'center', field: 'equipment_name' },
        { name: 'message', label: '动作消息', align: 'center', field: 'message' },
        { name: 'identifier', align: 'center', label: '事件类型', field: 'identifier' },
        { name: 'requesttime', label: '事件时间', align: 'center', field: 'requesttime' }
      ],
      data: [],
      basicData: []
    }
  }
}
</script>
<style>
@import "../assets/css/tableStyle.css";
</style>
