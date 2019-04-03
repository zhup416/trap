<template>
  <div class="file-box">
    <input
      class="file-btn"
      type="file"
      accept="image/*"
      capture="camera"
      v-on:change="uploadPic($event)"
    >
    {{title}}
    <!--<img :src="icon_img" v-if="!title" alt="">-->
    <div class="mask" v-if="isMask">
      <div>上传图片中，请稍后....</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: ['title'],
  data() {
    return {
      isMask: false,
      icon_img: 'data:image/png;base64,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'
    }
  },
  created() {
    console.log(this.title)
  },
  methods: {
    async uploadPic($event) {
      var obj = $event.target
      if (!obj || !obj.files || !obj.files[0] || obj.files[0].size === 0) {
        return false
      }
      this.isMask = true
      var file = obj.files[0]
      var val = obj.value
      var suffix = val.substr(val.indexOf('.'))
      var storeAs = 'libawall/communicate/images/' + this.timestamp() + suffix
      console.log(file.name + ' => ' + storeAs)
      // this.$emit('isMask', true)
      const OSS = require('ali-oss')
      var client = new OSS({
        endpoint: 'image.libawall.com',
        accessKeyId: 'LTAI2ilKhlzsET3K',
        accessKeySecret: '1qwb32iXyYAyZgX4Ar9TU1ldnvRQat',
        bucket: 'libawall',
        secure: true,
        cname: true
      })
      try {
        var result = await client.put(storeAs, file)
        console.log(result)
        this.$emit('handleUploadImg', result)
        // this.$emit('isMask', false)
        this.isMask = false
      } catch (e) {
        this.isMask = false
        console.log(e)
      }
    },
    timestamp() {
      var time = new Date()
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      console.log(y)
      return '' + y + this.add0(m) + this.add0(d) + this.add0(h) + this.add0(mm) + this.add0(s) + '' + parseInt(Math.random() * 10000)
    },
    add0(m) {
      return m < 10 ? '0' + m : m
    }
  }
}
</script>

<style scoped>
.file-box {
  display: inline-block;
  position: relative;
  padding: 3px 5px;
  overflow: hidden;
  color: #666;
  /*background-color: #ccc;*/
}

.file-btn {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: none;
  background-color: transparent;
  filter: alpha(opacity=0);
  -moz-opacity: 0;
  -khtml-opacity: 0;
  opacity: 0;
  z-index: 99999;
}
.mask {
  position: fixed;
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100%;
  top: 46px;
  left: 0;
  background-color: #000;
  opacity: 0.2;
  z-index: 99999;
  text-align: center;
}
.mask div {
  margin: 0 auto;
  color: #fff;
}
</style>
