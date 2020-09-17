<template>

  <q-card class="main_content" >
    <q-card-section>
      <div>  {{msg}}</div>
            <q-btn round dense flat color="grey-8" icon="notifications">
        <q-badge color="red" text-color="white" floating>
          2
        </q-badge>
        <q-tooltip>通知</q-tooltip>
      </q-btn>
    </q-card-section>
  </q-card>

</template>

<script>

export default {
  name: 'hello',
  data () {
    return {
      msg: '欢迎！'
    }
  }
}
</script>
