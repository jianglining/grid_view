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
      // 选择的节点
      selected: '',
      totalNode: [],
      addDialog: false,
      queryName: '',
      enableType: null,
      addIsEnable: '',
      // 父节点数据
      choose: [],
      dense: true,
      denseOpts: true,
      // 网格节点查询数据
      gridNodeSearch: '',
      // 表单数据
      gridForm: {
        name: '',
        code: '',
        parentNode: '',
        location: '',
        isEnable: ''
      },
      // 树
      simple: [
        {
          label: '网格节点',
          icon: 'share',
          grid_bm: '-1',
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
    // this.getAllNode()
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
      // 构建树
      this.createTree(this.simple)

      /**
       * 初始化表格数据
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
    /**
     * 构建树
     */
    createTree (params) {
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
    /**
     * 查看网格详情
     */
    detailView (params) {
      console.log(params)
      this.addDialog = true

      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_grid_statistics_card_info',
          orderId: '0',
          params: { grid_id: params.grid_bm },
          minRow: 0,
          maxRow: 15
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          console.log(res)
          const resData = res.data.data.data
          this.detailData = resData
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 移除表单内容
     */
    removeGridForm () {
      this.gridForm.name = ''
      this.gridForm.code = ''
      this.gridForm.parentNode = ''
      this.gridForm.location = ''
      this.gridForm.isEnable = ''
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
    renderData (params) {
      const query = {
        url: 'api/dbsource/queryByParamKey',
        data: {
          sqlId: 'select_grid_info',
          whereId: '2',
          orderId: '0',
          params: { parent_bm: this.selected },
          minRow: 0,
          maxRow: 19
        },
        method: 'post',
        type: 'db_search'
      }
      fetchData(query)
        .then((res) => {
          console.log(res)
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
                console.log(resData01)
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
          console.log(res)
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
                console.log(resData01)
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
