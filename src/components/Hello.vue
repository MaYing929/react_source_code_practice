<template>
  <div class="hello">
  <span>
     地图:
    <select v-model="selected">
      <option v-for="option in options" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
  </span>


 <span>
   城市:
    <select v-model="selected">
      <option v-for="option in options" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
 </span>


 <span>
     商圈:
    <select v-model="selected">
      <option v-for="option in options" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
 </span>
   <span>
      <button>展示</button>
   </span>

 <span class="right">

    <input type="text" v-model="message" placeholder="幸福大街59号">
    <button>定位</button>
 </span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Hello World!',
        selected: 'bei',
        options: [
          {text: '北京', value: 'bei'},
          {text: '上海', value: 'shang'},
          {text: '天津', value: 'tian'}
        ]
      }
    }
  }
</script>
<style scoped>
  .hello {
    height: 60px;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    line-height: 60px;
    padding: 0 12%;
  }

  select {
    width: 80px;
    padding-left: 30px;
  }

  span {
    display: inline-block;
    overflow: hidden;
    margin-right: 50px;
  }

  button {
    width: 60px;
  }

</style>

