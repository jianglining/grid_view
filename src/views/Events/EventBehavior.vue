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
              class="my-sticky-header-table"
              table-header-class="bg-blue-8 text-white"
              card-style="margin:15px;height:85vh"
              rows-per-page-label="每页显示"
              no-data-label="暂无数据"
              :selected-rows-label="getSelectedString"
              :pagination-label="getPaginationLabel"
              selection="single"
              :selected.sync="checkSelect"
            >
              <template v-slot:top>
                <q-btn color="primary" label="添加事件行为" @click="addRow" icon="add"/>
                <q-btn color="primary" label="删除事件行为" @click="removeRow" icon="delete_forever" class="q-ml-sm"  />
                <!-- 弹框 -->
                <q-dialog seamless v-model="addBehavior">
                  <q-card style="width: 500px;max-width: 80vw">
                    <q-card-section class="bg-primary">
                      <q-item-label class="text-h6">新增关联网络</q-item-label>
                    </q-card-section>

                    <q-separator />

                    <q-card-section style="max-height: 50vh" class="scroll">
                      <q-input outlined :dense="dense" style="margin: 25px 25px;">
                        <template v-slot:before>
                          <q-item-label style="font-size: 18px;">设&nbsp;备&nbsp;&nbsp;ID<span class="text-red text-weight-bolder">&nbsp;*</span>：</q-item-label>
                        </template>
                      </q-input>
                      <q-input outlined @click="secondDialogM" :dense="dense" placeholder="请选择网络" style="margin: 25px 25px;">
                        <template v-slot:before>
                          <q-item-label style="font-size: 18px;">网格名称<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                        </template>
                      </q-input>
                      <q-select
                        outlined
                        filled
                        use-input
                        v-model="myModel"
                        :dense="dense"
                        :options="options"
                        @input="inputchange"
                        @input-value ="myinput"
                        style="margin: 25px 25px;"
                        >
                        <template v-slot:before>
                          <q-item-label style="font-size: 18px;">事件标识<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                        </template>
                      </q-select>
                      <q-input outlined :dense="dense" style="margin: 25px 25px;">
                        <template v-slot:before>
                          <q-item-label style="font-size: 18px;">行为标识<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                        </template>
                      </q-input>
                      <q-input outlined :dense="dense" style="margin: 25px 25px;">
                        <template v-slot:before>
                          <q-item-label style="font-size: 18px;">行为名称<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                        </template>
                      </q-input>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions align="right">
                      <!-- <q-btn size="12px" color="primary" icon="send" label="保存" @click="save"/> -->
                      <q-btn flat label="保存" color="primary" @click="behaviorSave" />
                      <q-btn flat label="关闭" color="primary" v-close-popup />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <!-- 网格添加 -->
                <q-dialog seamless v-model="secondDialog" persistent transition-show="scale" transition-hide="scale">
                  <q-card class="bg-white text-white" style="width: 800px;max-width: 80vw;height:60%">
                    <q-card-section class="bg-primary">
                      <q-item-label class="text-h6">网格添加</q-item-label>
                      <q-btn icon="close" flat round dense v-close-popup style="float: right;margin-top: -30px;" />
                    </q-card-section>
                    <q-card-section class="bg-white">
                      <q-table
                        :data="data01"
                        :columns="columns01"
                        row-key="rn"
                        class="my-sticky-header-table"
                        table-header-class="bg-blue-8 text-white"
                        card-style="margin:15px;"
                        rows-per-page-label="每页显示"
                        no-data-label="暂无数据"
                        :selected-rows-label="getSelectedString"
                        :pagination-label="getPaginationLabel"
                        selection="single"
                        :selected.sync="checkSelect01"
                      >
                        <template v-slot:top>
                          <q-input outlined bottom-slots v-model="text" :dense="dense" style="width:300px">
                            <template v-slot:before>
                              <q-item-label class="text-h6">网格名称</q-item-label>
                            </template>
                          </q-input>
                          <div style="float: right;margin-top: -25px;margin-left: 100px;">
                            <q-btn color="primary" icon="search" label="查询" style="margin-right:25px" />
                            <q-btn color="primary" icon="add" label="添加到分配界面" />
                          </div>
                        </template>
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td>
                              <q-checkbox key="id" dark v-model="props.checkSelect01" color="light-blue"></q-checkbox>
                            </q-td>
                            <q-td key="grid_name" :props="props">{{ props.row.grid_name }}></q-td>
                            <q-td key="location" :props="props">{{ props.row.location }}></q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </q-card-section>
                  </q-card>
                </q-dialog>
                <q-space />
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
      dense: true,
      myModel: null,
      loading: false,
      addBehavior: false,
      secondDialog: false,
      text: '',
      options: [],
      filter: '',
      splitterModel: 20,
      selected: '',
      checkSelect: [],
      checkSelect01: [],
      gridNodeSearch: '',
      simple: [{
        label: '网格节点',
        icon: 'share',
        grid_bm: '-1',
        children: []
      }],
      data01: [{ grid_name: '22222222222222', location: '555555555555555' }],
      columns01: [
        {
          name: 'grid_name',
          required: true,
          label: '网格名称',
          align: 'center',
          field: 'grid_name'
        },
        {
          name: 'location',
          required: true,
          align: 'center',
          label: '网格位置',
          field: 'location'
        }
      ],
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
    secondDialogM () {
      var url = '/api/dbsource/queryByParamKey'
      var sqlIdStr = {
        sqlId: 'select_grid_info',
        whereId: '',
        orderId: '0',
        params: {
          parent_bm: ''
        },
        minRow: '0',
        maxRow: '15'
      }
      sqlIdStr = 'args=' + JSON.stringify(sqlIdStr)
      console.log('访问参数：', sqlIdStr, url)
      this.secondDialog = true
      // 后台数据访问
      this.dataAccess(url, sqlIdStr, this.addTableData, function (err) {
        console.log('后端数据访问出错!', err)
      })
    },
    // 添加表格数据
    addTableData (res) {
      console.log('获取数据', res.data.data)
    },
    addRow () {
      if (!this.module_equipment_id) {
        this.addBehavior = true
      }
      // this.loading = true
      // var url = '/api/dbsource/queryByParamKey'
      // // {"sqlId":"select_equipment_incident_info_select","whereId":"0","params":{"equipment_type_name":"门控板"}}
      // var sqlIdd = { sqlId: 'select_equipment_incident_info_select', whereId: '0', params: { equipment_type_name: '' } }
      // sqlIdd = 'args=' + JSON.stringify(sqlIdd)
      // //   this.addBehavior = true
      // console.log('访问参数：', sqlIdd, url)
      // // 后台数据访问
      // this.dataAccess(url, sqlIdd, this.equipmentType, function (err) {
      //   console.log('后端数据访问出错!', err)
      // })
    //   itemAdd () {
    //   // this.itemAddd = true
    //   var url = '/api/dbsource/queryByParamKey'
    //   var sqlIdd = { sqlId: 'select_equipment_type_analysis_info_select' }
    //   sqlIdd = 'args=' + JSON.stringify(sqlIdd)
    //   // JSON.stringify(row)
    //   console.log('访问参数：', sqlIdd, url)
    //   this.itemAddd = true
    //   // 后台数据访问
    //   this.dataAccess(url, sqlIdd, this.equipmentType, function (err) {
    //     console.log('后端数据访问出错!', err)
    //   })
    // },
    },
    removeRow () {
      this.loading = true
    },
    inputchange () {},
    myinput () {},
    behaviorSave () {},
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
    // for (let i = 0; i < this.treeNodes.length; i++) {
    //     if (this.treeNodes[i].module_equipment_id === this.selected) {
    //       this.addBehavior = true
    //     }
    //   }
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
      for (let i = 0; i < this.treeNodes.length; i++) {
        if (this.treeNodes[i].children.length > 0) {
          // 查找子节点
          for (let L = 0; L < this.treeNodes[i].children.length; L++) {
            // 叶子节点的查找
            // console.log('查找叶子节点：', this.treeNodes[i].children[L])
            if (this.treeNodes[i].children[L].id === this.selected) {
              this.module_equipment_id = this.treeNodes[i].children[L].module_equipment_id
            }
          }
        }
      }
      this.getTreeNodeDatas(this.findTreeNodeById(newQuestion))
    }
    // for (let i = 0; i < this.simple.length; i++) {
    //     if (this.simple[i].id === this.selected) {
    //       this.addData.id = this.simple[i].id
    //       this.addData.api_name = this.simple[i].api_name
    //       this.addData.api_description = this.simple[i].api_description
    //       var a = this.addData.api_description.split('\n')
    //       for (let i = 0; i < a.length; i++) {
    //         a[i] = a[i].replace('<p>', '')
    //         a[i] = a[i].replace('</p>', '')
    //         a[i] = a[i].replace(/['"\b\f\n\r\t]/g, '')
    //       }
    //       this.addData.api_description = a
    //       break
    //     }
    //   }
  }
}
</script>
<style scoped>
@import "../../assets/css/tableStyle.css";
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
