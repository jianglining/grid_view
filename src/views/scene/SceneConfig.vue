<template>
<div class="fit row wrap justify-start items-start content-start main_content" >
     <!-- 左边div用来显示上传的组件和显示场景图中有的那些子网格 -->
    <div class="col-3 left-div q-pt-sm">
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
      <!-- 场景图中特定区域列表 -->
      <q-table
        table-header-class="table-header"
        :v-if="subGridTableShow"
        :data="subGridData"
        :columns="subGridColumns"
        :selected.sync="subGridSelected"
        @update:selected ="updateSelected"
        @selection = "selectionSubGrid"
        row-key="subgrid"
        selection="single"
      />
    </div>
    <!-- 右边div用来显示场景图 -->
    <div class="col-grow q-col-gutter-md right-div">
      <div ref="svgContent" class="">  {{msg}}</div>
    </div>
</div>
</template>

<script>

export default {
  name: 'SceneConfig',
  data () {
    return {
      msg: '场景预览',
      /**
       * 对象数组
       */
      subGridColumns: [
        { name: 'subGridName', label: '子网格(区域)', field: 'subGridName', sortable: false, align: 'left', style: 'width: 100px' },
        { name: 'subgrid', label: 'id', field: 'subgrid', sortable: false, align: 'left', style: 'width: 100px' }
      ],
      subGridData: [],
      subGridSelected: [],
      subGridTableShow: false
    }
  },
  methods: {
    selectionSubGrid (details) {
      // 因为表格被设置成了单选,选择元素在第0个
      var row = details.rows[0]
      // 构造选择器
      var selector = 'g[subgrid="' + row.subgrid + '"]'
      var subGridsDOM = document.querySelectorAll(selector)
      // 回为是querySelectorAll所以有可能是多个
      console.log('----------勾选Dom:', subGridsDOM)
      // 规定每一个子网格都要有一个用来表示报警的多边形区域,前且要定义报警时的填充色,以前及报警与不报警时填充色的透明度值,程序在改变报警状态时改变这个透明度值以示报警
      // 为了能实现这个功能要求报警多边形要在该区域组中是最上边的层,且属于该组的第一子层
      // 找到报警层,要求属于subGridsDOM该组的第一子层
      // 选择子网格中的行
      if (details.added) {
        // 被添加到subGridSelected时
        console.log('勾选:', details)
        for (let i = 0; i < subGridsDOM[0].children.length; i++) {
        // 如果是polygon alarmLayer="true" 就说明该层是报警层
        // var alarmLayerDom = subGridsDOM[0].children[i].querySelectorAll('polygon[alarmLayer]')
        // console.log('报警层', subGridsDOM[0].children[i].querySelector('polygon[alarmlayer="true"]'))
        // console.log('报警层22', subGridsDOM[0].children[i].getAttribute('alarmlayer'))
          if (subGridsDOM[0].children[i].getAttribute('alarmlayer')) {
            // 改变报层层的属性
            console.log('报警层22', subGridsDOM[0].children[i])
            subGridsDOM[0].children[i].setAttribute('opacity', '0.8')
          }
        }
      } else {
        // 从subGridSelected数组中移除时
        console.log('取消勾选:', details)
        for (let i = 0; i < subGridsDOM[0].children.length; i++) {
        // 如果是polygon alarmLayer="true" 就说明该层是报警层
        // var alarmLayerDom = subGridsDOM[0].children[i].querySelectorAll('polygon[alarmLayer]')
        // console.log('报警层', subGridsDOM[0].children[i].querySelector('polygon[alarmlayer="true"]'))
        // console.log('报警层22', subGridsDOM[0].children[i].getAttribute('alarmlayer'))
          if (subGridsDOM[0].children[i].getAttribute('alarmlayer')) {
            // 改变报层层的属性
            console.log('报警层22', subGridsDOM[0].children[i])
            subGridsDOM[0].children[i].setAttribute('opacity', '0.1')
          }
        }
      }
    },
    updateSelected (newSelected) {
      // 当选择对象数组中选择的对象有变更时的设回调
    },
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
      // 获取文档中有 "sub-grid" 属性的第一个 <g> 元素：
      // 查找文档中共包含 "sub-grid" 属性的 <g> 标签
      var subGrids = document.querySelectorAll('g[subgrid]')
      if (subGrids.length > 0) {
        this.subGridTableShow = true
        // this.subGridData.push({ subGridName: treeNode.id })
        for (let i = 0; i < subGrids.length; i++) {
          // { name: 'subGridName', label: '子网格(区域)', field: 'subGridName', sortable: true, align: 'left' },
          // { name: 'subgrid', label: 'id', field: 'subgrid', sortable: true, align: 'left' }
          this.subGridData.push({ subGridName: subGrids[i].id, subgrid: subGrids[i].getAttribute('subgrid') })
          console.log('子网格:', subGrids[i].id, subGrids[i].getAttribute('subgrid'), subGrids[i])
        }
      }
      console.log('特殊属性查找:', subGrids)
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
      this.subGridData = []
      this.subGridTableShow = false
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
  .main_content {
    overflow: hidden;
  }
  .right-div {
    overflow: auto;
  }
  .left-div {
    overflow: auto;
  }
  .table-header {
    backgroundColor: '#ff0000'
  }
</style>
