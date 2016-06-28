<template>
<div id="allmap"></div>
</template>
<script language="javascript">
  export default {
    ready: function() {
      setTimeout(function() {
        var map = new BMap.Map('allmap')
        var point = new BMap.Point(116.331398, 39.897445)
        map.centerAndZoom(point, 12)
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder()
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint('北京市海淀区上地10街', function (point) {
          if (point) {
            map.centerAndZoom(point, 16)
            map.addOverlay(new BMap.Marker(point))
          } else {
            window.alert('您选择地址没有解析到结果!')
          }
        }, '北京市')
      }, 30)

      document.write("<script src='http://api.map.baidu.com/api?v=2.0&ak=SW7qLVC9KNTO8aTVtgC0BpA0VcwXLsjd'><\ /script>")
    }
  }
</script>
