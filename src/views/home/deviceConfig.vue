<template>
  <q-splitter v-model="splitterModel" style="height: 90vh">
    <q-dialog v-model="chooseDevice">
      <q-card style="max-width: 120vh; width: 100%">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">设备添加</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-table
            row-key="id"
            :data="deviceData"
            :columns="deviceColumns"
            class="my-sticky-header-table"
            card-style="margin:15px;"
            no-data-label="暂无数据"
            separator="cell"
            table-header-class="bg-blue-8 text-white"
            selection="single"
            :selected.sync="device_select"
            :pagination.sync="devicePagination"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  ><q-checkbox key="rn" v-model="props.selected"></q-checkbox
                ></q-td>
                <q-td key="module_equipment_id" :props="props">{{
                  props.row.module_equipment_id
                }}</q-td>
                <q-td key="equipment_name" :props="props">{{
                  props.row.equipment_name
                }}</q-td>
                <q-td key="equipment_type" :props="props">{{
                  props.row.equipment_type
                }}</q-td>
              </q-tr>
            </template>
            <template v-slot:top-left>
              <div class="q-gutter-md row items-start">
                <q-input
                  v-model="queryDeviceParams.equipment_id"
                  label="设备ID"
                  style="width: 220px; margin-left: 10px"
                  dense
                  standout="bg-blue-6 text-white"
                  input-class="text-left"
                  class="q-ml-md"
                  label-color="primary"
                />
                <q-select
                  v-model="deviceTypeValue"
                  style="width: 220px"
                  standout="bg-blue-6 text-white"
                  label="设备类型"
                  :options="deviceType"
                  option-label="name"
                  dense
                />
                <q-input
                  v-model="queryDeviceParams.equipment_name"
                  label="设备名称"
                  style="width: 220px; margin-left: 10px"
                  dense
                  standout="bg-blue-6 text-white"
                  input-class="text-left"
                  class="q-ml-md"
                  label-color="primary"
                />
                <q-btn
                  color="primary"
                  label="查询"
                  icon="search"
                  @click="queryDevice"
                />
                <q-btn
                  color="primary"
                  label="重置"
                  icon="search"
                  @click="resetDevice"
                />
                <q-btn
                  color="primary"
                  label="选择设备"
                  @click="selectDevice"
                  icon="search"
                />
              </div>
            </template>
  <template v-slot:bottom class="justify-end">
          <span style="margin-right: 5px">
            显示{{ startPage }}~{{ endPage }}条记录，总
            {{ devicePagination.rowsNumber }}
            条数据
          </span>
          <span style="margin-right: 5px"> 每页 </span>
          <q-select
            outlined
            v-model="devicePagination.rowsPerPage"
            :options="pageTotalumbe"
            dense
            @input="changeDeviceTotalumbe"
            style="float: left; margin-right: 5px"
          />
          <span style="margin-right: 5px"> 条记录 </span>
          <div class="pagination">
            <q-pagination
              v-model="devicePagination.page"
              :max="devicePages"
              :max-pages="maxPages"
              ellipsess
              :direction-links="true"
              @input="changeDevicePagination"
            >
            </q-pagination>
            <span>跳至 </span>
            <q-input
              outlined
              v-model="deviceToPage"
              dense
              class="pagination-input"
              @keyup.enter.native="changeDeviceToPage"
            ></q-input>
            <span> 页</span>
          </div>
        </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addDialog">
      <q-card style="max-width: 90vh">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">网络设备关联添加</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              v-model="deviceParams.grid_name"
              filled
              outlined
              autogrow
              dense
              style="width: 400px"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || '请输入正确的网格名称',
              ]"
            >
              <template v-slot:before>
                <span
                  class="input-label text-right text-grey-10"
                  style="font-size: 18px; width: 110px"
                >
                  网格名称
                  <span class="text-red text-weight-bolder">*</span>：
                </span>
              </template>
            </q-input>
            <q-input
              filled
              v-model="deviceParams.equipment_name"
              outlined
              autogrow
              dense
              style="width: 400px"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || '请输入正确的网格名称',
              ]"
              @click="renderSelectDeviceView"
            >
              <template v-slot:before>
                <span
                  class="input-label text-right text-grey-10"
                  style="font-size: 18px; width: 110px"
                >
                  设备名称
                  <span class="text-red text-weight-bolder">*</span>：
                </span>
              </template>
            </q-input>
            <div align="center">
              <q-btn
                style="width: 30%"
                label="提交"
                type="submit"
                color="primary"
              />
              <q-btn
                style="width: 30%"
                label="重置"
                type="reset"
                color="red"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <template v-slot:before>
      <div class="q-pa-md">
        <div class="row" style="margin: 10px">
          <q-input
            label="网格节点搜索"
            style="width: 265px; margin-left: 0px"
            dense
            standout="bg-blue-6 text-white"
            v-model="gridNodeSearch"
            input-class="text-right"
            class="q-ml-md"
            label-color="primary"
            @input="queryNode"
          >
            <template v-slot:append>
              <q-icon v-if="gridNodeSearch === ''" name="search" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="gridNodeSearch = ''"
              />
            </template>
          </q-input>
        </div>
        <q-tree
          :nodes="simple"
          node-key="grid_bm"
          selected-color="primary"
          :selected.sync="selected"
          :expanded.sync="expanded"
        />
      </div>
    </template>

    <template v-slot:after>
      <q-table
        :data="data"
        :columns="columns"
        row-key="rn"
        card-style="margin:15px;height:85vh"
        no-data-label="暂无数据"
        :selected-rows-label="getSelectedString"
        selection="multiple"
        table-header-class="bg-blue-8 text-white"
        class="my-sticky-header-table"
        :selected.sync="checkSelect"
        :pagination.sync="pagination"
        separator="cell"
      >
        <template v-slot:top-right>
          <q-btn
            label="添加关联设备"
            icon="add"
            type="submit"
            color="primary"
            @click="Pre_addValidation"
          />
          <q-btn
            label="删除关联设备"
            icon="delete"
            type="reset"
            color="red"
            class="q-ml-sm"
            @click="deleteDevice"
          />
        </template>
        <template v-slot:bottom class="justify-end">
          <span style="margin-right: 5px">
            显示{{ startPage }}~{{ endPage }}条记录，总
            {{ pagination.rowsNumber }}
            条数据
          </span>
          <span style="margin-right: 5px"> 每页 </span>
          <q-select
            outlined
            v-model="pagination.rowsPerPage"
            :options="pageTotalumbe"
            dense
            @input="changeTotalumbe"
            style="float: left; margin-right: 5px"
          />
          <span style="margin-right: 5px"> 条记录 </span>
          <div class="pagination">
            <q-pagination
              v-model="pagination.page"
              :max="pages"
              :max-pages="maxPages"
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
              @keyup.enter.native="changeToPage"
            ></q-input>
            <span> 页</span>
          </div>
        </template>
      </q-table>
    </template>
  </q-splitter>
