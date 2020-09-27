<template>
    <div class="fit row wrap justify-start items-start content-start main_content" >
      <div class="col-2 left-div">
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
              node-key="id"
              selected-color="primary"
              :selected.sync="selected"
              default-expand-all
            />
          </q-card-section>
        </q-card>
      </div>
      <!-- 右边div -->
      <div class="col-grow q-col-gutter-md right-div">
        <q-card bg-grey-6>
          <q-card-section>
            <q-table
              :data="data"
              :columns="columns"
              card-style="margin:15px;height:85vh"
              rows-per-page-label="每页显示"
              no-data-label="暂无数据"
              :selected-rows-label="getSelectedString"
              :pagination-label="getPaginationLabel"
              selection="single"
              :selected.sync="checkSelect"
            >
              <template v-slot:top>
                <q-btn color="grey-9 " label="添加事件行为" @click="addRow" icon="add"/>
                <q-btn color="grey-9 " label="删除事件行为" @click="removeRow" icon="delete_forever" class="q-ml-sm"  />
                <q-space />
                <q-input borderless dense debounce="300" color="primary" v-model="filter">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      filter: '',
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
          name: 'incident',
          required: true,
          label: '事件标识',
          align: 'center',
          field: 'incident'
        },
        {
          name: 'behavior',
          align: 'center',
          label: '行为标识',
          field: 'behavior'
        },
        {
          name: 'behavior_name',
          align: 'center',
          label: '行为名称',
          field: 'behavior_name'
        },
        {
          name: 'grid_name',
          align: 'center',
          label: '网格名称',
          field: 'grid_name'
        }
      ],
      data: []
    }
  },
  mounted () {
    this.getTreeNode()
    // this.getAllNode()
  },
  computed: {
    // 计算属性的 getter
    selected2: function (ev) {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  },
  methods: {
    addRow () {
      this.loading = true
    },
    removeRow () {
      this.loading = true
    },
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
    findTreeNodeBylabe (labe) {
      for (let i = 0; i < this.treeNodes.length; i++) {
        if (this.treeNodes[i].label === labe) {
          return i
        }
      }
      return -1
    },
    /**
     * 树结构绑定对象的查找
     * 当前树后台只返回两层
     */
    findTreeNodeById (treeNodeId) {
      for (let i = 0; i < this.treeNodes.length; i++) {
        if (this.treeNodes[i].id === treeNodeId) {
          return this.treeNodes[i]
        }
        if (this.treeNodes[i].children.length > 0) {
          // 查找子节点
          for (let L = 0; L < this.treeNodes[i].children.length; L++) {
            // 叶子节点的查找
            // console.log('查找叶子节点：', this.treeNodes[i].children[L])
            if (this.treeNodes[i].children[L].id === treeNodeId) {
              return this.treeNodes[i].children[L]
            }
          }
        }
      }
      return null
    },
    /**
     * 添加树形结构的节点
     */
    addTreeNode (treeNode) {
      // 判断传入的节点是根节点还是叶子节点
      // 添加label属性
      // {id: "门控板", equipment_type: "门控板", equipment_name: "门控板", module_equipment_id: ""}
      // {id: "30楼门禁实验", equipment_type: "门控板", equipment_name: "30楼门禁实验",module_equipment_id: "gxjt_AiDevice11"}
      // {id: "定标器", equipment_type: "定标器", equipment_name: "定标器", module_equipment_id: ""}
      // {id: "定标器1", equipment_type: "定标器", equipment_name: "定标器1", module_equipment_id: "jt_10_168_2_103"}
      // {id: "定标器2", equipment_type: "定标器", equipment_name: "定标器2", module_equipment_id: "jt_10_168_2_179"}
      // 同一个equipment_type作为一层
      // resData[i].label = resData[i].grid_name
      var type = treeNode.equipment_type
      // 如果id===""则作为父节点否侧做为叶子节点
      var id = treeNode.module_equipment_id
      var layerIndex = this.findTreeNodeBylabe(type)
      if (id === '') {
        // 如果id===""则作为父节点否侧做为叶子节点
        if (layerIndex < 0) {
          // 如查树根不存在就添加
          console.log('添加树根节点:', treeNode)
          this.treeNodes.push({ id: treeNode.id, label: type, icon: 'share', module_equipment_id: id, children: [] })
        }
        // 如果传入的treeNode本身就是一个根节点，则什么也不做直接返回
      } else {
        // 如果不是叶子节点则构造一个父节点
        if (layerIndex < 0) {
          // 如查树根不存在先添加根节点
          // 这个时间的新增节点的id用type来替代
          var rootNode = { id: treeNode.equipment_type, label: type, icon: 'share', module_equipment_id: '', children: [] }
          console.log(id, '添加叶子节点，但没有父节点:', rootNode.id, rootNode, '子节点：', treeNode)
          // 把当前节点当作叶子节点挂上去
          rootNode.children.push({ id: treeNode.id, label: treeNode.equipment_name, module_equipment_id: id, children: [] })
          this.treeNodes.push(rootNode)
        } else {
          //  如果是叶子节点的话，先用type找父节点，找到之后添加到该根节点的子节数组中
          console.log('添加叶子节点，已经存在父节点:', layerIndex, treeNode)
          this.treeNodes[layerIndex].children.push({ id: treeNode.id, label: treeNode.equipment_name, module_equipment_id: id, children: [] })
        }
      }
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
        this.addTreeNode(resData[i])
      }
      // 设置树的默认选择项
    },
    /**
     * 重写分页标签
     * @param firstRowIndex 第一条下标
     * @param endRowIndex 最后一条下标
     * @param totalRowsNumber 总条数下标
     */
    getPaginationLabel (firstRowIndex, endRowIndex, totalRowsNumber) {
      return '显示 ' + firstRowIndex + ' ~ ' + endRowIndex + ' 条记录，总共' + totalRowsNumber + ' 条'
    },
    /**
     * 重写选中显示的文字
     */
    getSelectedString (numberOfRows) {
      return '共选中' + numberOfRows + '条记录'
    },
    /**
     * 选择树节点后要去查下该节点下的数据列表
     */
    getTreeNodeDatas (treeNode) {
      if (treeNode === null || treeNode === undefined) {
        return
      }
      if (treeNode.module_equipment_id === '') {
        return
      }
      var equipmentId = treeNode.module_equipment_id
      // 如果列表要分页
      // args: {"sqlId":"select_grid_in_equipment_port","whereId":"0","params":{"module_equipment_id":"gxjt_AiDevice11"},"minRow":0,"maxRow":19}
      var url = '/api/dbsource/queryByParamKey'
      var axiosParam = { sqlId: 'select_grid_in_equipment_port', whereId: '0', params: { module_equipment_id: equipmentId } }
      axiosParam = 'args=' + JSON.stringify(axiosParam)
      console.log('访问参数：', axiosParam, url)
      // 后台数据访问
      this.dataAccess(url, axiosParam, this.createTableDatas, function (err) {
        console.log('后端数据访问出错!', err)
      })
    },
    createTableDatas (res) {
      // 处理列表
      console.log('列表数据', res.data)
      // id: "7367745f-06a0-457e-99ce-95c6d08fe897"
      // grid_id: "4"
      // module_equipment_id: "gxjt_AiDevice11"
      // port_name: ""
      // behavior: "1"
      // behavior_name: "进入"
      // grid_name: "AB门人行入口"
      // incident: "realTimeReadCart"
      // equipment_type: "门控板"
      // !!!!!!!!!!!!!!!!!!!!这里返回的数据有相同的key,所以要作进一步的处理!!!!!!!!!!!!!!!!!
      this.data = res.data.data
    }
  },
  watch: {
    // 监听事件
    selected: function (newQuestion, oldQuestion) {
      // this.$router.push({ path: '/about' })
      // console.log(this.selected, newQuestion, oldQuestion)
      // console.log('选择的树对象', newQuestion, this.findTreeNodeById(newQuestion))
      this.getTreeNodeDatas(this.findTreeNodeById(newQuestion))
    }
  }
}
</script>
<style scoped>
  .main_content {
    overflow: hidden;
  }
  .right-div {
    overflow: auto;
  }
  .left-div {
    overflow: auto;
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
