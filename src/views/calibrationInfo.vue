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
    <!--插槽之前-->
     <template v-slot:top>
          <!-- <strong>卡号</strong>
          <q-input
          outlined
          v-model.trim="filterForm.cardNumber"
          dense
          class="operation_input"/> -->

          <q-input
          standout="bg-blue-6 text-white"
          v-model.trim="filterForm.cardNumber"
          label="卡号"
          label-color="blue-8"
          class="operation_input"
          dense />

          <q-btn
          color="primary"
          dense
          label="查询"
          unelevated
          @click="search()"
          icon="search"
          class="operation"/>
          <q-btn
          color="primary"
          dense
          label="重置"
          unelevated
           icon="refresh"
          @click="reset()"
          class="operation"/>
     </template>

     <!--主体插槽-->
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
      </template>

      <!--插槽之后-->
      <template v-slot:bottom class="justify-end">
          <!-- 显示到第几条记录数据,总共多少条数据 -->
          <span>
            显示{{startPage}}~{{ endPage}}条记录，总
            {{ pagination.rowsNumber }}
            条数据
          </span>

          <!-- 每页显示条数 -->
          <span>
            每页
          </span>
          <q-select
          outlined
          v-model="pagination.rowsPerPage"
          :options="options"
          dense
          @input="changeOptions"
          class="float-left"/>
          <span> 条记录  </span>

          <!-- 选中的记录 -->
          <span v-if="selected.length != 0">
            选中{{selected.length}}条记录
          </span>

          <!-- 分页 -->
          <div class="pagination float-right">
          <q-pagination
            v-model="pagination.page"
            :max="pages"
            :max-pages="5"
            ellipsess
            class="float-left"
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
          </div>
      </template>
    </q-table>

    <!--弹窗-->
      <q-dialog v-model="prompt" seamless >
      <q-card class="dialog_card shadow-1">
        <q-card-section class="text-h6 text-white bg-blue-8">
          <div>定标信息
            <q-icon name="close" class="float-right" v-close-popup/>
          </div>
        </q-card-section>
        <!--弹框滚动条-->
        <div>
          <q-scroll-area class="scroll_area">
            <q-card-section class="dialog_card_section1">
              <div class="section_content">
              <div class="content_name text-body1">
                卡号：
              </div>
              <q-input outlined disable class="content_value bg-grey-2" v-model="card_number" :dense="true"/>
              <div class="content_name text-body1">
                设备名称：
              </div>
              <q-input outlined  disable class="content_value bg-grey-2" v-model="equipment_name" :dense="true"/>
              </div>
              <div class="section_content">
              <div class="content_name text-body1">
                事件信息：
              </div>
              <q-input outlined  disable class="content_value bg-grey-2" v-model="message" :dense="true"/>
              <div class="content_name text-body1">
                事件时间：
              </div>
              <q-input outlined  disable class="content_value bg-grey-2" v-model="requesttime" :dense="true"/>
              </div>
              <div class="section_content">
              <div class="content_name text-body1">
                设备ID：
              </div>
              <q-input outlined  disable class="content_value bg-grey-2" v-model="devicename" :dense="true"/>
              <div class="content_name text-body1">
                事件类型：
              </div>
              <q-input outlined  disable class="content_value bg-grey-2" v-model="identifier" :dense="true"/>
              </div>
             </q-card-section>
          </q-scroll-area>
          <q-separator inset size="1.5px" />
        </div>
        </q-card>
      </q-dialog>
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
      this.$q.notify({
        message: '正在查询中......',
        color: 'black',
        position: 'center',
        timeout: 1
      })
      this.getTableData(0, 10, this.filterForm.cardNumber)
    },
    /**
     * 获取列表数据
     * @param start 开始读取的页数
     * @param end 结束读取的页数
     * @param query 查询关键字
     */
    getTableData (start, end, query) {
      var that = this
      var url = '/api/dbsource/queryByParamKey'
      let minR = 0
      let maxR = 0
      maxR = that.pagination.rowsPerPage
      if (that.pagination.page !== 1) {
        minR = that.pagination.page
      }
      if (start !== '') {
        minR = start
        maxR = end
      }
      var data01 = { sqlId: 'select_picketage_info', orderId: '0', params: { card_number: query, requesttime: '' }, minRow: minR, maxRow: maxR, whereId: '0' }
      data01 = 'args=' + JSON.stringify(data01)
      // 后台数据访问
      this.dataAccess(url, data01, function (res) {
        // 获取数据传给basicData,data
        that.basicData = res.data.data.data
        that.data = that.basicData
        that.pagination.rowsNumber = res.data.data.count
        // 当记录数小于每页显示数目时，将查询出的数目赋给结束记录数
        if (res.data.data.count < that.pagination.rowsPerPage && res.data.data.count !== 0 && res.data.data.count !== null) {
          that.endPage = res.data.data.count
        }
        // 设置分页页数
        if (res.data.data.count % that.pagination.rowsPerPage === 0) {
          that.pages = res.data.data.count / that.pagination.rowsPerPage
        } else {
          // 分页页数向上取整
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
      this.getTableData(0, 10, this.filterForm.cardNumber)
    },
    /**
     * 双击查看详情
     * @param row 该行的数组
     */
    look (row) {
      this.prompt = true
      this.devicename = row.devicename
      this.equipment_name = row.equipment_name
      this.message = row.message
      this.card_number = row.card_number
      this.requesttime = row.requesttime
      this.identifier = row.identifier
    },
    /**
     * 数据访问
     * @param accessUrl 访问路径
     * @param pdata 参数
     * @param successCallback 操作成功的回调函数
     * @param errorCallback 操作失败的回调函数
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
     * @param val 选中下拉按钮的值
     */
    changeOptions (val) {
      // 处理当处于分页的最后一页时,如果选择显示页数大于原来显示页数
      // 设置开始记录数
      if (this.pagination.page >= Math.ceil(this.pagination.rowsNumber / val) || this.pagination.page === 0) {
        this.startPage = (Math.ceil(this.pagination.rowsNumber / val) - 1) * val + 1
      } else {
        this.startPage = (this.pagination.page - 1) * val + 1
      }
      // 设置结束记录数
      if (this.pagination.page * this.val > this.pagination.rowsNumber) {
        this.endPage = this.pagination.rowsNumber
      } else {
        this.endPage = this.pagination.page * val
      }
      // 当总记录数小于选中条数时
      if (this.pagination.rowsNumber < this.pagination.rowsPerPage) {
        this.endPage = this.pagination.rowsNumber
      }
      this.getTableData(this.startPage - 1, this.endPage, this.filterForm.cardNumber)
    },
    /**
     * 改变分页
     * @param val 选中的分页码
     */
    changePagination (val) {
      // 设置开始记录数
      this.startPage = (val - 1) * this.pagination.rowsPerPage + 1
      if (val * this.pagination.rowsPerPage > this.pagination.rowsNumber) {
        this.endPage = this.pagination.rowsNumber
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
        this.$q.notify({
          message: '请输入正确的页码',
          color: 'black',
          position: 'center',
          timeout: 5
        })
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
          this.endPage = this.pagination.rowsNumber
        } else {
          this.endPage = parseInt(this.toPage) * this.pagination.rowsPerPage
        }
        this.pagination.page = parseInt(this.toPage)
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
        page: 0, // 当前记录数
        rowsPerPage: 10, // 每页记录数
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
