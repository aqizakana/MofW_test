<template>
  <div>
    <h3>Analysis Result</h3>
    <p>Label: {{ result[0].label }}</p>
    <p>Score: {{ result[0].score }}</p>
    <p>Vertics:{{ vertices }}</p>
    <p>Statistics:{{ statistic }}</p>
    

    <h3>Generated Text</h3>
    <p>{{ letter }}</p>
    
  </div>
</template>

<script setup>
import { defineProps } from 'vue'


const props = defineProps({
  result: {
    type: Array, // 修正: type を Object から Array に変更
    required: true
  },
  letter: {
    type: String,
    required: true
  },
  showLoading: {
    type: Boolean,
    required: true
  },
  vertices: {
    type: Number,
    required: true
  },
  statistic:{
    type:Array,
    required:true
  }
})


console.log(props.result, props.letter, props.showLoading)

</script>

<style scoped>
/* 任意のスタイル */
</style>
