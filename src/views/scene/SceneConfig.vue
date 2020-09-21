<template>
  <q-card class="main_content" >
    <div class="q-pa-md">
      <q-uploader url="http://localhost:4444/upload" label="场景图" accept=".svg,.SVG" color="grey-5" text-color="dark" bordered no-thumbnails
        @factory-failed="uploaderFactoryFailed"
        @added="uploaderAdded"
        @removed="uploaderRemoved"
        @start="uploaderStart"
        @finish="uploaderFinish"
        @uploaded="uploadedFunction"
        @failed="uploadedFailed"
        @uploading="uploading"
        @rejected="uploadedRejected"
      >
      </q-uploader>
    </div>
    <div ref="svgContent">  {{msg}}</div>
  </q-card>

</template>

<script>

export default {
  name: 'SceneConfig',
  data () {
    return {
      msg: '场景配置！'
    }
  },
  methods: {
    /**
     * 选择要上传的文件后的回调
     * 可以在这里进行对svg原文件的解析，从中解析出场景中各网格的信息
     * 解析过程和算法要结合svg原文件中的特定格式
     */
    setSvgContent (event) {
      // 作为url地址载入到内存之后使用THREE.OBJLoader把模型文件放到场景中
      // console.log('解析文件：', event.target.result)
      // this.setSvgContent(event.target.result)
      // 取出svg原文件中的字符串格式
      var svtStr = event.target.result
      var contentDiv = this.$refs.svgContent
      contentDiv.innerHTML = svtStr
      // console.log('svg显示容器', contentDiv, svtStr)
    },
    uploaderFactoryFailed (err, files) {
      // 上传文件选择不符合要求的事件回调
      // rejectedEntries参数是对象：{ failedPropValidation: string, file: File } 的数组
      // 包括了一个失败的文件对象，以前失效的原因
      console.log('uploaderFactoryFailed(err, files).....', err, files)
    },
    uploaderAdded (files) {
      // 用户选择文件并被添加到上传框时的事件回调
      console.log('uploaderAdded.....', files)
      var oReq = null
      if (window.XMLHttpRequest) {
        // 非IE内核
        oReq = new XMLHttpRequest()
      } else if (window.ActiveXObject) {
        // IE内核，这里早期IE版本不同，具体可以查下
        // oReq = new ActiveXObject('Microsoft.XMLHTTP')
        console.log('当前浏览器不支持', oReq)
      }
      var reader2scene = new FileReader()
      // 读取本地的svg文件放到场景预览节点
      reader2scene.onload = this.setSvgContent
      // 要把文件转换成Blob Url
      // reader2scene.readAsDataURL(files)
      // 以文本方式读
      reader2scene.readAsText(files[0])
      console.log('oReq.....', oReq)
    },
    uploaderRemoved (files) {
      // 从上传组件中移除文件
      console.log('移除：uploaderRemoved(files).....', files)
      var contentDiv = this.$refs.svgContent
      contentDiv.innerHTML = ''
    },
    uploaderStart () {
      // 上传组件开始事件是当点击上传按钮时被回调
      console.log('上传组件开始事件：uploaderStart ().....')
    },
    uploaderFinish () {
      // 上传组件开始事件是当点击上传按钮时被回调
      console.log('上传组件文件上传结束事件：uploaderFinish ().....')
    },
    uploadedFunction (info) {
      // 上传组件开始事件是当点击上传按钮时被回调
      console.log('上传组件文件上传过程事件：uploadedFunction (info).....', info)
    },
    uploadedFailed (info) {
      // 上传组件文件上传失败事件
      console.log('上传组件文件上传失败事件：uploadedFailed (info).....', info)
    },
    uploading (info) {
      // 上传组件文件上传过程事件
      console.log('上传组件文件上传失败事件：uploadedFailed (info).....', info)
    },
    uploadedRejected (rejectedEntries) {
      // 上传文件选择不符合要求的事件回调
      // rejectedEntries参数是对象：{ failedPropValidation: string, file: File } 的数组
      // 包括了一个失败的文件对象，以前失效的原因
      // accept, max-file-size, max-total-size, filter等原因都有可能出错
      console.log('上传组件文件上传失败事件：uploadedRejected (rejectedEntries).....', rejectedEntries)
    }
  }
}
</script>
<style scoped>
</style>
