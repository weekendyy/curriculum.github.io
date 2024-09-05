<template>
  <div :class="`pdf-viewer ${showQD ? 'show-viewer':''}`">
    <!-- pdf展示区域 -->
    <div class="pdfArea">
      <vue-pdf-embed :src="pdfSource"></vue-pdf-embed> 
    </div>
  </div>
</template>
<script>
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

export default {
  props: {
    pdfSource: {
      type: String
    },
    showQD: {
      type: Boolean
    }
  },
  components: {  
    VuePdfEmbed  
  },
  data(){
    return {
      
    }
  },
  methods: {
    
  },
  destroyed () {
  },
  created(){
  },
  mounted(){
    
  }
}

</script>
<style scoped lang="less">
.pdf-viewer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 111111;
  opacity: 1;
  pointer-events: none;
  padding: 10px;
  box-sizing: border-box;
  background: rgba(0,0,0,0.5);
}
.show-viewer {
  opacity: 1;
  pointer-events: auto;
}

/* 右侧功能按钮区 */
.right-btn {
  position: fixed;
  right: 5%;
  bottom: 15%;
  width: 120px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 99;
}

.pdfArea {
  width: 100%;
}

/* ------------------- 输入页码 ------------------- */
.pageNum {
  margin: 10px 0;
  font-size: 18px;
}
/*在谷歌下移除input[number]的上下箭头*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
/*在firefox下移除input[number]的上下箭头*/
input[type='number'] {
  -moz-appearance: textfield;
}

.inputNumber {
  border-radius: 8px;
  border: 1px solid #999999;
  height: 35px;
  font-size: 18px;
  width: 60px;
  text-align: center;
}
.inputNumber:focus {
  border: 1px solid #00aeff;
  background-color: rgba(18, 163, 230, 0.096);
  outline: none;
  transition: 0.2s;
}

/* ------------------- 切换页码 ------------------- */
.turn {
  background-color: #888888;
  opacity: 0.7;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
}

.turn-btn {
  background-color: #000000;
  opacity: 0.6;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.turn-btn:hover,
.turn:hover {
  transition: 0.3s;
  opacity: 0.5;
  cursor: pointer;
}

/* ------------------- 进度条 ------------------- */
.progress {
  position: absolute;
  right: 50%;
  top: 50%;
  text-align: center;
}
.progress > span {
  color: #199edb;
  font-size: 14px;
}
</style>
