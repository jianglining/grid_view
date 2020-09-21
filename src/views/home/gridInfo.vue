<template>
  <q-splitter v-model="splitterModel" style="height: 90vh">
    <div class="q-pa-md">
      <q-dialog v-model="addDialog">
        <q-card style="max-width:90vh">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">网格添加</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <q-input
                filled
                label="网格名称"
                v-model="gridForm.name"
                outlined
                autogrow
                dense
                lazy-rules
                style="width:400px"
                :rules="[ val => val && val.length > 0 || '请输入正确的网格名称']"
              >
                <template v-slot:before>
                  <span
                    class="input-label text-right text-grey-10"
                    style="font-size:18px;width:110px"
                  >
                    网格名称
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
              </q-input>

              <q-input
                filled
                type="text"
                v-model="gridForm.code"
                outlined
                autogrow
                dense
                style="width:400px"
                label="网格编码"
                lazy-rules
                :rules="[
          val => val !== null && val !== '' || '请输入正确的网格编码',
          val => val > 0 && val < 100 || '请输入正确的网格编码'
        ]"
              >
                <template v-slot:before>
                  <span
                    class="input-label text-right text-grey-10"
                    style="font-size:18px;width:110px"
                  >
                    网格编码
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
              </q-input>
                <q-select
              style="width: 400px"
              standout="bg-blue-6 text-white"
              label="父节点"
              v-model="gridForm.parentNode"
              :options="choose"
              :dense="dense"
              :options-dense="denseOpts"
            >
              <template v-slot:before>
                  <span
                    class="input-label text-right text-grey-10"
                    style="font-size:18px;width:110px"
                  >
                    父 节 点
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
            </q-select>
              <q-input
                filled
                type="text"
                dense
                v-model="gridForm.location"
                label="网格位置"
                lazy-rules
                style="width:400px"
                :rules="[
          val => val !== null && val !== '' || '请输入正确的网格位置',
          val => val > 0 && val < 100 || '请输入正确的网格位置'
        ]"
              >
                <template v-slot:before>
                  <span
                    class="input-label text-right text-grey-10"
                    style="font-size:18px;width:110px"
                  >
                    网格位置
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
              </q-input>
            <q-select
              style="width: 400px"
              standout="bg-blue-6 text-white"
              label="是否启用"
              v-model="addIsEnable"
              :options="choose"
              :dense="dense"
              :options-dense="denseOpts"
            >
              <template v-slot:before>
                  <span
                    class="input-label text-right text-grey-10"
                    style="font-size:18px;width:110px"
                  >
                   是否启用
                    <span class="text-red text-weight-bolder">*</span>：
                  </span>
                </template>
            </q-select>
              <div>
                <q-btn label="添加" type="submit" color="primary" />
                <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" />
              </div>
            </q-form>
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
          node-key="label"
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
        row-key="name"
        card-style="margin:15px;height:85vh"
        :filter="filter"
      >
        <!-- <template v-slot:top-right>
        <q-btn color="teal-7" :disable="loading" label="修改" @click="update" />
        <q-btn class="q-ml-sm" color="teal-7" :disable="loading" label="删除" @click="removeRow" />
        </template>-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="calories" :props="props">{{ props.row.calories }}</q-td>
            <q-td key="fat" :props="props">{{ props.row.fat }}</q-td>
            <q-td key="carbs" :props="props">{{ props.row.carbs }}</q-td>
            <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
            <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
            <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
            <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
            <q-td key="cz" :props="props">
              <!-- <span><q-btn dense color="red" label="删除"  icon="highlight_off" size="8px" @click="delRecord(props.row)"/></span> -->
              <q-btn color="green-3" label="修改网格" />
            </q-td>
          </q-tr>
        </template>
        <template v-slot:top-left>
          <div class="q-gutter-md row items-start">
            <q-input
              label="网格名称"
              style="width: 265px;margin-left: 10px"
              dense
              standout="bg-blue-6 text-white"
              v-model="gridName"
              input-class="text-left"
              class="q-ml-md"
              label-color="primary"
            />

            <q-select
              style="width: 265px;margin-left: 10px"
              standout="bg-blue-6 text-white"
              label="启用类型"
              v-model="enableType"
              :options="choose"
              :dense="dense"
              :options-dense="denseOpts"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>
            <q-btn color="green-3" label="查询" icon="search" />
            <q-btn color="green-3" label="重置" icon="navigation" @click="reset" />
            <q-btn color="green-3" label="删除" icon="delete" />
            <q-btn color="green-3" label="添加网格" icon="add" @click="addDialog = !addDialog" />
          </div>
        </template>
      </q-table>
    </template>
  </q-splitter>
