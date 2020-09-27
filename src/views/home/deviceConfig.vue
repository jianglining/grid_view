<template>
  <q-splitter v-model="splitterModel" style="height: 90vh">
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
          default-expand-all
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
                <q-btn label="添加关联设备" icon="add" type="submit" color="primary" />
                <q-btn label="删除关联设备" icon="delete" type="reset" color="red" class="q-ml-sm" />
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
export default {
  data () {
    return {
      splitterModel: 20,
      pageTotalumbe: [5, 10, 20, 50],
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
      selected: '-1',
      checkSelect: [],
      gridNodeSearch: '',
      simple: [
        {
          label: '网格节点',
          icon: 'share',
          grid_bm: '-1',
          children: []
        }
      ],
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
      data: []
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
    },
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
    getSelectedString () {
      return this.selected.length === 0
        ? ''
        : `${this.selected.length} record${
            this.selected.length > 1 ? 's' : ''
          } selected of ${this.data.length}`
    },
    options () {},
    onReset () {}
  },
  watch: {
    // 监听事件
    selected: function (newQuestion, oldQuestion) {
      if (this.selected === null) {
        this.selected = oldQuestion
      }
      this.refreshView()

      // this.$router.push({ path: '/about' })
      // console.log(this.selected)
      // const query = {
      //   url: 'api/dbsource/queryByParamKey',
      //   data: {
      //     sqlId: 'select_equipment_in_grid',
      //     whereId: '0',
      //     params: { grid_id: this.selected },
      //     minRow: this.startPage,
      //     maxRow: this.endPage
      //   },
      //   method: 'post',
      //   type: 'db_search'
      // }
      // fetchData(query)
      //   .then((res) => {
      //     const resData = res.data.data.data
      //     for (let i = 0; i < resData.length; i++) {
      //       // index为表格唯一标识
      //       resData[i].index = i
      //     }
      //     this.data = resData
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
    }
  }
}
</script>
<style>
@import "../../assets/css/tableStyle.css";
</style>
