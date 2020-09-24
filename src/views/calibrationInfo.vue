<template>
  <div class="q-pa-md " >
    <q-table
      :data="data"
      :columns="columns"
      rowsNumber=100
      row-key="rn"
      :filter="filter"
      :loading="loading"
      class="my-sticky-header-table"
      virtual-scroll
      separator="cell"
      card-style="height:85vh"
      selection="multiple"
      :selected.sync="selected"
      :selected-rows-label="getSelectedString"
      pagination.sync="selected"
      rows-per-page-label="每页显示"
      :rows-per-page-options="[10,20,30]"
      :no-data-label="dataLabel"
      table-header-class="bg-blue-8 text-white"
      :pagination-label="getPaginationLabel"
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
        <div class="foot q-pa-md flex flex-center">
          <span>
            {{ pagination.rowsPerPage }}条/页 共
            {{ pagination.rowsNumber }}
            条数据
          </span>
          <q-pagination
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
        </div>
      </template>
    </q-table>
    </div>
</template>
<script>
export default {
  mounted () {
    this.getList()
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
        this.data = this.basicData
      } else {
        this.$q.notify({
          message: '正在查询中......',
          color: 'black',
          position: 'center',
          timeout: 1
        })
        this.data = this.basicData.filter(item => {
          if (item.card_number.indexOf(this.filterForm.cardNumber) !== -1) {
            return item
          }
        })
      }
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
      this.data = this.basicData
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
     * 重写分页标签
     * @param firstRowIndex 第一条下标
     * @param endRowIndex 最后一条下标
     * @param totalRowsNumber 总条数下标
     */
    getPaginationLabel (firstRowIndex, endRowIndex, totalRowsNumber) {
      return '显示 ' + firstRowIndex + ' ~ ' + endRowIndex + ' 条记录，总共' + totalRowsNumber + ' 条'
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
     * 数据访问
     */
    getList () {
      var that = this
      var url = '/api/dbsource/queryByParamKey'
      var data01 = { sqlId: 'select_picketage_info', orderId: '0', params: {}, minRow: 0, maxRow: 19 }
      data01 = 'args=' + JSON.stringify(data01)
      console.log('访问参数：', data01)
      // 后台数据访问
      this.dataAccess(url, data01, function (res) {
        console.log('后端返回数据结果json：', res)
        // 获取数据传给basicData,data
        that.basicData = res.data.data.data
        that.data = that.basicData
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
    }
  },
  data () {
    return {
      loading: true,
      pages: 10, // 数据总页数
      toPage: '', // 跳转至
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 50 // 总共数据条数
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
<style lang="sass">
/*设置奇数行颜色*/
.my-sticky-header-table tr:nth-child(odd)
    background: #F8F8FF
/*固定头部标题*/
.my-sticky-header-table
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
.my-sticky-header-table .q-checkbox__inner .q-checkbox__bg
    border: 1px solid #1976d2
    outline: 1px solid white
.my-sticky-header-table .q-checkbox__inner--truthy .q-checkbox__bg
    background: #1976d2
    border: 1px solid #1976d2
    outline: 1px solid white
.my-sticky-header-table  .q-checkbox__inner--indet .q-checkbox__bg
    background: #1976d2
    color: #000
    border: 0px solid #1976d2
    outline: 1px solid white

.my-sticky-header-table .pagination-input
    display: inline-block
    width: 55px
    margin-top: 0px
.my-sticky-header-table  .q-table__bottom
    justify-content: flex-left
    height: 80px
/*选中后字体颜色改变*/
.my-sticky-header-table .selected
      color: #4169E1
</style>
