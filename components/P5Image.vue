<template>
  <div>
    <h1>P5Image</h1>
    <div ref="p5Container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'

// p5.jsをCDNから読み込む
const script = document.createElement('script')
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js'
document.head.appendChild(script)

const props = defineProps({
  result: {
    type: Array, // 修正: type を Object から Array に変更
    required: true
  },
  vertices: {
    type: Number,
    required: true
  },
  

})

const p5Container = ref(null)

const setupSketch = () => {
  const sketch = (p) => {
    let w = 400
    let h = 400
    let point1 = new Array(2)
    let point2 = new Array(2)
    let d
    let r = 200
    let seed1
    let seed2

    p.setup = () => {
      p.createCanvas(w, h)
      p.background(255) // white
      d = p.TWO_PI / 360
      seed1 = p.random()
      seed2 = p.random()
    }

    p.draw = () => {
      p.push()
      p.translate(w / 2, h / 2)
      let n1 = p.noise(seed1 + 0.02 * p.frameCount) * r
      let n2 = p.noise(seed2 + 0.02 * p.frameCount) * r
      point1[0] = p.cos(d * p.frameCount) * n1
      point1[1] = p.sin(d * p.frameCount) * n1
      point2[0] = p.cos(d * p.frameCount + p.HALF_PI) * n2
      point2[1] = p.sin(d * p.frameCount + p.HALF_PI) * n2
      p.stroke(p.frameCount / props.vertices,props.result[0].score*600,50*props.vertices)
      if (p.frameCount > 1250) {
        p.noLoop()
      }
      p.line(point1[0], point1[1], point2[0], point2[1])
      p.pop()
    }
  }
  new window.p5(sketch, p5Container.value)
}

onMounted(() => {
  const waitForP5 = setInterval(() => {
    if (window.p5) {
      clearInterval(waitForP5)
      setupSketch()
    }
  }, 100)
})

watch(() => props.vertices, (newVal) => {
  if (window.p5) {
    setupSketch()
  }
})

//console.log("Vertices", props.vertices)
//console.log("Result Score", props.result[0].score*300)
</script>

<style scoped>
/* 任意のスタイル */
</style>
