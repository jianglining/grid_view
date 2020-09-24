<template>
  <q-splitter v-model="splitterModel" style="height: 90vh">
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
        row-key="index"
        card-style="margin:15px;height:85vh"
        no-data-label="暂无数据"
        :selected-rows-label="getSelectedString"
        selection="multiple"
        table-header-class="bg-blue-8 text-white"
        :selected.sync="checkSelect"
      >
      </q-table>
          <div class="q-mt-md">
      Selected: {{ JSON.stringify(checkSelect) }}
    </div>
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
      selected: '',
      checkSelect: [],
      gridNodeSearch: '',
      simple: [{
        label: '网格节点',
        icon: 'share',
        grid_bm: '-1',
        children: []
      }],
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
      this.createTree(this.simple)
    },
    createTree (params) {
      console.log(params)
      for (let i = 0; i < params.length; i++) {
        const query = {
          url: 'api/dbsource/queryByParamKey',
          data: { sqlId: 'select_grid_info', whereId: '2', orderId: '0', params: { parent_bm: params[i].grid_bm } },
          method: 'post',
          type: 'db_search'
        }
        fetchData(query)
          .then((res) => {
            const resData = res.data.data
            // 如果子树为空，停止查询
            if (resData.length === 0) {
              return
            }
            for (let i = 0; i < resData.length; i++) {
            // 添加label属性
              resData[i].label = resData[i].grid_name
            }
            params[i].children = resData
            // 递归查询子树
            this.createTree(params[i].children)
            // 设置含有子树的节点的图标
            if (params[i].children.length > 0) {
              params[i].icon = 'share'
            }
          })

          .catch((error) => {
            console.log(error)
          })
      }
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
    },
    options () {},
    onReset () {}
  },
  watch: {
    // 监听事件
    selected: function (newQuestion, oldQuestion) {
      // this.$router.push({ path: '/about' })
      console.log(this.selected)
      if (this.selected === null) {
        this.selected = oldQuestion
      }
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_equipment_in_grid',
          whereId: '0',
          params: { grid_id: this.selected },
          minRow: 0,
          maxRow: 19
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          const resData = res.data.data.data
          for (let i = 0; i < resData.length; i++) {
            // index为表格唯一标识
            resData[i].index = i
          }
          this.data = resData
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style>
</style>
