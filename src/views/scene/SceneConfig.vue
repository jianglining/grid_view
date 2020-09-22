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
    <div ref="svgContent" class="">  {{msg}}</div>
  </q-card>

</template>

<script>

export default {
  name: 'SceneConfig',
  data () {
    return {
      msg: '场景预览'
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
      // 以文本方式开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个字符串以表示所读取的文件内容。
      var svtStr = event.target.result
      var contentDiv = this.$refs.svgContent
      contentDiv.innerHTML = svtStr
      // console.log('svg显示容器', contentDiv, svtStr)
      // 返回的是一个同名节点的数组
      var svgdoc = document.getElementsByTagName('svg')
      var svgdocjs = svgdoc[0].getElementsByTagName('script')
      console.log('svg中的脚本对象:', svgdocjs)
      var outerPetals = document.querySelector("g[name='外层花瓣']")
      console.log('外层花瓣通过属性查找:', outerPetals)
      // 调用svg中的脚本
      // svgJs('2222222222222')
      // var childNodes = this.$refs.svgref.childNodes
      // 因为只作单一场景所以，第0个索引下的数组对象就是场景图
      console.log('svg节点', svgdoc, svgdoc[0].childNodes)
      // svg作为innerHTML被加进来没办法执行里面的js方法
      // svgdoc[0].onload()
    },
    svgJs (evt) {
      console.log('这里是vue中的方法:', evt)
    },
    setInnerHTML (el, htmlCode) {
      // navigator.userAgent属性是一个只读的字符串，声明了浏览器用于 HTTP 请求的用户代理头的值
      var ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0) {
        htmlCode = '<div style="display:none">for IE</div>' + htmlCode
      }
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
      // 以文本方式开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个字符串以表示所读取的文件内容。
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
  .svgContent {
    height: 100%;
    width: 100%;
  }
  .main_content {
    height: 100%;
    width: 100%;
  }
</style>
