<template>
  <div id="Analysis" class="full-width row wrap justify-start items-stretch content-start" style="overflow: hidden;">
    <div class="col-2 bg-grey-6">
      <q-card bg-grey-6>
        <q-card-section>
          <q-input
            borderless
            dense
            label-color="grey-9"
            v-model="equipmentNodeSearch"
            debounce="500"
            filled
            placeholder="请输入关键字搜索"
            >
            <template v-slot:append>
              <q-icon name="equipmentNodeSearch" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-list bordered separator style="height: 730px;">
            <q-item
              v-for="item in list"
              :key="item.id"
              class="q-my-sm"
              @click="qitemclick"
              active-class="my-menu-link"
              clickable
              v-ripple
              >
              <q-item-section>
                <q-item-label :myData = item.id>{{item.equipment_type}}</q-item-label>
              </q-item-section>

              <!-- <q-item-section v-for="item in list" :key="item.id">{{item['equipment_type']}}</q-item-section> -->
            </q-item>

            <!-- <q-separator spaced inset /> -->
          </q-list>
          <div class="q-pa-md q-gutter-sm">
            <q-btn no-caps color="primary" label="添加" @click="itemAdd" />
            <q-btn no-caps color="primary" label="编辑" @click="itemEdit" />
            <q-btn no-caps color="primary" label="删除" @click="delet" />
            <q-dialog v-model="itemAddd">
              <q-card style="width: 500px;max-width: 80vw">
                <q-card-section class="bg-primary">
                  <q-item-label class="text-h6">新增设备类型</q-item-label>
                </q-card-section>

                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                  <q-form @submit.prevent.stop="addsave">
                    <q-select
                      outlined
                      filled
                      use-input
                      ref="myModel"
                      v-model="myModel"
                      :dense="dense"
                      :options="options"
                      @input="inputchange"
                      @input-value ="myinput"
                      style="margin: 25px 25px;"
                      lazy-rules
                      :rules="[val => val && val.length > 0 || '请选择设备类型']"
                      >
                      <template v-slot:before>
                        <q-item-label style="font-size: 18px;">设备类型<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                      </template>
                    </q-select>
                    <q-input
                      ref="equipment_order"
                      outlined
                      v-model="equipment_order"
                      :dense="dense"
                      lazy-rules
                      :rules="[val => val !== null && val !== '' || '请输入显示顺序']"
                      style="margin: 25px 25px;"
                      >
                      <template v-slot:before>
                        <q-item-label style="font-size: 18px;">显示顺序<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                      </template>
                    </q-input>
                  </q-form>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                  <!-- <q-btn size="12px" color="primary" icon="send" label="保存" @click="save"/> -->
                  <q-btn flat label="保存" color="primary" @click="addsave" />
                  <q-btn flat label="关闭" color="primary" @click="delet" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <q-dialog v-model="itemEdit">
              <q-card style="width: 500px;max-width: 80vw">
                <q-card-section class="bg-primary">
                  <q-item-label class="text-h6">编辑设备类型</q-item-label>
                  <!-- <q-toolbar>
                    <q-toolbar-title>新增设备类型</q-toolbar-title>
                  </q-toolbar> -->
                </q-card-section>

                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
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
                      <q-item-label style="font-size: 18px;">设备类型：</q-item-label>
                    </template>
                  </q-select>
                  <q-input outlined v-model="formain.equipment_order" :dense="dense" style="margin: 25px 25px;">
                    <template v-slot:before>
                      <q-item-label style="font-size: 18px;">显示顺序：</q-item-label>
                    </template>
                  </q-input>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                  <!-- <q-btn size="12px" color="primary" icon="send" label="保存" @click="save"/> -->
                  <q-btn flat label="保存" color="primary" @click="editSave" />
                  <q-btn flat label="关闭" color="primary" @click="delet" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-grow q-col-gutter-md" style="overflow: auto;">
      <q-card bg-grey-6 style="margin-left:15px">
        <q-card-section>
          <div class="q-pa-md q-gutter-sm">
            <q-btn color="primary" icon="add" label="事件配置" style="margin-right:30px" />
            <q-btn color="primary" icon="add" label="事件添加" />
            <q-btn color="primary" icon="delete" label="事件删除" />
            <q-dialog>
              <!-- v-model="eventAddd" -->
              <q-card style="width: 500px;max-width: 80vw">
                <q-card-section class="bg-primary">
                  <q-item-label class="text-h6">新增事件</q-item-label>
                  <!-- <q-toolbar>
                    <q-toolbar-title>新增设备类型</q-toolbar-title>
                  </q-toolbar> -->
                </q-card-section>

                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                  <q-input id="equipment_type" outlined v-model="formain.equipment_order" :dense="dense" style="margin: 25px 25px;">
                    <template v-slot:before>
                      <q-item-label style="font-size: 18px;">显示顺序<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                    </template>
                  </q-input>
                  <q-input id="equipment_type" outlined v-model="formain.equipment_order" :dense="dense" style="margin: 25px 25px;">
                    <template v-slot:before>
                      <q-item-label style="font-size: 18px;">显示顺序<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                    </template>
                  </q-input>
                  <q-input id="equipment_type" outlined v-model="formain.equipment_order" :dense="dense" style="margin: 25px 25px;">
                    <template v-slot:before>
                      <q-item-label style="font-size: 18px;">显示顺序<span class="text-red text-weight-bolder">*</span>：</q-item-label>
                    </template>
                  </q-input>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                  <!-- <q-btn size="12px" color="primary" icon="send" label="保存" @click="save"/> -->
                  <!-- <q-btn flat label="保存" color="primary" @click="save" v-close-popup /> -->
                  <q-btn flat label="关闭" color="primary" @click="delet" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-card-section>
        <!-- class="normal-table-div my-sticky-virtscroll-table"
            row-key="id"-->
        <q-card-section>
          <q-table
            :data="data"
            :columns="columns"
            rows-per-page-label="每页显示"
            no-data-label="暂无数据"
            :selected-rows-label="getSelectedString"
            :pagination-label="getPaginationLabel"
            selection="single"
            :selected.sync="checkSelect"
            :separator="separator"
            style="height:770px;"
            >
             <!-- style="height:770px;" -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td>
                  <q-checkbox key="id" dark v-model="props.selected" color="light-blue"></q-checkbox>
                </q-td>
                <q-td key="incident" :props="props">{{ props.row.incident }}></q-td>
                <q-td key="incident_explain" :props="props">{{ props.row.incident_explain }}></q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