</template>
<script>
// import {fetchData}
import { fetchData } from '../../api/index'
import { uid } from 'quasar'
export default {
  data () {
    return {
      splitterModel: 20,
      addDialog: false,
      chooseDevice: false,
      deviceType: [],
      deviceTypeValue: '',
      pageTotalumbe: [5, 10, 20, 50],
      startPage: 0, // 开始记录数
      endPage: 5, // 结束记录数
      pages: 5, // 数据总页数
      devicePages: 5,
      maxPages: 5,
      toPage: '', // 跳转至
      deviceToPage: '',
      pagination: {
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0 // 总共数据条数
      },
      devicePagination: {
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0 // 总共数据条数
      },
      device_select: [],
      selected: '-1',
      checkSelect: [],
      // 默认打开的树节点
      expanded: ['-1'],
      gridNodeSearch: '',
      simple: [
        {
          label: '网格节点',
          icon: 'share',
          grid_bm: '-1',
          children: []
        }
      ],
      // 树
      baseSimple: [
        {
          label: '网格节点',
          icon: 'share',
          grid_bm: '-1',
          grid_id: '-1',
          id: '-1',
          children: []
        }
      ],
      simpleBackup: [],
      columns: [
        {
          name: 'grid_name',
          required: true,
          label: '网格名称',
          align: 'center',
          field: 'grid_name'
        },
        {
          name: 'equipment_id',
          align: 'center',
          label: '设备ID',
          field: 'equipment_id'
        },
        {
          name: 'equipment_name',
          align: 'center',
          label: '设备名称',
          field: 'equipment_name'
        }
      ],
      deviceColumns: [
        {
          name: 'module_equipment_id',
          required: true,
          label: '设备ID',
          align: 'center',
          field: 'module_equipment_id'
        },
        {
          name: 'equipment_name',
          align: 'center',
          label: '设备名称',
          field: 'equipment_name'
        },
        {
          name: 'equipment_type',
          align: 'center',
          label: '设备类型',
          field: 'equipment_type'
        }
      ],
      // 添加关联设备参数
      deviceParams: {
        id: '',
        grid_id: '',
        grid_name: '',
        equipment_id: '',
        equipment_name: ''
      },
      queryDeviceParams: {
        equipment_id: '',
        equipment_type: '',
        equipment_name: ''
      },
      data: [],
      deviceData: []
    }
  },
  mounted () {
    this.getTreeNode()
    // this.getAllNode()
  },
  methods: {
    // 'Content-Type': 'application/json'
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
     * 获取网格节点
     */
    getTreeNode () {
      // 刷新表格数据
      // this.refreshView()
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_grid_info_tree',
          whereId: '0',
          params: { grid_name: '' }
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          const resData = res.data.data
          this.createTree(this.simple, resData)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 构建树（节点）
     */
    createTree (params, treeData) {
      // 循环父节点
      for (let i = 0; i < params.length; i++) {
        var childrenNode = []
        // 寻找子节点
        for (let j = 0; j < treeData.length; j++) {
          // 设置子节点label
          treeData[j].label = treeData[j].grid_name
          // 设置子节点grid_bm （tree的key绑定的是grid_bm）等于id
          treeData[j].grid_bm = treeData[j].id

          // 判断当前节点是否是子节点
          if (treeData[j].parent_bm === params[i].grid_bm) {
            childrenNode.push(treeData[j])
          }
        }
        // 给子节点赋值
        params[i].children = childrenNode
        // 如果子节点存在，继续遍历子节点
        if (params[i].children.length > 0) {
          params[i].icon = 'share'
          this.createTree(params[i].children, treeData)
        }
      }
      this.simpleBackup = this.simple
    },
    /**
     * 刷新表格
     */
    refreshView () {
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_equipment_in_grid',
          whereId: '0',
          params: { grid_id: this.selected },
          minRow: this.startPage,
          maxRow: this.endPage
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          const resData = res.data.data.data
          this.data = resData
          // 设置表格数据总条数（行数）
          this.pagination.rowsNumber = res.data.data.count
          // 设置表格页码树数量
          this.pages = Math.ceil(
            this.pagination.rowsNumber / this.pagination.rowsPerPage
          )
        })
        .catch((error) => {
          console.log(error)
        })
    },
    changePagination () {
      // 设置数据开始位置
      this.startPage = (this.pagination.page - 1) * this.pagination.rowsPerPage
      // 设置数据结束位置
      this.endPage = this.startPage + this.pagination.rowsPerPage
      if (this.startPage > this.pagination.rowsNumber) {
        this.startPage =
          this.pagination.rowsNumber - this.pagination.rowsPerPage
        if (this.startPage < 0) {
          this.startPage = 0
        }
        this.endPage = this.pagination.rowsNumber
      }
      // 刷新页面
      this.refreshView()
    },
    // 设置显示总数目
    changeTotalumbe () {
      this.changePagination()
    },
    /**
     * 选择设备界面分页，刷新表格数据
     */
    changeDevicePagination () {
      // 设置数据开始位置
      this.startPage = (this.devicePagination.page - 1) * this.devicePagination.rowsPerPage
      // 设置数据结束位置
      this.endPage = this.startPage + this.devicePagination.rowsPerPage
      if (this.startPage > this.devicePagination.rowsNumber) {
        this.startPage =
          this.devicePagination.rowsNumber - this.devicePagination.rowsPerPage
        if (this.startPage < 0) {
          this.startPage = 0
        }
        this.endPage = this.devicePagination.rowsNumber
      }
      // 刷新页面
      // this.refreshView()
      this.renderDeviceData()
    },
    /**
     * 修改表格容量
     */
    changeDeviceTotalumbe () {
      this.changeDevicePagination()
    },
    // 跳转页数
    changeToPage () {
      // 填写的页码为空直接结束
      if (this.toPage === '') {
        return
      }
      // 填写的页码大于最大页，提示信息并结束
      if (this.toPage <= this.pages && this.toPage > 0) {
        this.pagination.page = parseInt(this.toPage)
        this.changePagination()
        return
      }
      this.$q.notify({
        message: '请选择正确的页码',
        color: 'red',
        position: 'center',
        timeout: 1500
      })
    },
    changeDeviceToPage () {
      // 填写的页码为空直接结束
      if (this.deviceToPage === '') {
        return
      }
      // 填写的页码大于最大页，提示信息并结束
      if (this.deviceToPage <= this.devicePages && this.deviceToPage > 0) {
        this.devicePagination.page = parseInt(this.deviceToPage)
        this.changeDevicePagination()
        return
      }
      this.$q.notify({
        message: '请选择正确的页码',
        color: 'red',
        position: 'center',
        timeout: 1500
      })
    },
    getSelectedString () {
      return this.selected.length === 0
        ? ''
        : `${this.selected.length} record${
            this.selected.length > 1 ? 's' : ''
          } selected of ${this.data.length}`
    },
    /**
     * 节点查询
     */
    queryNode () {
      // 搜索条件为空，默认显示所有节点
      if (this.gridNodeSearch === '') {
        this.simple = this.simpleBackup
        return
      }
      this.baseSimple[0].children = []
      this.queryNodeOperation(this.simpleBackup)
    },
    queryNodeOperation (params) {
      for (let i = 0; i < params.length; i++) {
        // 判断节点是否符合搜索条件
        const index = params[i].label.indexOf(this.gridNodeSearch)
        if (index !== -1) {
          // 符合条件追加整个节点（包括子节点），否子查询子节点
          this.baseSimple[0].children.push(params[i])
        } else {
          // 查询子节点
          if (params[i].children.length > 0) {
            this.queryNodeOperation(params[i].children)
          }
        }
      }
      this.simple = this.baseSimple
    },
    /**
     * 判断是否选择网格节点
     */
    Pre_addValidation () {
      // 未选择网格节点，提示消息
      if (this.selected === '-1') {
        this.$q.notify({
          message: '请先选择网格节点',
          color: 'red',
          position: 'center',
          timeout: 1500
        })
        return
      }
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_grid_info_tree',
          whereId: '0',
          params: { grid_name: '' }
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          const resData = res.data.data
          for (let i = 0; i < resData.length; i++) {
            if (this.selected === resData[i].id) {
              // 给参数赋值
              this.deviceParams.grid_name = resData[i].grid_name
              this.deviceParams.grid_id = resData[i].id
              // 显示添加界面
              this.addDialog = true
              return
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 渲染选择设备界面
     */
    renderSelectDeviceView () {
      this.chooseDevice = true
      this.renderDevicetype()
      this.renderDeviceData()
    },
    /**
     * 渲染设备类型
     */
    renderDevicetype () {
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: { sqlId: 'select_equipment_type_info_select' },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          this.deviceType = res.data.data
          this.deviceType.push({ id: '', name: '' })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 渲染设备信息
     */
    renderDeviceData () {
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_equipment_info',
          orderId: '0',
          whereId: '4',
          params: { parent_bm: '' },
          minRow: this.startPage,
          maxRow: this.endPage
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          this.deviceData = res.data.data.data
          this.devicePagination.rowsNumber = res.data.data.count
          // 设置表格页码树数量
          console.log(this.devicePagination.rowsNumber, this.devicePagination.rowsPerPage)
          this.devicePages = Math.ceil(
            this.devicePagination.rowsNumber / this.devicePagination.rowsPerPage
          )
          console.log(this.devicePages)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    selectDevice () {
      if (this.device_select.length === 0) {
        this.$q.notify({
          message: '当前未选择任何节点',
          color: 'red',
          position: 'center',
          timeout: 1500
        })
        return
      }
      // 选择节点，给参数赋值
      this.deviceParams.equipment_name = this.device_select[0].equipment_name
      this.deviceParams.equipment_id = this.device_select[0].module_equipment_id
      this.chooseDevice = false
    },
    removeDeviceForm () {
      this.deviceParams.id = ''
      this.deviceParams.equipment_name = ''
      this.deviceParams.equipment_id = ''
      this.deviceParams.grid_name = ''
      this.deviceParams.grid_id = ''
    },
    queryDevice () {
      this.queryDeviceParams.equipment_type = this.deviceTypeValue.name
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_equipment_info',
          orderId: '0',
          whereId: '5',
          params: this.queryDeviceParams,
          minRow: 0,
          maxRow: 15
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          this.deviceData = res.data.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    resetDevice () {
      this.renderDeviceData()
    },
    onSubmit () {
      this.deviceParams.id = uid()
      const query = {
        url: 'api/dbsource/updateByParamKey',
        data: [
          { sqlId: 'insert_equipment_in_grid', params: [this.deviceParams] }
        ],
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          this.addDialog = false
          if (res.data.success === true) {
            this.$q.notify({
              message: '添加成功',
              color: 'green',
              position: 'center',
              timeout: 1500
            })
          } else {
            this.$q.notify({
              message: '添加失败',
              color: 'green',
              position: 'center',
              timeout: 1500
            })
          }
          this.removeDeviceForm()
          this.refreshView()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onReset () {},
    deleteDevice () {
      const query = {
        url: 'api/dbsource/updateByParamKey',
        data: [{ sqlId: 'delete_equipment_in_grid', params: this.checkSelect }],
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          this.addDialog = false
          if (res.success === true) {
            this.$q.notify({
              message: '删除成功',
              color: 'green',
              position: 'center',
              timeout: 1500
            })
          }
          this.removeDeviceForm()
          this.refreshView()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  watch: {
    // 监听事件
    selected: function (newQuestion, oldQuestion) {
      if (this.selected === null) {
        this.selected = oldQuestion
      }
      this.refreshView()
    },
    /**
     * 界面关闭移除表单内容
     */
    addDialog: function (newQuestion, oldQuestion) {
      if (this.addDialog === false) {
        this.removeDeviceForm()
      }
    }
  }
}
</script>
<style>
@import "../../assets/css/tableStyle.css";
</style>
