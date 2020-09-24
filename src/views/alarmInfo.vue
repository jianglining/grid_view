<template>
  <div class="q-pa-md " >
    <q-table
      :data="data"
      :columns="columns"
      row-key="rn"
      class="my-sticky-header-table"
      :filter="filter"
      virtual-scroll
      selection="multiple"
      :selected.sync="selected"
      :selected-rows-label="getSelectedString"
      separator="cell"
      card-style="height:85vh"
      pagination.sync="selected"
      :rows-per-page-options="[19]"
      table-header-class="bg-blue-8 text-white"
      :pagination-label="getPaginationLabel"
    >
    <!--操作选项-->
     <template v-slot:top>
          <strong style="float:left;margin-left:10px;margin-right:10px;">设备名称</strong>
          <q-input
          outlined
          v-model="filterForm.deviceName"
          dense
          style="width:200px;float:left;" />

          <strong style="float:left;margin-left:10px;margin-right:10px;">告警等级</strong>
          <q-select
          outlined
          v-model="filterForm.status"
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
          <!-- <q-btn
          color="primary"
          dense
          label="更新设备信息"
          unelevated
          icon="add"
          style="float:left;height:37px;width:180px"/> -->
     </template>
     <!-- <template v-slot:header-cell-select="props" >
        <q-th :props="props"  >
          <input type="checkbox" @click="selectAll"  :checked ="checked" style="zoom: 160%;"/>
        </q-th>
     </template> -->
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
      <q-dialog v-model="prompt" seamless >
      <q-card style="min-width: 47%;height:45%;box-shadow:0px 0px 3px #aaa;">
        <q-card-section class="text-h6 text-white bg-blue-8 " style="width:100%;height:60px;">
          <div>告警信息<q-icon name="close" style="float:right" v-close-popup/></div>
        </q-card-section>
        <!--弹框滚动条-->
        <div>
          <q-scroll-area style="width:100% ; height:230px; margin-top:0px" >
            <q-card-section style="width:100% ;height:40px;">
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex">
                <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                  设备名称：
                </div>
               <q-input outlined disable class="bg-grey-2" v-model="equipment_name" :dense="true" style="height:40px;float:left;margin-right:10px"/>
                <!-- <div class="text-body1" style="width:100px;height:40px;float:left;text-align:left;line-height:40px;">
                  设备ID：
                </div> -->
                <!-- <q-input outlined  disable class="bg-grey-2" v-model="module_equipment_id" :dense="true" style="height:40px;float:left"/> -->
              </div>
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex;margin-top:15px">
                <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                  所选产品：
                </div>
                <q-input outlined  disable class="bg-grey-2" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              </div>
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex;margin-top:15px">
                <div class="text-body1" style="width:12%;height:40px;float:left;text-align:left;line-height:40px;">
                  在线状态：
                </div>
                <q-input outlined  disable class="bg-grey-2" :dense="true" style="height:40px;float:left"/>
              </div>
              <div style="width:100%;height:40px;justify-content: center;align-items: center;display: -webkit-flex;margin-top:15px">
                <div class="text-body1" style="width:13%;height:40px;float:left;text-align:left;line-height:40px;">
                  图标路径：
                </div>
                <q-input outlined class="bg-grey-2" :dense="true" style="height:40px;float:left;margin-right:10px"/>
              </div>
             </q-card-section>
          </q-scroll-area>
          <!-- <q-separator inset size="1.5px" /> -->
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
    // 搜索
    search () {
      if (this.filterForm.deviceName === '' && this.filterForm.status === '') {
        // this.searchData = this.data
        // this.data = this.searchData
        this.$q.notify({
          message: '正在查询中......',
          color: 'black',
          position: 'center',
          timeout: 5
        })
      } else if (this.filterForm.deviceName !== '' && this.filterForm.status !== '') {
        this.data = this.basicData.filter(item => {
          if (item.equipment_name.indexOf(this.filterForm.deviceName) !== -1 && item.alarm_level.indexOf(this.filterForm.status) !== -1) {
            return item
          }
        })
      } else if (this.filterForm.deviceName !== '' && this.filterForm.status === '') {
        this.data = this.basicData.filter(item => {
          if (item.equipment_name.indexOf(this.filterForm.deviceName) !== -1) {
            return item
          }
        })
      } else if (this.filterForm.deviceName === '' && this.filterForm.status !== '') {
        this.data = this.basicData.filter(item => {
          if (item.alarm_level.indexOf(this.filterForm.status) !== -1) {
            return item
          }
        })
      }
    },
    // 重置
    reset () {
      this.filterForm.deviceName = ''
      this.filterForm.status = ''
      this.data = this.basicData
    },
    // 查看详情
    look (s) {
      this.prompt = true
      this.module_equipment_id = s.module_equipment_id
      this.equipment_name = s.equipment_name
      this.alarm_describe = s.alarm_describe
      this.alarm_time = s.alarm_time
      this.alarm_status = s.alarm_status
    },
    /**
     * 重写选中显示的文字
     */
    getSelectedString (numberOfRows) {
      return '共选中' + numberOfRows + '条记录'
    },
    getPaginationLabel (firstRowIndex, endRowIndex, totalRowsNumber) {
      return '显示 ' + firstRowIndex + ' ~ ' + endRowIndex + ' 条记录，总共' + totalRowsNumber + ' 条'
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
      var url = '/api/dbsource/queryByParamKey'
      var data01 = { sqlId: 'select_alarm_info', orderId: '0', minRow: '0', maxRow: '560', params: {} }
      // { sqlId: 'select_equipment_info', whereId: '4', orderId: '0', params: {}, minRow: 0, maxRow: 19 }
      data01 = 'args=' + JSON.stringify(data01)
      console.log('访问参数：', data01)
      // 后台数据访问
      this.dataAccess(url, data01, function (res) {
        console.log('后端返回数据结果json：', res)
        // 获取数据传给data
        that.data = res.data.data.data
        that.basicData = res.data.data.data
        that.totalData = res.data.data.count
        // console.log(that.data)
        // console.log(that.totalData)
        // 再从后端返回数据结果json中再取出data字段就可以得到数据库查询的结果
      }, function (err) {
        console.log('后端数据访问出错!', err)
      })
    }
  },
  data () {
    return {
      filterForm: {
        status: '',
        deviceName: ''
      },
      changeColor: false,
      module_equipment_id: '',
      alarm_describe: '',
      alarm_status: '',
      filter: '',
      alarm_time: '',
      equipment_name: '',
      checked: false,
      test: 100,
      selected: [],
      dense: false,
      prompt: false,
      options: [
        '1', '2', '3', '四级', '五级', '六级', '七级', '八级', '九级', '十级'
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
  }
}
</script>
<style>
@import "../assets/css/tableStyle.css";
</style>