// import EventAnalysisAdd from './EventAnalysisAdd.vue'
import { uid } from 'quasar'
export default {
  // components: {
  //   EventAnalysisAdd
  // },
  data () {
    return {
      myModel: null,
      equipment_order: null,
      options: [],
      itemAddd: false,
      itemEdit: true,
      dense: true,
      separator: 'cell',
      equipmentNodeSearch: '',
      search: '',
      selected: '',
      checkSelect: [],
      simple: [],
      formain: {
        id: '',
        equipment_type: [],
        equipment_order: '',
        incident_id: '',
        incident: '',
        incident_order: '',
        incident_explain: ''
      },
      columns: [
        {
          name: 'incident',
          required: true,
          label: '事件类型',
          align: 'center',
          field: 'incident',
          sortable: true
        },
        {
          name: 'incident_explain',
          align: 'center',
          label: '事件说明',
          field: 'incident_explain',
          sortable: true
        }
      ],
      data: [],
      list: []
    }
  },
  mounted () {
    this.getList()
    // this.equipmentType()
  },
  methods: {
    itemAdd () {
      // this.itemAddd = true
      var url = '/api/dbsource/queryByParamKey'
      var sqlIdd = { sqlId: 'select_equipment_type_analysis_info_select' }
      sqlIdd = 'args=' + JSON.stringify(sqlIdd)
      // JSON.stringify(row)
      console.log('访问参数：', sqlIdd, url)
      this.itemAddd = true
      // 后台数据访问
      this.dataAccess(url, sqlIdd, this.equipmentType, function (err) {
        console.log('后端数据访问出错!', err)
      })
    },
    equipmentType (typee) {
      console.log('设备类型data', typee.data.data)
      var data02 = typee.data.data
      // this.options = data02
      for (let i = 0; i < data02.length; i++) {
        this.options.push({ value: data02[i].id, label: data02[i].name })
      }
      console.log('设备类型1111', this.options)
    },
    inputchange (value) {
      console.log('55555', value)
    },
    myinput (inputvalue) {
      console.log('inputvalue:', inputvalue)
    },
    qitemclick (event) {
      console.log('22222222', event)
      console.log(event.target.getAttribute('myData'))
      var listNodeId = event.target.getAttribute('myData')
      this.getListNodeDatas(listNodeId)
    },
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
    getList () {
      var url = 'api/dbsource/query'
      var data01 = { sqlId: 'select_equipment_type' }
      data01 = 'args=' + JSON.stringify(data01)
      this.dataAccess(url, data01, this.itemlist, function (err) {
        console.log('后端数据访问出错!', err)
      })
    },
    // 获取item列表
    itemlist (res) {
      var result = res.data.data
      console.log('数据', res.data.data)
      this.list = result
      console.log('11111111111111', this.list)
    },
    findListNodeById (listNodeId) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id === listNodeId) {
          return this.list[i]
        }
        return null
      }
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
    // 添加列表
    //  { id: d6a765d9-d9cb-4606-b4b5-9a748419951e, equipment_type: 门控板,equipment_order: 2},
    //  {id: 11d1fc07-8452-4a1b-92cc-4554d38aa9f3,equipment_type: 定标器,equipment_order: 2}
    addListNode (listNode) {
      var type = listNode.equipment_type
      console.log('添加列表数据：', listNode)
      this.list.push({ id: listNode.id, label: type, equipment_order: listNode.equipment_order })
    },
    // 构建列表
    createListNodes (res) {
      console.log('后端返回数据结果json111：', res.data)
      var resData = res.data.data
      if (resData.length === 0) {
        return
      }
      this.list = []
      for (let i = 0; i < resData.length; i++) {
        this.addListNode(resData[i])
      }
    },
    getListNodeDatas (listNodeId) {
      console.log('后端数据访问1111111111!', listNodeId)
      if (listNodeId === null || listNodeId === undefined) {
        return
      }
      if (listNodeId === '') {
        return
      }
      // 如果列表要分页
      // args: {"sqlId":"select_equipment_incident_info","whereId":"0","params":{"id":"d6a765d9-d9cb-4606-b4b5-9a748419951e"},"minRow":0,"maxRow":10}
      var url = '/api/dbsource/queryByParamKey'
      var axiosParam = { sqlId: 'select_equipment_incident_info', whereId: '0', params: { id: listNodeId } }
      axiosParam = 'args=' + JSON.stringify(axiosParam)
      console.log('访问参数：', axiosParam, url)
      // 后台数据访问
      this.dataAccess(url, axiosParam, this.createTableDatas, function (err) {
        console.log('后端数据访问出错!', err)
      })
    },
    createTableDatas (res) {
      // 处理列表
      // "rn": 1,
      // "id": "5eec4a1f-1e74-4184-add2-189e43e6afec",
      // "equipment_type_id": "d6a765d9-d9cb-4606-b4b5-9a748419951e",
      // "incident_order": "1",
      // "incident_explain": "实时读卡信息",
      // "incident": "realTimeReadCart"
      console.log('列表数据111111111111111', res.data)
      this.data = res.data.data
    },
    // 查询设备类型列表
    addsave () {
      this.$refs.myModel.validate()
      this.$refs.equipment_order.validate()
      if (this.$refs.myModel.hasError || this.$refs.equipment_order.hasError) {
        this.formHasError = true
      }
      // if (!this.formain.equipment_type) {
      //   this.$q.notify({
      //     color: 'red-5',
      //     textColor: 'white',
      //     icon: 'warning',
      //     message: '请选择设备类型'
      //   })
      //   return
      // }
      // if (!this.formain.equipment_order) {
      //   this.$q.notify({
      //     color: 'red-5',
      //     textColor: 'white',
      //     icon: 'warning',
      //     message: '请输入显示顺序'
      //   })
      //   return
      // }
      // this.equipmentType()
      // "sqlId":"insert_equipment_type",
      // "params":[{
      //   "id":"44698b65-a54e-45a5-b15b-b57459ec4537",
      //   "equipment_type":"水浸传感器",
      //   "equipment_order":"2",
      //   "incident_id":"",
      //   "incident":"",
      //   "incident_order":"",
      //   "incident_explain":""
      // this.itemAdd()
      // this.equipmentType()
      const ids = uid()
      this.formain.id = ids
      // this.formain.equipment_type = this.equipment_type
      // this.formain.equipment_order = this.equipment_order
      var url = '/api/dbsource/updateByParamKey'
      var sqlIdpax = [{ sqlId: 'insert_equipment_type', params: [{ id: this.formain.id, equipment_type: this.myModel.label, equipment_order: this.formain.equipment_order }] }]
      var sqlIddStr = 'args=' + JSON.stringify(sqlIdpax)
      console.log('访问参数：', url, sqlIddStr)
      // 后台数据访问
      this.dataAccess(url, sqlIddStr, function (ress) {
        // this.$q.notify({
        //   icon: 'done',
        //   color: 'positive',
        //   message: '保存成功'
        // })
        console.log('新增数据：', ress.data)
      }, function (err) {
        console.log('后端数据访问出错!', err)
        // this.$q.notify({
        //   message: '保存失败',
        //   color: 'red',
        //   position: 'center',
        //   timeout: 5
        // })
      })
      this.increase = false
      this.getList()
      // location.reload()
    // addGrid () {
    //   this.addDialog = true
    //   this.choose = []
    //   this.queryType = 'insert_grid_info'
    //   this.renderParentNode()
    // },
    },
    editSave () {},
    delet () {}
  },
  watch: {
    selected: function (newQuestion, oldQuestion) {
      // this.$router.push({ path: '/about' })
      // console.log(this.selected, newQuestion, oldQuestion)
      // newQuestion是question改变后的新值
      // oldQuestion是question改变之前的值
      // console.log('选择的树对象', newQuestion, this.findItemsById(newQuestion))
      // this.getListNodeDatas(this.findListNodeById(newQuestion))
      this.getListNodeDatas(newQuestion)
    }
    // options: function (newData, oldData) {
    //   for (let i = 0; i < this.options.length; i++) {
    //     if (this.options[i].id === this.selected) {
    //       this.formain.id = this.options[i].id
    //       this.formain.equipment_type = this.options[i].lable
    //       this.formain.equipment_order = this.options[i].equipment_order
    //     }
    //   }
    // }
  }

}
</script>
<style scoped>
  .svgContent {
    height: 100%;
    width: 100%;
  }
  .main_content {
    height: 100%;
    width: 100%;
  }
  /* .my-menu-link {
    color: white
    background: F2C037
  } */
</style>
