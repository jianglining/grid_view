<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :loading="loading"
      rows-per-page-label="每页显示条数"
    >

     <template v-slot:top>
        <q-btn color="primary" :disable="loading" label="新增" @click="addRow" />
        <q-btn class="q-ml-sm" color="primary" :disable="loading" label="删除" @click="removeRow" />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
     <template v-slot:header-cell-select="props">
        <q-th :props="props" style="align:center">
          <q-checkbox dense style="margin-left:25px;margin-top:10px" size="45px"
          v-model="checked" @change="changeAllChecked()"/>
        </q-th>
      </template>
    <template v-slot:body="props">
        <q-tr  :props="props">
          <q-td>
            <q-checkbox v-model="selected" :val="props.row.name" dense style="margin-left:9px" size="45px"/>
          </q-td>
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name">
              <q-input v-model="props.row.name" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit v-model="props.row.calories">
              <q-input v-model="props.row.calories" dense autofocus counter />
            </q-popup-edit>
          </q-td>

          <q-td key="fat" :props="props">
            {{ props.row.fat }}
            <q-popup-edit
              buttons
              v-model="props.row.fat"
            >
              <q-input
                type="fat"
                v-model="props.row.fat"
                autofocus
                counter
                @keyup.enter.stop
              />
            </q-popup-edit>
          </q-td>

          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
            <q-popup-edit v-model.number="props.row.carbs">
              <q-input type="number" v-model.number="props.row.carbs" dense autofocus />
            </q-popup-edit>
          </q-td>

          <q-td key="protein" :props="props">
            <div class="text-pre-wrap">{{ props.row.protein }}</div>
            <q-popup-edit v-model.number="props.row.protein">
              <q-input type="number" v-model.number="props.row.protein" dense autofocus />
            </q-popup-edit>
          </q-td>
            <q-td key="sodium" :props="props">
            <div class="text-pre-wrap">{{ props.row.sodium }}</div>
            <q-popup-edit v-model.number="props.row.sodium">
              <q-input type="number" v-model.number="props.row.sodium" dense autofocus />
            </q-popup-edit>
          </q-td>
            <q-td key="操作" :props="props">
              <q-btn type="number" label="修改" color="primary" @click="modify(props.row)"/>
          </q-td>
      <!--弹框-->
      <q-dialog v-model="prompt" persistent :props="props">
      <q-card style="min-width: 30%;height:55%;">
        <q-card-section class="text-h6 text-white bg-blue-7" style="width:100%;height:60px;">
          <div>修改数据</div>
        </q-card-section>
        <!--弹框滚动条-->
        <div>
        <q-scroll-area
        style="width:100% ;
              height:320px;
              border:1px solid #CCCCCC;
              margin-top:0px"
              >
        <q-card-section style="width:900px;height:40px;">
          <div class="text-body1" style="width:150px;height:40px;float:left;text-align:left;line-height:40px;">甜品名称(100g)：</div>
              <q-input outlined class="bg-grey-2" v-model="desc" :dense="true" style="height:40px;float:left"/>
        </q-card-section>
        <q-card-section style="width:900px;margin-top:15px">
          <div class="text-body1" style="width:150px;height:40px;float:left;text-align:left;line-height:40px;">卡路里：</div>
              <q-input outlined  type="number" class="bg-grey-2" v-model="fat" :dense="true" style="height:40px;float:left"/>
        </q-card-section>
                <q-card-section style="width:900px;margin-top:15px">
          <div class="text-body1" style="width:150px;height:40px;float:left;text-align:left;line-height:40px;">脂肪（g）：</div>
              <q-input outlined  type="number" class="bg-grey-2" v-model="fat" :dense="true" style="height:40px;float:left"/>
        </q-card-section>
                <q-card-section style="width:900px;margin-top:15px">
          <div class="text-body1" style="width:150px;height:40px;float:left;text-align:left;line-height:40px;">淀粉含量(g)：</div>
              <q-input outlined  type="number" class="bg-grey-2" v-model="fat" :dense="true" style="height:40px;float:left"/>
        </q-card-section>
                <q-card-section style="width:900px;margin-top:15px">
          <div class="text-body1" style="width:150px;height:40px;float:left;text-align:left;line-height:40px;">蛋白质含量(g)：</div>
              <q-input outlined  type="number" class="bg-grey-2" v-model="fat" :dense="true" style="height:40px;float:left"/>
        </q-card-section>
                <q-card-section style="width:900px;margin-top:15px">
          <div class="text-body1" style="width:150px;height:40px;float:left;text-align:left;line-height:40px;">盐含量(mg)：</div>
              <q-input outlined  type="number" class="bg-grey-2" v-model="fat" :dense="true" style="height:40px;float:left"/>
        </q-card-section>
        </q-scroll-area>
        </div>
        <!--弹框操作-->
        <q-card-actions align="center" class="text-blue-8"
        style="width:100%;height:55px;">
          <q-btn class="text-body2 bg-white" style="margin-right:100px" label="取消" @click="prompt = false" />
          <q-btn class="text-body2 bg-white" label="确定修改" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
        </q-tr>
      </template>
    </q-table>
       <div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    // emulate fetching data from server
    changeAllChecked: function () {
      if (this.checked) {
        this.selected = this.props
      } else {
        this.selected = []
      }
    },
    addRow () {
      this.loading = true
      setTimeout(() => {
        const index = Math.floor(Math.random() * (this.data.length + 1))
        const row = this.original[Math.floor(Math.random() * this.original.length)]
        if (this.data.length === 0) {
          this.rowCount = 0
        }
        row.id = ++this.rowCount
        const addRow = { ...row } // extend({}, row, { name: `${row.name} (${row.__count})` })
        this.data = [...this.data.slice(0, index), addRow, ...this.data.slice(index)]
        this.loading = false
      }, 500)
    },
    modify (s) {
      this.prompt = true
      this.desc = s.name
      this.fat = s.fat
      this.carbs = s.carbs
      this.protein = s.protein
      this.sodium = s.sodium
    },
    removeRow () {
      this.loading = true
      setTimeout(() => {
        const index = Math.floor(Math.random() * this.data.length)
        this.data = [...this.data.slice(0, index), ...this.data.slice(index + 1)]
        this.loading = false
      }, 500)
    }
  },
  data () {
    return {
      checked: false,
      selected: [],
      loading: false,
      dense: false,
      filter: '',
      rowCount: 10,
      prompt: false,
      address: '',
      columns: [
        { name: 'select', align: 'center' },
        { name: 'desc', required: true, label: '甜品名称 (100g)', align: 'left', field: row => row.name, sortable: true },
        { name: 'calories', align: 'center', label: '卡路里', field: 'calories', sortable: true },
        { name: 'fat', label: '脂肪 (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: '淀粉含量(g)', field: 'carbs' },
        { name: 'protein', label: '蛋白质含量(g)', field: 'protein' },
        { name: 'sodium', label: '盐含量(mg)', field: 'sodium' },
        { name: '操作', label: '操作', align: 'center' }
      ],
      data: [
        {
          id: 1,
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          id: 2,
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          id: 3,
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          id: 4,
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          id: 5,
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          id: 6,
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          id: 7,
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          id: 8,
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          id: 9,
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          id: 10,
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ],
      original: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ]
    }
  }
}
</script>
