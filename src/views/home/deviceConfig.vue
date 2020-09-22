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
          node-key="id"
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
        no-data-label="暂无数据"
      >
        <!-- <template v-slot:top-right>
        <q-btn color="teal-7" :disable="loading" label="修改" @click="update" />
        <q-btn class="q-ml-sm" color="teal-7" :disable="loading" label="删除" @click="removeRow" />
        </template>-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="grid_name" :props="props">{{ props.row.grid_name }}</q-td>
            <q-td key="equipment_id" :props="props">{{ props.row.equipment_id }}</q-td>
            <q-td key="equipment_name" :props="props">{{ props.row.equipment_name }}</q-td>
          </q-tr>

        </template>
         <!-- <template v-slot:bottom>
        <q-btn color="primary" label="修改网格" />
      </template> -->
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
      selected: '',
      totalNode: [],
      addIsEnable: '',
      gridNodeSearch: '',
      gridForm: {
        name: '',
        code: '',
        parentNode: '',
        location: '',
        isEnable: ''
      },
      treeNode: [],
      simple: [{
        label: '网格节点',
        icon: 'share',
        id: '0',
        children: []
      }],
      columns: [
        {
          name: 'grid_name',
          required: true,
          label: '网格名称',
          align: 'center'
        },
        {
          name: 'equipment_id',
          align: 'center',
          label: '网格位置',
          field: 'equipment_id'
        },
        { name: 'equipment_name', align: 'center', label: '是否启用', field: 'equipment_name' }
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
            // 添加label属性
            resData[i].label = resData[i].grid_name
          }
          console.log(resData)
          // 树节点数据绑定
          this.simple[0].children = resData
          console.log(this.simple)
          // 表格数据绑定
        //   this.data = resData
        })
        .catch((error) => {
          console.log(error)
        })
    },
    findChildrenNode (gridId, query) {
      for (let i = 0; i < query.length; i++) {
        var childrenNode = []
        if (query.grid_bm === gridId) {
          childrenNode.push(query[i])
        }
      }
    },
    /**
     * 获取全部节点
     */
    getAllNode () {
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: { sqlId: 'select_grid_info_tree', whereId: '0', params: { grid_name: '' } },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          var a = this.getTreeMenu(null, null)
          console.log(a)
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
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
        data: { sqlId: 'select_equipment_in_grid', whereId: '0', params: { grid_id: this.selected }, minRow: 0, maxRow: 19 },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          console.log(res)
          const resData = res.data.data.data
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
