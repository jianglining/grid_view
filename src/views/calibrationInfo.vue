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
     * 获取数据
     */
    getList () {
      var that = this
      var url = '/api/dbsource/queryByParamKey'
      var data01 = { sqlId: 'select_picketage_info', orderId: '0', params: {}, minRow: 0, maxRow: 94622 }
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
      filterForm: {
        cardNumber: ''
      },
      dataLabel: '暂无数据',
      loading: true,
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
