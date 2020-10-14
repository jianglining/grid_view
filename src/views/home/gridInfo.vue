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
          node-key="grid_id"
          selected-color="primary"
          :selected.sync="selected"
          :expanded.sync="expanded"
        >
                    <template v-slot:default-header="prop" >
              <div class="row justify-between items-center">
                <div class="text-weight-bold ">{{ prop.node.label }}
                     <q-btn color="white" round dense icon="add" text-color="black" />
                </div>
              </div>
            </template>
        </q-tree>
      </div>
    </template>
    <template v-slot:after>
      <div>
    <q-splitter
      v-model="splitterModelTow"
      style="height: 90vh"
    >
      <!-- 左边内容和操作 -->
      <template v-slot:before>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-md">网格名称</div>
          <div class="q-my-md">{{ gridDetail.grid_name }}</div>
          <div class="text-h5 q-mb-md">网格位置</div>
          <div class="q-my-md">{{ gridDetail.location }}</div>
          <div class="text-h5 q-mb-md">是否启用</div>
          <div class="q-my-md">{{ gridDetail.start_type }}</div>
          <div class="q-gutter-xs absolute-bottom q-px-md">
             <q-uploader fieldName="sceneFile" url="api/upload" label="场景图" accept=".svg,.SVG" color="grey-5" text-color="dark" bordered no-thumbnails class="col-grow"
          @factory-failed="uploaderFactoryFailed"
          @added="uploaderAdded"
          @removed="uploaderRemoved"
        >
      </q-uploader>
          </div>
        </div>
      </template>
      <!-- 右边的场景图展示 -->
      <template v-slot:after>
        <div class="col q-col-gutter-md right-div">
            <div ref="svgContent" class="">  {{msg}}</div>
          </div>
        <!-- <div class="q-pa-md">
          <div class="text-h4 q-mb-md">图片</div>
          <q-img
        src="https://placeimg.com/500/300/nature"
        contain
      >
        <div class="absolute-bottom text-subtitle1 text-center">
          Contain
        </div>
      </q-img>

        </div>-->
      </template>

    </q-splitter>
  </div>
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
      msg: '场景预览',
      splitterModel: 20,
      splitterModelTow: 25,
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
      gridDetail: {},
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
        { name: 'start_type', label: '是否启用', align: 'center', field: 'start_type' },
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
          this.getTreeNode()
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
          whereId: '1',
          params: { id: this.selected },
          minRow: this.startPage,
          maxRow: this.endPage
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          console.log('www', res)
          const resData = res.data.data.data
          this.gridDetail = resData[0]
          // this.data = resData

          // 设置表格数据总条数（行数）
          // this.pagination.rowsNumber = res.data.data.count
          // 设置表格页码数数量
          // this.pages = Math.ceil(
          //   this.pagination.rowsNumber / this.pagination.rowsPerPage
          // )
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
          this.getTreeNode()
          this.addDialog = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onReset () {},
    selectionSubGrid (details) {
      // 因为表格被设置成了单选,选择元素在第0个
      var row = details.rows[0]
      // 构造选择器
      var selector = 'g[subgrid="' + row.subgrid + '"]'
      var subGridsDOM = document.querySelectorAll(selector)
      // 回为是querySelectorAll所以有可能是多个
      console.log('----------勾选Dom:', subGridsDOM)
      // 规定每一个子网格都要有一个用来表示报警的多边形区域,前且要定义报警时的填充色,以前及报警与不报警时填充色的透明度值,程序在改变报警状态时改变这个透明度值以示报警
      // 为了能实现这个功能要求报警多边形要在该区域组中是最上边的层,且属于该组的第一子层
      // 找到报警层,要求属于subGridsDOM该组的第一子层
      // 选择子网格中的行
      if (details.added) {
        // 被添加到subGridSelected时
        console.log('勾选:', details)
        for (let i = 0; i < subGridsDOM[0].children.length; i++) {
        // 如果是polygon alarmLayer="true" 就说明该层是报警层
        // var alarmLayerDom = subGridsDOM[0].children[i].querySelectorAll('polygon[alarmLayer]')
        // console.log('报警层', subGridsDOM[0].children[i].querySelector('polygon[alarmlayer="true"]'))
        // console.log('报警层22', subGridsDOM[0].children[i].getAttribute('alarmlayer'))
          if (subGridsDOM[0].children[i].getAttribute('alarmlayer')) {
            // 改变报层层的属性
            console.log('报警层22', subGridsDOM[0].children[i])
            subGridsDOM[0].children[i].setAttribute('opacity', '0.8')
          }
        }
      } else {
        // 从subGridSelected数组中移除时
        console.log('取消勾选:', details)
        for (let i = 0; i < subGridsDOM[0].children.length; i++) {
        // 如果是polygon alarmLayer="true" 就说明该层是报警层
        // var alarmLayerDom = subGridsDOM[0].children[i].querySelectorAll('polygon[alarmLayer]')
        // console.log('报警层', subGridsDOM[0].children[i].querySelector('polygon[alarmlayer="true"]'))
        // console.log('报警层22', subGridsDOM[0].children[i].getAttribute('alarmlayer'))
          if (subGridsDOM[0].children[i].getAttribute('alarmlayer')) {
            // 改变报层层的属性
            console.log('报警层22', subGridsDOM[0].children[i])
            subGridsDOM[0].children[i].setAttribute('opacity', '0.1')
          }
        }
      }
    },
    updateSelected (newSelected) {
      // 当选择对象数组中选择的对象有变更时的设回调
    },
    /**
     * 选择要上传的文件后的回调
     * 可以在这里进行对svg原文件的解析，从中解析出场景中各网格的信息
     * 解析过程和算法要结合svg原文件中的特定格式
     */
    setSvgContent (event) {
      // 作为url地址载入到内存之后使用THREE.OBJLoader把模型文件放到场景中
      // console.log('解析文件：', event.target.result)
      // this.setSvgContent(event.target.result)
      // 取出svg原文件中的字符串格式
      // 以文本方式开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个字符串以表示所读取的文件内容。
      var svtStr = event.target.result
      var contentDiv = this.$refs.svgContent
      contentDiv.innerHTML = svtStr
      // console.log('svg显示容器', contentDiv, svtStr)
      // 返回的是一个同名节点的数组
      var svgdoc = document.getElementsByTagName('svg')
      var svgdocjs = svgdoc[0].getElementsByTagName('script')
      console.log('svg中的脚本对象:', svgdocjs)
      // 获取文档中有 "sub-grid" 属性的第一个 <g> 元素：
      // 查找文档中共包含 "sub-grid" 属性的 <g> 标签
      var subGrids = document.querySelectorAll('g[subgrid]')
      if (subGrids.length > 0) {
        this.subGridTableShow = true
        // this.subGridData.push({ subGridName: treeNode.id })
        for (let i = 0; i < subGrids.length; i++) {
          // { name: 'subGridName', label: '子网格(区域)', field: 'subGridName', sortable: true, align: 'left' },
          // { name: 'subgrid', label: 'id', field: 'subgrid', sortable: true, align: 'left' }
          this.subGridData.push({ subGridName: subGrids[i].id, subgrid: subGrids[i].getAttribute('subgrid') })
          console.log('子网格:', subGrids[i].id, subGrids[i].getAttribute('subgrid'), subGrids[i])
        }
      }
      console.log('特殊属性查找:', subGrids)
      // 调用svg中的脚本
      // svgJs('2222222222222')
      // var childNodes = this.$refs.svgref.childNodes
      // 因为只作单一场景所以，第0个索引下的数组对象就是场景图
      console.log('svg节点', svgdoc, svgdoc[0].childNodes)
      // svg作为innerHTML被加进来没办法执行里面的js方法
      // svgdoc[0].onload()
    },
    svgJs (evt) {
      console.log('这里是vue中的方法:', evt)
    },
    setInnerHTML (el, htmlCode) {
      // navigator.userAgent属性是一个只读的字符串，声明了浏览器用于 HTTP 请求的用户代理头的值
      var ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0) {
        htmlCode = '<div style="display:none">for IE</div>' + htmlCode
      }
    },
    uploaderFactoryFailed (err, files) {
      // 上传文件选择不符合要求的事件回调
      // rejectedEntries参数是对象：{ failedPropValidation: string, file: File } 的数组
      // 包括了一个失败的文件对象，以前失效的原因
      console.log('uploaderFactoryFailed(err, files).....', err, files)
    },
    uploaderAdded (files) {
      // 用户选择文件并被添加到上传框时的事件回调
      console.log('uploaderAdded.....', files)
      var oReq = null
      if (window.XMLHttpRequest) {
        // 非IE内核
        oReq = new XMLHttpRequest()
      } else if (window.ActiveXObject) {
        // IE内核，这里早期IE版本不同，具体可以查下
        // oReq = new ActiveXObject('Microsoft.XMLHTTP')
        console.log('当前浏览器不支持', oReq)
      }
      var reader2scene = new FileReader()
      // 读取本地的svg文件放到场景预览节点
      reader2scene.onload = this.setSvgContent
      // 要把文件转换成Blob Url
      // reader2scene.readAsDataURL(files)
      // 以文本方式开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个字符串以表示所读取的文件内容。
      reader2scene.readAsText(files[0])
      console.log('oReq.....', oReq)
    },
    uploaderRemoved (files) {
      // 从上传组件中移除文件
      console.log('移除：uploaderRemoved(files).....', files)
      var contentDiv = this.$refs.svgContent
      contentDiv.innerHTML = ''
      this.subGridData = []
      this.subGridTableShow = false
    },
    uploaderStart () {
      // 上传组件开始事件是当点击上传按钮时被回调
      console.log('上传组件开始事件：uploaderStart ().....')
    },
    uploaderFinish () {
      // 上传组件开始事件是当点击上传按钮时被回调
      console.log('上传组件文件上传结束事件：uploaderFinish ().....')
    },
    uploadedFunction (info) {
      // 上传组件开始事件是当点击上传按钮时被回调
      console.log('上传组件文件上传过程事件：uploadedFunction (info).....', info)
    },
    uploadedFailed (info) {
      // 上传组件文件上传失败事件
      console.log('上传组件文件上传失败事件：uploadedFailed (info).....', info)
    },
    uploading (info) {
      // 上传组件文件上传过程事件
      console.log('上传组件文件上传失败事件：uploadedFailed (info).....', info)
    },
    uploadedRejected (rejectedEntries) {
      // 上传文件选择不符合要求的事件回调
      // rejectedEntries参数是对象：{ failedPropValidation: string, file: File } 的数组
      // 包括了一个失败的文件对象，以前失效的原因
      // accept, max-file-size, max-total-size, filter等原因都有可能出错
      console.log('上传组件文件上传失败事件：uploadedRejected (rejectedEntries).....', rejectedEntries)
    }
  },
  watch: {
    // 监听事件，左侧节点菜单点击事件
    selected: function (newQuestion, oldQuestion) {
      // this.$router.push({ path: '/about' })
      if (this.selected === null) {
        this.selected = oldQuestion
      }
      console.log(this.selected)
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