</template>
<script>
// import {fetchData}
export default {
  data () {
    return {
      splitterModel: 20,
      selected: 'Food',
      totalNode: [],
      addDialog: false,
      filter: '',
      gridName: '',
      enableType: null,
      addIsEnable: '',
      choose: ['是', '否'],
      dense: true,
      denseOpts: true,
      gridNodeSearch: '',
      gridForm: {
        name: '',
        code: '',
        parentNode: '',
        location: '',
        isEnable: ''
      },
      simple: [
        {
          label: '网格节点',
          children: [
            {
              label: '网格节点一',
              icon: 'restaurant_menu'
            },
            {
              label: '网格节点二',
              icon: 'room_service'
            },
            {
              label: '网格节点三',
              icon: 'photo'
            }
          ]
        }
      ],
      items: [{ message: 'Foo' }, { message: 'Bar' }],
      columns: [
        {
          name: 'name',
          required: true,
          label: '网格名称',
          align: 'left'
        },
        {
          name: 'calories',
          align: 'center',
          label: '网格位置',
          field: 'calories'
        },
        { name: 'fat', label: '是否启用', field: 'fat' },
        {
          name: 'cz',
          align: 'center',
          label: '操作',
          field: 'id'
        }
      ],
      data: [],
      data0: [
        {
          name: '网格名称一',
          calories: '网格位置一',
          fat: '是'
        },
        {
          name: '网格名称二',
          calories: '网格位置二',
          fat: '是'
        },
        {
          name: '网格名称三',
          calories: '网格位置三',
          fat: '否'
        }
      ],
      data1: [
        {
          name: '网格名称四',
          calories: '网格位置四',
          fat: '是'
        },
        {
          name: '网格名称五',
          calories: '网格位置五',
          fat: '是'
        },
        {
          name: '网格名称六',
          calories: '网格位置六',
          fat: '否'
        }
      ],
      data2: [
        {
          name: '网格名称七',
          calories: '网格位置七',
          fat: '是'
        },
        {
          name: '网格名称八',
          calories: '网格位置八',
          fat: '是'
        },
        {
          name: '网格名称久',
          calories: '网格位置九',
          fat: '否'
        }
      ]
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    dataAccess (accessUrl, pdata, successCallback, errorCallback) {
      this.$axios({
        method: 'post',
        url: accessUrl,
        data: pdata,
        type: 'json'
      }).then(successCallback).catch(errorCallback)
    },
    getList () {
      var data01 = { args: { sqlId: 'select_grid_info', whereId: '2', orderId: '0', params: { parent_bm: '-1' }, minRow: 0, maxRow: 19 } }
      this.dataAccess('/api/dbsource/queryByParamKey', data01, function (res) {
        console.log(res)
      }, function (err) {
        console.log(err)
      })
      // const query = {
      //   // url: 'http://10.168.2.206:8080/api-b/menus/me/giveanalarm-center',
      //   // url: 'http://10.168.2.206:8080/api-grid/dbsource/queryByParamKey',
      //   url: 'http://10.168.2.21:8090/dbsource/queryByParamKey',
      //   data: { args: { sqlId: 'select_grid_info', whereId: '2', orderId: '0', params: { parent_bm: '-1' }, minRow: 0, maxRow: 19 } },
      //   // url: 'http://10.168.2.206:8080/sys/login/admin/admin',
      //   method: 'post',
      //   type: 'db_search'
      // }
      // fetchData(query).then(res => {
      //   console.log(res)
      // }).catch(error => {
      //   console.log(error)
      // })
    },
    options () {},
    reset () {
      this.gridName = ''
      this.enableType = ''
    },
    onSubmit () {},
    onReset () {}
  },
  watch: {
    // 监听事件
    selected: function (newQuestion, oldQuestion) {
      // this.$router.push({ path: '/about' })
      console.log(this.selected)
      if (this.selected === '网格节点一') {
        this.data = this.data0
      }
      if (this.selected === '网格节点二') {
        this.data = this.data1
      }
      if (this.selected === '网格节点三') {
        this.data = this.data2
      }
    }
  }
}
</script>
<style>
</style>
