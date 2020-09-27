<template>
  <div class="q-pa-md " >
    <q-table
      :data="data"
      :columns="columns"
      row-key="rn"
      :filter="filter"
      virtual-scroll
      class="my-sticky-header-table"
      separator="cell"
      card-style="height:85vh"
      selection="multiple"
      :selected.sync="selected"
      :selected-rows-label="getSelectedString"
      pagination.sync="selected"
      rows-per-page-label="每页显示"
      :rows-per-page-options="[10,20,30]"
      no-data-label="暂无数据"
      table-header-class="bg-blue-8 text-white"
    >
    <!--操作选项-->
     <template v-slot:top>
          <strong style="float:left;margin-left:10px;margin-right:10px;">设备名称</strong>
          <q-input
          outlined
          v-model.trim="filterForm.deviceName"
          dense
          style="width:200px;float:left;" />

          <strong style="float:left;margin-left:10px;margin-right:10px;">在线状态</strong>
          <q-select
          outlined
          v-model.trim="filterForm.status"
          :options="options"
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
          <q-btn
          color="primary"
          dense
          label="更新设备信息"
          @click="update()"
          unelevated
          icon="add"
          style="float:left;height:37px;width:180px"/>
     </template>

     <!--表格内容-->
    <template v-slot:body="props">
        <q-tr  :props="props" :class="{ 'selected': changeColor }" >
          <q-td @dblclick="look(props.row)">
            <q-checkbox key="props.row.rn" v-model="props.selected"/>
          </q-td>

          <q-td key="equipment_name" :props="props" @dblclick="look(props.row)">
            {{ props.row.equipment_name }}
          </q-td>

          <q-td key="equipment_type" :props="props" @dblclick="look(props.row)">
            {{ props.row.equipment_type }}
          </q-td>

          <q-td key="equipment_state" :props="props" @dblclick="look(props.row)">
            {{ props.row.equipment_state }}
          </q-td>
    </q-tr>
      <!--弹窗-->
      <q-dialog v-model="prompt" seamless >
      <q-card style="min-width: 47%;height:45%;box-shadow:0px 0px 3px #aaa;">
        <q-card-section class="text-h6 text-white bg-blue-8 " style="width:100%;height:60px;">
          <div>设备信息<q-icon name="close" style="float:right" v-close-popup/></div>
        </q-card-section>
        <!--弹框滚动条-->
        <div>
          <q-scroll-area style="width:100% ; height:200px; margin-top:0px" >
            <q-card-section style="width:100% ;height:40px;">
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex">
              <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                设备名称：
              </div>
              <q-input outlined disable class="bg-grey-2" v-model="equipment_name" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              <div class="text-body1" style="width:100px;height:40px;float:left;text-align:left;line-height:40px;">
                设备ID：
              </div>
              <q-input outlined  disable class="bg-grey-2" v-model="module_equipment_id" :dense="true" style="height:40px;float:left"/>
              </div>
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex;margin-top:15px">
              <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                所选产品：
              </div>
              <q-input outlined  disable class="bg-grey-2" v-model="equipment_type" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              <div class="text-body1" style="width:100px;height:40px;float:left;text-align:left;line-height:40px;">
                在线状态：
              </div>
              <q-input outlined  disable class="bg-grey-2" v-model="equipment_state" :dense="true" style="height:40px;float:left"/>
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
          :options="optionsPage"
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
    this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
  },
  methods: {
    /**
     * 更新设备信息
     */
    update () {
      this.$q.notify({
        message: '正在更新',
        color: 'black',
        position: 'center',
        timeout: 1
      })
      var that = this
      var url = '/api//equipment/save'
      var data02 = []
      // 后台数据访问
      this.dataAccess(url, data02, function (res) {
        that.updateFlag = res.data.success
        if (that.updateFlag === true) {
          that.$q.notify({
            message: '更新成功',
            color: 'black',
            position: 'center',
            timeout: 200
          })
        } else if (that.updateFlag === false) {
          that.$q.notify({
            message: '更新失败',
            color: 'black',
            position: 'center',
            timeout: 200
          })
        }
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
    },
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
      this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
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
      this.filterForm.deviceName = ''
      this.filterForm.status = ''
      this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
    },
    /**
     * 双击查看详情
     * @param row 该行的数组
     */
    look (row) {
      this.prompt = true
      this.module_equipment_id = row.module_equipment_id
      this.equipment_name = row.equipment_name
      this.equipment_state = row.equipment_state
      this.equipment_type = row.equipment_type
    },
    /**
     * 重写选中显示的文字
     */
    getSelectedString (numberOfRows) {
      return '共选中' + numberOfRows + '条记录'
    },
    /**
     * 数据访问
     */
    dataAccess (accessUrl, pdata, successCallback, errorCallback) {
      if (pdata === undefined || pdata.length <= 0) {
        this.$axios({
          method: 'GET',
          url: accessUrl,
          type: 'json'
        })
          .then(successCallback)
          .catch(errorCallback)
      } else {
        this.$axios({
          method: 'POST',
          url: accessUrl,
          data: pdata,
          type: 'json'
        })
          .then(successCallback)
          .catch(errorCallback)
      }
    },
    /**
     * 获取列表数据
     * @param start 开始读取的页数
     * @param end 结束读取的页数
     * @param query1 查询关键字1——设备名称
     * @param query2 查询关键字2——设备名称
     */
    getTableData (start, end, query1, query2) {
      console.log('查询参数1：', query1)
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
      // 对在线状态进行处理
      if (query2 === '在线') {
        query2 = '0'
      } else if (query2 === '离线') {
        query2 = '1'
      }
      // var data01 = { sqlId: 'select_equipment_info', whereId: '4', orderId: '0', params: {}, minRow: 0, maxRow: 19 }
      var data01 = { sqlId: 'select_equipment_info', orderId: 0, params: { equipment_name: query1, equipment_state: query2 }, minRow: minR, maxRow: maxR, whereId: 0 }
      data01 = 'args=' + JSON.stringify(data01)
      console.log('访问参数：', data01)
      // 后台数据访问
      this.dataAccess(url, data01, function (res) {
        console.log('后端返回数据结果json：', res)
        // 获取数据传给basicData,data
        that.basicData = res.data.data.data
        that.data = that.basicData
        that.pagination.rowsNumber = res.data.data.count
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
    },
    /**
     * 改变显示条数
     * @param val 选中下拉按钮的值
     */
    changeOptions (val) {
      // 处理当处于分页的最后一页时,如果选择显示页数大于原来显示页数
      if (this.pagination.page >= Math.ceil(this.pagination.rowsNumber / val)) {
        this.startPage = (Math.ceil(this.pagination.rowsNumber / val) - 1) * val + 1
        this.endPage = this.pagination.rowsNumber
        this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
      } else {
        // 设置开始记录数
        this.startPage = (this.pagination.page - 1) * val + 1
        if (this.pagination.page * this.val > this.pagination.rowsNumber) {
          this.endPage = this.pagination.rowsNumber
        } else {
          this.endPage = this.pagination.page * val
        }
        this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
      }
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
      this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
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
          this.endPage = this.pagination.rowsNumber
        } else {
          this.endPage = parseInt(this.toPage) * this.pagination.rowsPerPage
        }
        this.pagination.page = parseInt(this.toPage)
        this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
      }
    }
  },
  data () {
    return {
      optionsPage: [
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
        status: '',
        deviceName: ''
      },
      updateFlag: '',
      changeColor: false,
      module_equipment_id: '',
      equipment_name: '',
      equipment_type: '',
      filter: '',
      equipment_state: '',
      checked: false,
      selected: [],
      dense: false,
      prompt: false,
      options: [
        '在线', '离线'
      ],
      columns: [
        { name: 'equipment_name', required: true, label: '备注名称', align: 'center', field: 'equipment_name' },
        { name: 'equipment_type', align: 'center', label: '所属产品', field: 'equipment_type' },
        { name: 'equipment_state', label: '在线状态', align: 'center', field: 'equipment_state' }
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
