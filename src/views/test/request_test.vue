<template>
    <div class="hello" style="margin: 10px">
      <q-btn color="primary" label="请求测试" @click="test()"/>
    </div>
</template>

<script>

import { fetchData } from '../../api/index'
import * as routes from '../../api/alarm/routes'

export default {
  name: 'request_test',
  data () {
    return {
      msg: '欢迎！'
    }
  },
  methods: {
    test () {
      const query = {
        url: routes.dbsource.queryByParamKey,
        method: 'post',
        type: 'db_search',
        data: {
          username: '小笨猪'
        }
      }
      console.log(query.url)
      fetchData(query).then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
