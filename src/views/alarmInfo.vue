<template>
  <div class="q-pa-md " >
    <q-table
      :data="data"
      :columns="columns"
      row-key="rn"
      rowsNumber=100
      class="my-sticky-header-table"
      :filter="filter"
      virtual-scroll
      selection="multiple"
      :selected.sync="selected"
      :pagination.sync="pagination"
      separator="cell"
      card-style="height:90vh"
      table-header-class="bg-blue-8 text-white"
    >
    <!--操作选项-->
     <template v-slot:top>
          <strong style="float:left;margin-left:10px;margin-right:10px;">设备名称</strong>
          <q-input
            outlined
            v-model="equipment_name"
            dense
            style="width:200px;float:left;"
          />

          <strong style="float:left;margin-left:10px;margin-right:10px;">告警等级</strong>
          <q-select
          outlined
          v-model="alarm_level"
          :options="options"
          dense
          style="width:200px;float:left;margin-right:10px;" />
          <!-- 搜索按钮 -->
          <q-btn
          color="primary"
          dense
          label="查询"
          unelevated
          @click="onsearch()"
          icon="search"
          style="float:left;height:37px;width:80px;margin-right:10px"/>
          <!-- 重置按钮 -->
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

          <q-td key="equipment_name" :props="props" @dblclick="look(props.row)">
            {{ props.row.equipment_name }}
          </q-td>

          <q-td key="alarm_describe" :props="props" @dblclick="look(props.row)">
            {{ props.row.alarm_describe }}
          </q-td>

          <q-td key="alarm_status" :props="props" @dblclick="look(props.row)">
            {{ props.row.alarm_status }}
          </q-td>

          <q-td key="alarm_time" :props="props" @dblclick="look(props.row)">
            {{ props.row.alarm_time }}
          </q-td>
    </q-tr>
      <!--弹窗-->
      <q-dialog v-model="prompt" seamless>
      <q-card style="min-width: 47%;height:45%;box-shadow:0px 0px 3px #aaa;">
        <q-card-section class="text-h6 bg-light-blue-6 " style="width:100%;height:60px;">
          <div>
            告警信息
            <q-btn class="float-right" flat icon="close" v-close-popup size="12px">
              <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
        <!--弹框滚动条-->
        <div>
          <q-scroll-area style="width:100% ; height:230px; margin-top:0px" >
            <q-card-section style="width:100% ;height:40px;">
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex;padding-top:5%">
                <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                  设备名称：
                </div>
               <q-input outlined disable class="bg-grey-2" v-model="equipment_name" :dense="true" style="height:40px;float:left;margin-right:20px"/>
                <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                  所选产品：
                </div>
                <q-input outlined  disable class="bg-grey-2" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              </div>
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex;margin-top:5%">
                <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                  在线状态：
                </div>
               <q-input outlined disable class="bg-grey-2" :dense="true" style="height:40px;float:left;margin-right:20px"/>
                <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                  图标路径：
                </div>
                <q-input outlined class="bg-grey-2" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              </div>
             </q-card-section>
          </q-scroll-area>
        </div>
        </q-card>
      </q-dialog>
      </template>
      <template v-slot:bottom class="justify-end">
          <!-- 显示记录数和数据总数 -->
          <span style="margin-right:5px;">
            显示{{ startPage }}~{{ endPage }}条记录，
            总{{ pagination.rowsNumber }}条数据
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
            style="float:left;margin-right:5px;"
          />
          <span style="margin-right:5px;">
            条记录
          </span>
          <div class="pagination">
          <!-- 分页 -->
          <q-pagination
            v-model="pagination.page"
            :max='pages'
            :max-pages="5"
            ellipsess
            :direction-links="true"
            @input="changePagination"
          >
          </q-pagination>
          <!-- 跳转 -->
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      filterForm: {
        status: '',
        deviceName: ''
      },
      startPage: 1, // 开始记录数
      endPage: 19, // 结束记录数
      pages: '', // 数据总页数
      toPage: '', // 跳转至
      pagination: {
        page: 1, // 页码
        rowsPerPage: 19, // 当前记录数
        rowsNumber: '' // 总共数据条数
      },
      optionsPage: [
        19, 30, 50, 100
      ],
      current: 1,
      changeColor: false,
      searchIf: false, // 判断是否点击了查询按钮
      module_equipment_id: '',
      alarm_describe: '',
      alarm_status: '',
      alarm_level: '',
      filter: '',
      alarm_time: '',
      equipment_name: '',
      checked: false,
      test: 100,
      selected: [],
      dense: false,
      prompt: false,
      options: [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
      ],
      columns: [
        { name: 'equipment_name', align: 'center', label: '设备名称', field: 'equipment_name' },
        { name: 'alarm_describe', align: 'center', label: '告警记录', field: row => row.alarm_describe },
        { name: 'alarm_status', align: 'center', label: '告警等级', field: 'alarm_status' },
        { name: 'alarm_time', label: '告警时间', align: 'center', field: 'alarm_time' }
      ],
      data: [],
      searchData: []
    }
  },
  mounted () {
    this.getList(this.startPage - 1, this.endPage, this.equipment_name, this.alarm_level)
  },
  methods: {
    /**
    *  点击页数的值跳转到该页的数据列表
    *  @param val 选择的页码
    */
    changePagination (val) {
      this.startPage = (val - 1) * this.pagination.rowsPerPage + 1
      if (val * this.pagination.rowsPerPage > this.pagination.rowsNumber) {
        this.endPage = this.pagination.rowsNumber
      } else {
        this.endPage = val * this.pagination.rowsPerPage
      }
      this.toPage = ''
      this.getList(this.startPage - 1, this.endPage, this.equipment_name, this.alarm_level)
    },
    /**
    *  输入跳转页面的值
    *  @param val 跳转页面的值
    */
    changeToPage (val) {
      var r = /^\+?[1-9][0-9]*$/
      if (r.test(val) && parseInt(val) <= this.pages) {
        // 输入正整数 且 小于最大页数
        // console.log(`input toPage: ${val} 是一个正整数`)
      } else {
        this.$q.notify({
          message: '请输入正确的页码',
          color: 'red',
          position: 'center',
          timeout: 5
        })
        this.toPage = ''
      }
    },
    /**
    *  选择一页显示的记录数
    * @param val 记录数
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
      this.getList(this.startPage - 1, this.endPage, this.equipment_name, this.alarm_level)
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
        this.getList(this.startPage - 1, this.endPage, this.equipment_name, this.alarm_level)
      }
    },
    /**
    *  搜索
    */
    onsearch () {
      this.searchIf = true
      this.getList(this.startPage - 1, this.endPage, this.equipment_name, this.alarm_level)
    },
    /**
    *  重置
    */
    reset () {
      this.searchIf = true
      this.equipment_name = ''
      this.alarm_level = ''
      this.data = this.basicData
      this.getList(this.startPage - 1, this.endPage, this.equipment_name, this.alarm_level)
    },
    /**
    *  点击任一表格数据进行查看
    */
    look (s) {
      this.prompt = true
      this.module_equipment_id = s.module_equipment_id
      this.equipment_name = s.equipment_name
      this.alarm_describe = s.alarm_describe
      this.alarm_time = s.alarm_time
      this.alarm_status = s.alarm_status
    },
    /**
    *  获取后台数据
    *  @param accessUrl 请求地址
    *  @param pdate 请求参数
    *  @param successCallback 成功回调
    *  @param errorCallback 失败回调
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
    *  请求数据
    *  @param startPage 开始记录数
    *  @param endPage 结束记录数
    *  @param paramsName param里的equipment_name参数
    *  @param paramGrade param里的alarm_grade参数
    */
    getList (startPage, endPage, paramsName, paramGrade) {
      var that = this
      var data01
      var url = '/api/dbsource/queryByParamKey'
      if (that.searchIf === false) {
        data01 = {
          sqlId: 'select_alarm_info',
          orderId: '0',
          minRow: startPage,
          maxRow: endPage,
          params: { }
        }
      } else {
        data01 = {
          sqlId: 'select_alarm_info',
          orderId: '0',
          minRow: startPage,
          maxRow: endPage,
          params: { equipment_name: paramsName, alarm_grade: paramGrade },
          whereId: '0'
        }
      }
      data01 = 'args=' + JSON.stringify(data01)
      // console.log('访问参数：', data01)
      // 后台数据访问
      this.dataAccess(url, data01, function (res) {
        // console.log('后端返回数据结果json：', res)
        // 获取数据传给data
        // 再从后端返回数据结果json中再取出data字段就可以得到数据库查询的结果
        that.data = res.data.data.data
        that.basicData = res.data.data.data
        // 获取数据总数
        that.pagination.rowsNumber = res.data.data.count
        // 设置分页页数
        if (that.pagination.rowsNumber % that.pagination.rowsPerPage === 0) {
          that.pages = that.pagination.rowsNumber / that.pagination.rowsPerPage
        } else {
          // 分页页数向上取整
          that.pages = Math.ceil(that.pagination.rowsNumber / that.pagination.rowsPerPage)
        }
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
    }
  }
}
</script>
<style>
@import "../assets/css/tableStyle.css";
</style>
