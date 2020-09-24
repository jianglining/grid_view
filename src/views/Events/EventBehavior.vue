<template>
    <div id="parent" class="fit row wrap justify-start items-start content-start" style="overflow: hidden;">
        <div class="col-2 bg-grey-6" style="overflow: auto;">
            <q-card bg-grey-6>
                <q-card-section>
                  <q-input borderless dense debounce="300" v-model="gridNodeSearch" placeholder="Search" label="网格节点搜索" label-color="grey-9">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                  </q-input>
                </q-card-section>
                <q-separator />
                <!-- 树 -->
                <q-card-section>
                    <q-tree
                        :nodes="treeNodes"
                        node-key="module_equipment_id"
                        selected-color="primary"
                        :selected.sync="selected"
                        default-expand-all
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col-grow q-col-gutter-md" style="overflow: auto;">
            <q-card bg-grey-6>
                <q-card-section>
                    <q-table
                        :data="data"
                        :columns="columns"
                        row-key="index"
                        card-style="margin:15px;height:85vh"
                        no-data-label="暂无数据"
                        :selected-rows-label="getSelectedString"
                        selection="multiple"
                        :selected.sync="checkSelect"
                    >
                    </q-table>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>
<script>
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
      treeNodes: [],
      columns: [
        {
          name: 'grid_name',
          required: true,
          label: '事件标识',
          align: 'center',
          field: 'grid_name'
        },
        {
          name: 'equipment_id',
          align: 'center',
          label: '行为标识',
          field: 'equipment_id'
        },
        {
          name: 'equipment_name',
          align: 'center',
          label: '行为名称',
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
    myTweak (offset) {
      // “offset”是一个数字（像素），它表示基于QLayout“view”属性配置的屏幕上页眉+页脚的总高度
      // 这实际上是Quasar中默认style-fn的功能
      return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
    },
    // 'Content-Type': 'application/json'
    dataAccess (accessUrl, pdata, successCallback, errorCallback) {
      this.$axios({
        method: 'post',
        url: accessUrl,
        data: pdata,
        type: 'json'
      }).then(successCallback).catch(errorCallback)
    },
    /**
     * 获取网格节点
     */
    getTreeNode () {
      this.createTree2(this.simple)
    },
    findTreeNodeBylabe (labe) {
      for (let i = 0; i < this.treeNodes.length; i++) {
        if (this.treeNodes[i].label === labe) {
          return i
        }
      }
      return -1
    },
    /**
     * 添加树形结构的节点
     */
    addTreeNodeBylabe (treeNode) {
      // 判断传入的节点是根节点还是叶子节点
    },
    createTreeNodes (res) {
      console.log('后端返回数据结果json：', res.data)
      // 构建树
      // 再从后端返回数据结果json中再取出data字段就可以得到数据库查询的结果
      // { label: '网格节点', icon: 'share', grid_bm: '-1', children: [] }
      // 如果子树为空，停止查询
      var resData = res.data.data
      if (resData.length === 0) {
        return
      }
      // 如果已经存有树形节点则先清空重新创建树
      this.treeNodes = []
      for (let i = 0; i < resData.length; i++) {
        // 添加label属性
        // {id: "门控板", equipment_type: "门控板", equipment_name: "门控板", module_equipment_id: ""}
        // {id: "30楼门禁实验", equipment_type: "门控板", equipment_name: "30楼门禁实验",module_equipment_id: "gxjt_AiDevice11"}
        // {id: "定标器", equipment_type: "定标器", equipment_name: "定标器", module_equipment_id: ""}
        // {id: "定标器1", equipment_type: "定标器", equipment_name: "定标器1", module_equipment_id: "jt_10_168_2_103"}
        // {id: "定标器2", equipment_type: "定标器", equipment_name: "定标器2", module_equipment_id: "jt_10_168_2_179"}
        // 同一个equipment_type作为一层
        // resData[i].label = resData[i].grid_name
        var layerIndex = this.findTreeNodeBylabe(resData[i].equipment_type)
        if (layerIndex < 0) {
          console.log('添加树根节点:', resData[i])
          this.treeNodes.push({ label: resData[i].equipment_type, icon: 'share', module_equipment_id: resData[i].module_equipment_id, children: [] })
        } else {
          console.log('添加叶子节点:', resData[i], '所在层：', this.treeNodes[layerIndex])
          this.treeNodes[layerIndex].children.push({ label: resData[i].equipment_name, module_equipment_id: resData[i].module_equipment_id, children: [] })
        }
      }
    },
    createTree2 (params) {
      // args: {"sqlId":"select_equipment_info_tree","whereId":"1","params":{"equipment_name":""}}
      var url = '/api/dbsource/queryByParamKey'
      var axiosParam = { sqlId: 'select_equipment_info_tree', whereId: '1', params: { equipment_name: '' } }
      axiosParam = 'args=' + JSON.stringify(axiosParam)
      console.log('访问参数：', axiosParam, url)
      // 后台数据访问
      this.dataAccess(url, axiosParam, this.createTreeNodes, function (err) {
        console.log('后端数据访问出错!', err)
      })
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
<style scoped>
  .main_content {
    height: 100%;
    width: 100%;
  }
  .my-card {
    width: 40%;
    height: 100%;
    overflow: auto;
  }
  .right-card {
    width: 85%;
  }
</style>
