<template>
  <q-splitter v-model="splitterModel" style="height: 90vh">
    <div class="q-pa-md">
      <q-dialog v-model="addDialog">
        <q-card style="max-width: 90vh">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">网格添加</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <q-input
                filled
                v-model="gridForm.grid_name"
                outlined
                autogrow
                dense
                lazy-rules
                style="width: 400px"
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
                v-model="gridForm.grid_bm"
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
                    网格编码
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
              </q-input>
              <q-select
                style="width: 400px"
                standout="bg-blue-6 text-white"
                v-model="gridForm.parent_bm"
                :options="choose"
                option-label="label"
                option-value="value"
                :dense="dense"
                :options-dense="denseOpts"
              >
                <template v-slot:before>
                  <span
                    class="input-label text-right text-grey-10"
                    style="font-size: 18px; width: 110px"
                  >
                    父 节 点
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
              </q-select>
              <q-input
                filled
                type="text"
                dense
                v-model="gridForm.location"
                lazy-rules
                style="width: 400px"
                :rules="[
                  (val) => (val && val.length > 0) || '请输入正确的网格名称',
                ]"
              >
                <template v-slot:before>
                  <span
                    class="input-label text-right text-grey-10"
                    style="font-size: 18px; width: 110px"
                  >
                    网格位置
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
              </q-input>
              <q-select
                style="width: 400px"
                standout="bg-blue-6 text-white"
                v-model="gridForm.is_enable"
                :options="chooseType"
                option-value="value"
                option-label="label"
                :dense="dense"
                :options-dense="denseOpts"
              >
                <template v-slot:before>
                  <span
                    class="input-label text-right text-grey-10"
                    style="font-size: 18px; width: 110px"
                  >
                    是否启用
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
              </q-select>
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
    </div>
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
        class="my-sticky-header-table"
        no-data-label="暂无数据"
        table-header-class="bg-blue-8 text-white"
        selection="multiple"
        :pagination.sync="pagination"
        :selected.sync="table_select"
        separator="cell"
      >
        <!-- <template v-slot:top-right>
        <q-btn color="teal-7" :disable="loading" label="修改" @click="update" />
        <q-btn class="q-ml-sm" color="teal-7" :disable="loading" label="删除" @click="removeRow" />
        </template>-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              ><q-checkbox key="rn" v-model="props.selected"></q-checkbox
            ></q-td>
            <q-td key="grid_name" :props="props">{{
              props.row.grid_name
            }}</q-td>
            <q-td key="location" :props="props">{{ props.row.location }}</q-td>
            <q-td key="start_type" :props="props">{{
              props.row.start_type
            }}</q-td>
            <q-td key="cz" :props="props">
              <!-- <span><q-btn dense color="red" label="删除"  icon="highlight_off" size="8px" @click="delRecord(props.row)"/></span> -->
              <q-btn
                color="primary"
                label="修改网格"
                @click="update(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top-left>
          <div class="q-gutter-md row items-start">
            <q-input
              label="网格名称"
              style="width: 265px; margin-left: 10px"
              dense
              standout="bg-blue-6 text-white"
              v-model="queryName"
              input-class="text-left"
              class="q-ml-md"
              label-color="primary"
            />
            <q-select
              style="width: 265px; margin-left: 10px"
              standout="bg-blue-6 text-white"
              label="启用类型"
              v-model="enable_type"
              :options="chooseType"
              option-value="value"
              option-label="label"
              :dense="dense"
              :options-dense="denseOpts"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>
            <q-btn
              color="primary"
              label="查询"
              icon="search"
              @click="gridQuery()"
            />
            <q-btn
              color="primary"
              label="重置"
              icon="navigation"
              @click="reset"
            />
            <q-btn
              color="primary"
              label="删除"
              icon="delete"
              @click="deletes()"
            />
            <q-btn
              color="primary"
              label="添加网格"
              icon="add"
              @click="addGrid()"
            />
          </div>
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
          <q-pagination
            style="float: right"
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
            style="width: 50px; margin: 10px"
          ></q-input>
          <span> 页</span>
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
      pageTotalumbe: [5, 10, 20, 50],
      startPage: 0, // 开始记录数
      endPage: 5, // 结束记录数
      pages: '', // 数据总页数
      maxPages: 5,
      toPage: '', // 跳转至
      pagination: {
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0 // 总共数据条数
      },
      // 选择的节点
      selected: '-1',
      queryType: '',
      totalNode: [],
      addDialog: false,
      queryName: '',
      // 表格类型（查询出来的数据or全部数据）
      tableType: 'all',
      enable_type: '',
      addIsEnable: '',
      // 默认打开的树节点
      expanded: ['-1'],
      // 父节点数据
      choose: [],
      table_select: [],
      parseNode: [],
      noModify: {},
      chooseType: [
        { label: '启用', value: '0' },
        { label: '不启用', value: '1' }
      ],
      dense: true,
      denseOpts: true,
      // 网格节点查询数据
      gridNodeSearch: '',
      // 表单数据
      gridForm: {
        id: '',
        grid_name: '',
        parent_bm: '',
        parent_name: '',
        is_enable: '',
        start_type: '',
        location: '',
        grid_bm: '',
        create_by: '',
        create_name: '',
        create_time: '',
        update_by: '',
        update_name: '',
        update_time: '',
        node_bm: ''
      },
      // 树
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
          children: []
        }
      ],
      simpleBackup: [],
      // 表格（每列标题）数据
      columns: [
        {
          name: 'grid_name',
          required: true,
          label: '网格名称',
          align: 'center'
        },
        {
          name: 'location',
          align: 'center',
          label: '网格位置',
          field: 'location'
        },
        { name: 'start_type', label: '是否启用', field: 'start_type' },
        {
          name: 'cz',
          align: 'center',
          label: '操作',
          field: 'id'
        }
      ],
      data: []
    }
  },
  mounted () {
    // 获取网格节点菜单
    this.getTreeNode()
  },
  methods: {
    // axios方法，获取后台数据
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
    getSelectedString () {
      return this.selected.length === 0
        ? ''
        : `选中${this.selected.length} 条记录`
    },
    /**
     * 获取网格节点(左菜单)
     */
    getTreeNode () {
      // var url = '/api/dbsource/queryByParamKey'
      // var data01 = { sqlId: 'select_grid_info', whereId: '2', orderId: '0', params: { parent_bm: '-1' }, minRow: 0, maxRow: 19 }
      // // {"sqlId":"select_grid_info_tree","whereId":"0","params":{"grid_name":""}}
      // data01 = 'args=' + JSON.stringify(data01)
      // // console.log('访问参数：', data01)
      // // 后台数据访问
      // this.dataAccess(url, data01, function (res) {
      //   // console.log('后端返回数据结果json：', res.data)
      //   // 再从后端返回数据结果json中再取出data字段就可以得到数据库查询的结果
      // }, function (err) {
      //   console.log('后端数据访问出错!', err)
      // })
      // 构建树
      // this.createTree(this.simple)

      // 刷新表格数据
      this.refreshView()
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
          // 构建树节点
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
          // 继续遍历
          this.createTree(params[i].children, treeData)
        }
      }
      // 备份
      this.simpleBackup = this.simple
    },
    addGrid () {
      this.addDialog = true
      this.choose = []
      this.queryType = 'insert_grid_info'
      this.renderParentNode()
    },
    /**
     * 修改网格前置操作
     */
    update (params) {
      this.noModify = params
      this.queryType = 'update_grid_info'
      this.addDialog = true
      this.gridForm.id = params.id
      this.gridForm.grid_name = params.grid_name
      this.gridForm.grid_bm = params.grid_bm
      this.gridForm.location = params.location
      this.gridForm.is_enable = params.is_enable === '0' ? '启用' : '不启用'
      this.renderParentNode()
    },
    /**
     * 删除网格
     */
    deletes () {
      if (this.table_select.length === 0) {
        this.$q.notify({
          message: '请选择要删除的网格',
          color: 'red',
          position: 'center',
          timeout: 1500
        })
        return
      }
      const query = {
        url: 'api/dbsource/updateByParamKey',
        data: [{ sqlId: 'delete_grid_info', params: this.table_select }],
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          console.log(res)
          this.getTreeNode()
          // this.addDialog = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 渲染父节点 （新增/修改网格）
     */
    renderParentNode () {
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
            var sel = { label: '', value: '' }
            // 追加父节点数据
            sel.label = resData[i].grid_name
            sel.value = resData[i].id
            this.choose.push(sel)
            if (this.noModify.parent_bm === resData[i].id) {
              this.gridForm.parent_bm = resData[i].grid_name
            }
            if (this.noModify.parent_bm === '-1') {
              this.gridForm.parent_bm = '当前无父节点'
            }
          }
          this.choose.push({ label: '网格节点', value: '-1' })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 移除表单内容
     */
    removeGridForm () {
      this.gridForm.id = ''
      this.gridForm.grid_name = ''
      this.gridForm.grid_bm = ''
      this.gridForm.parent_bm = ''
      this.gridForm.location = ''
      this.gridForm.is_enable = ''
      this.noModify = {}
      this.choose = []
    },
    /**
     * 获取全部网格节点
     */
    getAllNode () {
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
        .then((res) => {})
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 刷新当前表格数据
     */
    refreshView () {
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_grid_info',
          whereId: '2',
          orderId: '0',
          params: { parent_bm: this.selected },
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
          // 设置表格页码数数量
          this.pages = Math.ceil(
            this.pagination.rowsNumber / this.pagination.rowsPerPage
          )
        })
        .catch((error) => {
          console.log(error)
        })
    },
    gridQuery () {
      if (this.queryName !== '' || this.enable_type !== '') {
        this.tableType = 'query'
      }
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_grid_info',
          whereId: '0',
          orderId: '0',
          params: {
            is_enable: this.enable_type.value || '',
            parent_bm: this.selected,
            grid_name: this.queryName
          },
          minRow: this.startPage,
          maxRow: this.endPage
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          this.data = res.data.data.data
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
    // 分页跳转
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
      if (this.tableType === 'all') {
        this.refreshView()
      } else {
        this.gridQuery()
      }
    },
    // 设置显示总数目
    changeTotalumbe () {
      this.changePagination()
    },
    // 跳转页数
    changeToPage () {
      // 填写的页码为空直接结束
      if (this.toPage === '') {
        return
      }
      // 填写的页码大于最大页，提示信息并结束
      if (this.toPage > this.pages || this.toPage <= 0) {
        this.$q.notify({
          message: '请选择正确的页码',
          color: 'red',
          position: 'center',
          timeout: 1500
        })
        return
      }
      this.pagination.page = parseInt(this.toPage)
      this.changePagination()
    },
    /**
     * 节点查询
     */
    queryNode () {
      if (this.gridNodeSearch === '') {
        this.simple = this.simpleBackup
        return
      }
      this.baseSimple[0].children = []
      this.queryNodeOperation(this.simpleBackup)
    },
    queryNodeOperation (params) {
      for (let i = 0; i < params.length; i++) {
        const index = params[i].label.indexOf(this.gridNodeSearch)
        if (index !== -1) {
          this.baseSimple[0].children.push(params[i])
        } else {
          if (params[i].children.length > 0) {
            this.queryNodeOperation(params[i].children)
          }
        }
      }
      this.simple = this.baseSimple
    },
    /**
     * 重置查询数据
     */
    reset () {
      this.queryName = ''
      this.enable_type = ''
      this.tableType = 'all'
      this.refreshView()
    },
    onSubmit () {
      // vue 处理__ob__: Observer 的数组
      const t = JSON.parse(JSON.stringify(this.gridForm.is_enable))
      const v = JSON.parse(JSON.stringify(this.gridForm.parent_bm))
      console.log(t, v)
      this.gridForm.is_enable = t.value
      this.gridForm.start_type = t.label
      this.gridForm.parent_bm = v.value
      this.gridForm.parent_name = v.label
      // 修改网格数据处理
      if (t.value === undefined) {
        this.gridForm.start_type = t
        if (t === '启用') {
          this.gridForm.id = this.noModify.id
          this.gridForm.is_enable = '0'
        } else {
          this.gridForm.is_enable = '1'
        }
      }
      // 修改网格数据处理
      if (v.value === undefined) {
        this.gridForm.parent_name = v
        this.gridForm.parent_bm = this.noModify.parent_bm
      }
      // 生成id
      const uids = uid()
      if (this.gridForm.id === '') {
        this.gridForm.id = uids
      }
      // var params = []
      // params.push(this.gridForm)
      // console.log('params', params)
      // if (this.gridForm.is_enable === '0') {
      //   this.gridForm.start_type = '是'
      // } else {
      //   this.gridForm.start_type = '否'
      // }
      // var updateParams = [{ sqlId: 'insert_grid_info', params: [{ id: 'c56659ad-9f30-4b43-b7c9-5bada879c41f', grid_name: '01', parent_bm: '-1', parent_name: 'AB门测试', is_enable: '0', start_type: '启用', location: '3', grid_bm: '004', create_by: '', create_name: '', create_time: '', update_by: '', update_name: '', update_time: '', node_bm: '' }] }]

      const query = {
        url: 'api/dbsource/updateByParamKey',
        data: [
          {
            sqlId: this.queryType,
            params: [this.gridForm]
          }
        ],
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          console.log(res)
          this.getTreeNode()
          this.addDialog = false
        })
        .catch((error) => {
          console.log(error)
        })
      console.log(this.gridForm)
    },
    onReset () {}
  },
  watch: {
    // 监听事件，左侧节点菜单点击事件
    selected: function (newQuestion, oldQuestion) {
      // this.$router.push({ path: '/about' })
      if (this.selected === null) {
        this.selected = oldQuestion
      }
      // 刷新表格数据
      this.refreshView()
    },
    /**
     * 界面关闭移除表单内容
     */
    addDialog: function (newQuestion, oldQuestion) {
      if (this.addDialog === false) {
        this.removeGridForm()
      }
    }
  }
}
</script>
<style>
@import "../../assets/css/tableStyle.css";
</style>
