<template>
  <div class="q-pa-none">
    <q-table
      :data="data"
      :columns="columns"
      row-key="rn"
      rowsNumber="100"
      :filter="filter"
      virtual-scroll
      class="my-sticky-header-table"
      separator="cell"
      card-style="height:100vh"
      selection="multiple"
      id="table"
      :selected.sync="selected"
      :pagination.sync="pagination"
      pagination.sync="selected"
      no-data-label="暂无数据"
      table-header-class="bg-blue-8 text-white"
    >
      <!--插槽之前-->
      <template v-slot:top>
        <!-- <strong>设备名称</strong>
          <q-input
          outlined
          v-model.trim="filterForm.deviceName"
          dense
          class="operation_input"/>
          <strong>在线状态</strong>
          <q-select
          outlined
          v-model.trim="filterForm.status"
          :options="options"
          dense
          class="operation_input" /> -->

        <q-input
          standout="bg-blue-6 text-white"
          v-model.trim="filterForm.deviceName"
          label="设备名称"
          label-color="blue-8"
          class="operation_input"
          dense
        />
        <q-select
          class="operation_input"
          standout="bg-blue-6 text-white"
          label="在线状态"
          color="blue-8"
          v-model="filterForm.status"
          :options="options"
          option-value="value"
          option-label="label"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
        </q-select>

        <q-btn
          color="primary"
          dense
          label="查询"
          unelevated
          @click="search()"
          icon="search"
          class="operation"
        />
        <q-btn
          color="primary"
          dense
          label="重置"
          unelevated
          icon="refresh"
          @click="reset()"
          class="operation"
        />
        <q-btn
          color="primary"
          dense
          label="更新设备信息"
          @click="update()"
          unelevated
          icon="add"
          class="operation_update"
        />
      </template>

      <!--主体插槽-->
      <template v-slot:body="props">
        <q-tr :props="props" :class="{ selected: changeColor }">
          <q-td @dblclick="look(props.row)">
            <q-checkbox key="props.row.rn" v-model="props.selected" />
          </q-td>

          <q-td key="equipment_name" :props="props" @dblclick="look(props.row)">
            {{ props.row.equipment_name }}
          </q-td>

          <q-td key="equipment_type" :props="props" @dblclick="look(props.row)">
            {{ props.row.equipment_type }}
          </q-td>

          <q-td
            key="equipment_state"
            :props="props"
            @dblclick="look(props.row)"
          >
            {{ props.row.equipment_state }}
          </q-td>
        </q-tr>
      </template>

      <!--插槽之后-->
      <template v-slot:bottom class="justify-end">
        <!-- 显示到第几条记录数据,总共多少条数据 -->
        <span>
          显示{{ startPage }}~{{ endPage }}条记录，总
          {{ pagination.rowsNumber }}
          条数据
        </span>
        <!-- 每页显示条数 -->
        <span> 每页 </span>
        <q-select
          outlined
          v-model="pagination.rowsPerPage"
          :options="optionsPage"
          dense
          @input="changeOptions"
          class="float-left"
        />
        <span> 条记录 </span>
        <!-- 选中的记录 -->
        <span v-if="selected.length != 0">
          选中{{ selected.length }}条记录
        </span>
        <!-- 分页 -->
        <div class="pagination float-right">
          <q-pagination
            v-model="pagination.page"
            :max="pages"
            :max-pages="5"
            class="float-left"
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
        </div>
      </template>
    </q-table>

    <!--弹窗-->
    <q-dialog v-model="prompt" seamless>
      <q-card class="dialog_card shadow-1">
        <q-card-section
          class=" text-h6 text-white bg-blue-8"
        >
          <div>
            设备信息
            <q-btn icon="close" flat class="float-right" round dense v-close-popup />
          </div>
        </q-card-section>
        <!--弹框滚动条-->
        <div>
          <q-scroll-area class="scroll_area">
            <q-card-section class="dialog_card_section1">
              <div class="section_content">
                <div class="content_name text-body1">设备名称：</div>
                <q-input
                  outlined
                  disable
                  class="content_value bg-grey-2"
                  v-model="equipment_name"
                  :dense="true"
                />
                <div class="content_name text-body1">设备ID：</div>
                <q-input
                  outlined
                  disable
                  class="content_value bg-grey-2"
                  v-model="module_equipment_id"
                  :dense="true"
                />
              </div>
              <div class="section_content">
                <div class="content_name text-body1">所选产品：</div>
                <q-input
                  outlined
                  disable
                  class="content_value bg-grey-2"
                  v-model="equipment_type"
                  :dense="true"
                />
                <div class="content_name text-body1">在线状态：</div>
                <q-input
                  outlined
                  disable
                  class="content_value bg-grey-2"
                  v-model="equipment_state"
                  :dense="true"
                />
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
    this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
    this.getHeight()
  },
  methods: {
    /**
     * 更改表格高度
     */
    getHeight () {
      // var height = 100 / document.body.clientHeight * (document.body.clientHeight - document.getElementById('table').offsetTop) + 'vh'
      var height = 100 / document.body.clientHeight * (document.body.clientHeight - 58) + 'vh'
      document.getElementById('table').style.height = height
    },
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
          that.getTableData(0, 10, that.filterForm.deviceName, that.filterForm.status)
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
      this.getTableData(0, 10, this.filterForm.deviceName, this.filterForm.status)
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
      this.getTableData(0, 10, this.filterForm.deviceName, this.filterForm.status)
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
     * 数据访问
     * @param accessUrl 访问路径
     * @param pdata 参数
     * @param successCallback 操作成功的回调函数
     * @param errorCallback 操作失败的回调函数
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
     * @param query2 查询关键字2——在线状态
     */
    getTableData (start, end, query1, query2) {
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
      var data01 = { sqlId: 'select_equipment_info', orderId: 0, params: { equipment_name: query1, equipment_state: query2 }, minRow: minR, maxRow: maxR, whereId: 0 }
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
      this.getTableData(this.startPage - 1, this.endPage, this.filterForm.deviceName, this.filterForm.status)
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
      * @param val 输入跳转的值
      */
    changeToPage (val) {
      this.selected = []
      var r = /^\+?[1-9][0-9]*$/
      // 输入正整数 且 小于最大页数
      if (r.test(val) && parseInt(val) <= this.pages) {
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
        page: '', // 当前记录数
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
