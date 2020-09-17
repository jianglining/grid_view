<template>
  <q-card class="main_content" >
    <q-card-section>
  <q-btn-group push>
    <q-btn push label="新增" icon="timeline" @click="radio"/>
    <q-btn push label="修改" icon="visibility" />
    <q-btn push label="删除" icon="update" />
  </q-btn-group>

      <div class="q-pa-md">
        <q-toggle v-model="value" />

        <q-toggle
          v-model="value"
          color="green"
        />

        <q-toggle
          v-model="value"
          color="yellow"
        />

        <q-toggle
          v-model="value"
          color="red"
        />
      </div>

      <div class="q-pa-md">
        <q-badge color="secondary">
          Model: {{ standard }} (0 to 50)
        </q-badge>

        <q-slider v-model="standard" :min="0" :max="50"/>
        <q-slider v-model="standard" :min="0" :max="50" color="green"/>
      </div>

    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: '欢迎！',
      value: true,
      standard: 2
    }
  },
  methods: {
    radio () {
      this.$q.dialog({
        title: '修改',
        message: '选中修改项:',
        ok: '确定',
        cancel: '取消',
        options: {
          type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            { label: 'Option 1', value: 'opt1', color: 'secondary' },
            { label: 'Option 2', value: 'opt2' },
            { label: 'Option 3', value: 'opt3' }
          ]
        },
        persistent: true
      }).onOk(data => {
        // console.log('>>>> OK, received', data)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  }
}
</script>
