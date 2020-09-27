<template>
  <q-splitter v-model="splitterModel" style="height: 90vh">
    <div class="q-pa-md">
      <q-dialog v-model="addDialog">
        <q-card style="max-width:90vh;width:80%">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">网格下的卡</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <q-table
              :data="detailData"
              :columns="gridDetail"
              row-key="id"
              card-style="margin:15px;"
              no-data-label="暂无数据"
              :filter="queryName"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="grid_name" :props="props">{{ props.row.grid_name }}</q-td>
                  <q-td key="card_number" :props="props">{{ props.row.card_number }}</q-td>
                  <q-td key="update_time" :props="props">{{ props.row.update_time }}</q-td>
                </q-tr>
              </template>
              <template v-slot:top-left>
                <div class="q-gutter-md row items-start">
                  <q-input
                    label="网格名称"
                    style="width: 265px;margin-left: 10px"
                    dense
                    standout="bg-blue-6 text-white"
                    v-model="queryName"
                    input-class="text-left"
                    class="q-ml-md"
                    label-color="primary"
                  />
                  <q-btn color="primary" label="查询" icon="search" />
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
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <template v-slot:before>
      <div class="q-pa-md">
        <div class="row" style="margin:10px">
          <q-input
            label="网格节点搜索"
            style="width: 265px;margin-left: 0px"
            dense
            standout="bg-blue-6 text-white"
            v-model="gridNodeSearch"
            input-class="text-right"
            class="q-ml-md"
            label-color="primary"
          >
            <template v-slot:append>
              <q-icon v-if="gridNodeSearch === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="gridNodeSearch = ''" />
            </template>
          </q-input>
        </div>
        <q-tree
          :nodes="simple"
          node-key="grid_id"
          selected-color="primary"
          :selected.sync="selected"
          default-expand-all
        />
      </div>
    </template>
    <template v-slot:after>
      <q-table
        :data="data"
        :columns="columns"
        row-key="id"
        card-style="margin:15px;height:85vh"
        table-header-class="bg-blue-8 text-white"
        no-data-label="暂无数据"
      >
        <!-- <template v-slot:top-right>
        <q-btn color="teal-7" :disable="loading" label="修改" @click="update" />
        <q-btn class="q-ml-sm" color="teal-7" :disable="loading" label="删除" @click="removeRow" />
        </template>-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="grid_name" :props="props">{{ props.row.grid_name }}</q-td>
            <q-td key="cardNumber" :props="props">{{ props.row.cardNumber }}</q-td>
            <q-td key="cz" :props="props">
              <!-- <span><q-btn dense color="red" label="删除"  icon="highlight_off" size="8px" @click="delRecord(props.row)"/></span> -->
              <q-btn color="primary" label="查看详情" @click="detailView(props.row)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </template>
  </q-splitter>
</template>
<script>
// import {fetchData}
import { fetchData } from '../api/index'
export default {
  data () {
    return {
      splitterModel: 20,
      pageTotalumbe: [
        5, 10, 20, 50
      ],
      startPage: 0, // 开始记录数
      endPage: 5, // 结束记录数
      pages: 5, // 数据总页数
      maxPages: 5,
      toPage: '', // 跳转至
      pagination: {
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0 // 总共数据条数
      },
      // 选择的节点
      selected: '-1',
      totalNode: [],
      addDialog: false,
      queryName: '',
      enableType: null,
      addIsEnable: '',
      detailBackup: [],
      // 父节点数据
      choose: [],
      dense: true,
      denseOpts: true,
      // 网格节点查询数据
      gridNodeSearch: '',
      // 树
      simple: [
        {
          label: '网格节点',
          icon: 'share',
          grid_bm: '-1',
          grid_id: '-1',
          id: '-1',
          children: []
        }
      ],
      // 表格（每列标题）数据
      columns: [
        {
          name: 'grid_name',
          required: true,
          label: '网格名称',
          align: 'center'
        },
        {
          name: 'cardNumber',
          align: 'center',
          label: '卡数量',
          field: 'cardNumber'
        },
        {
          name: 'cz',
          align: 'center',
          label: '操作',
          field: 'id'
        }
      ],
      // 网格详情页table 标题数据
      gridDetail: [
        {
          name: 'grid_name',
          required: true,
          label: '网格名称',
          align: 'center'
        },
        {
          name: 'card_number',
          align: 'center',
          label: '卡号',
          field: 'card_number'
        },
        { name: 'update_time', label: '更新时间', field: 'update_time' }
      ],
      data: [],
      detailData: []
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
    },
    refreshView () {
      /**
       * 刷新表格数据
       */
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: { sqlId: 'select_grid_info_tree', whereId: '0', params: { grid_name: '' } },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          const resData = res.data.data
          for (let i = 0; i < resData.length; i++) {
            resData[i].cardNumber = '0'
            // 添加label属性
            resData[i].label = resData[i].grid_name
            resData[i].grid_bm = resData[i].id
            const query01 = {
              url: 'api/dbsource/queryByParamKey',
              data: {
                sqlId: 'select_grid_statistics_card_info',
                params: { grid_id: resData[i].id }
              },
              method: 'post',
              type: 'db_search'
            }
            fetchData(query01)
              .then((res) => {
                const resData01 = res.data.data
                if (resData01 === null) {
                  resData[i].cardNumber = '0'
                } else {
                  resData[i].cardNumber = resData01.length + ''
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
          this.data = resData
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
      this.refreshDetailView()
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
     * 查看网格详情
     */
    detailView (params) {
      this.detailBackup = params
      this.refreshDetailView()
    },
    refreshDetailView () {
      this.addDialog = true

      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_grid_statistics_card_info',
          orderId: '0',
          params: { grid_id: this.detailBackup.grid_bm },
          minRow: this.startPage,
          maxRow: this.endPage
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          const resData = res.data.data.data
          this.detailData = resData
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
    }
  },
  watch: {
    // 监听事件，左侧节点菜单点击事件
    selected: function (newQuestion, oldQuestion) {
      // this.$router.push({ path: '/about' })
      if (this.selected === null) {
        this.selected = oldQuestion
      }
      if (this.selected === '-1') {
        this.refreshView()
        return
      }
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: { sqlId: 'select_grid_info', whereId: '1', params: { id: this.selected }, minRow: 0, maxRow: 19 },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          const resData = res.data.data.data
          for (let i = 0; i < resData.length; i++) {
            resData[i].cardNumber = '0'
            // 添加label属性
            resData[i].label = resData[i].grid_name
            const query01 = {
              url: 'api/dbsource/queryByParamKey',
              data: {
                sqlId: 'select_grid_statistics_card_info',
                params: { grid_id: resData[i].grid_bm }
              },
              method: 'post',
              type: 'db_search'
            }
            fetchData(query01)
              .then((res) => {
                const resData01 = res.data.data
                if (resData01 === null) {
                  resData[i].cardNumber = '0'
                } else {
                  resData[i].cardNumber = resData01.length + ''
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
          this.data = resData
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 界面关闭移除表单内容
     */
    addDialog: function (newQuestion, oldQuestion) {
      if (this.addDialog === false) {
        this.queryName = ''
      }
    }
  }
}
</script>
<style>
</style>
