<template>
<div class="fit row wrap justify-start items-start content-start main_content" >
     <!-- 左边div用来显示上传的组件和显示场景图中有的那些子网格 -->
    <div class="col-3 left-div q-pt-md q-pb-md">
      <div class="left-div1">
        <q-uploader label="场景图" accept=".svg,.SVG" color="grey-5" text-color="dark" bordered no-thumbnails class="myuploader"></q-uploader>
      </div>
      <!-- 场景图中特定区域列表?怎么让这两个上下之间有间隔 -->
      <div class="left-div2 q-pt-md">
        <q-table
          table-header-class="table-header"
          :data="subGridData"
          :columns="subGridColumns"
          :selected.sync="subGridSelected"
          @update:selected ="updateSelected"
          @selection = "selectionSubGrid"
          row-key="subgrid"
          selection="single"
          class="col-auto"
        />
        <div class="q-pa-md q-gutter-sm">
          <q-btn @click="getSceneFile"  round color="primary" icon="map" title="获取场景图"/>
        </div>
      </div>
    </div>
    <!-- 右边div用来显示场景图 -->
    <div class="col right-div">
      <div ref="svgContent" class="svgContent"> 右侧 </div>
    </div>
</div>
</template>

<script>

export default {
  name: 'Mytest',
  data () {
    return {
      msg: '好好工作',
      subGridColumns: [
        { name: 'subGridName', label: '子网格(区域)', field: 'subGridName', sortable: false, align: 'left', style: 'width: 100px' },
        { name: 'subgrid', label: 'id', field: 'subgrid', sortable: false, align: 'left', style: 'width: 100px' },
        { name: 'three', label: 'three', field: 'three', sortable: false, align: 'left', style: 'width: 100px' },
        { name: 'four', label: 'four', field: 'four', sortable: false, align: 'left', style: 'width: 100px' }
      ],
      subGridData: [
        { subGridName: '111', subgrid: '1', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '2222', subgrid: '2', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '111', subgrid: '3', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '2222', subgrid: '4', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '111', subgrid: '5', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '2222', subgrid: '6', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '111', subgrid: '7', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '2222', subgrid: '8', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '111', subgrid: '9', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '2222', subgrid: '10', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '111', subgrid: '11', three: 'abcd', four: 'ddsadfa' },
        { subGridName: '2222', subgrid: '12', three: 'abcd', four: 'ddsadfa' }],
      subGridSelected: []
    }
  },
  methods: {
    // axios方法，获取后台数据
    // 'Content-Type': 'application/json'
    dataAccess (accessUrl, pdata, successCallback, errorCallback) {
      this.$axios({
        method: 'post',
        url: accessUrl,
        data: pdata,
        type: 'json'
      }).then(successCallback).catch(errorCallback)
    },
    updateSelected (newSelected) {
      // 当选择对象数组中选择的对象有变更时的设回调
    },
    getSceneFile (evt) {
      console.log('获取场景图', evt)
      var url = '/api/getSceneFile'
      var args = {
        // sceneFilePath: 'D:\\gradleDemos\\grid-engine-v2.0\\bin\\SceneFile\\场景图.svg'
        sceneFilePath: '\\SceneFile\\场景图.svg'
      }
      // 后台数据访问
      this.dataAccess(url, args, this.getSceneFileSuccess, function (err) {
        console.log('后端数据访问出错!', err)
      })
    },
    getSceneFileSuccess (res) {
      console.log('获取场景数据成功', res.data)
      var contentDiv = this.$refs.svgContent
      contentDiv.innerHTML = res.data.data
    },
    selectionSubGrid (details) {}
  }
}
</script>
<style scoped>
  .main_content {
    overflow: hidden;
    height: 100%;
  }
  .myuploader {
    height: 100%;
    width: 100%;
  }
  .right-div {
    background: rgba(86,61,124,.15);
    border: 1px solid rgba(86,61,124,.2);
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    height: 100%;
  }
  .svgContent {
    height: 100%;
  }
  .left-div {
    background: rgba(230, 75, 160, 0.15);
    border: 1px solid rgba(236, 215, 91, 0.2);
  }
  .left-div1 {
    background: rgba(46, 126, 50, 0.15);
    border: 1px solid rgba(109, 197, 74, 0.2);
    padding: 10px 15px
  }
  .left-div2 {
    background: rgba(87, 218, 228, 0.15);
    border: 1px solid rgba(226, 89, 192, 0.2);
    padding: 10px 15px;
    margin-top: 0.5rem;
    height: 100%;
    width: 100%;
  }
  .table-header {
    color: '#ff0000'
  }
</style>
