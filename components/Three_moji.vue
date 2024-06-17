<template>
  <div>
    <h1>P5Image</h1>
  <div ref="sceneContainer" class="halfscreen"></div>
</div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
  letter: {
    type: String,
    required: true
  },
  
})

const sceneContainer = ref(null)
let scene, camera, renderer, textMesh

const createTextMesh = (text) => {
  const loader = new FontLoader()
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const geometry = new TextGeometry(text, {
      font: font,
      size: 1,
      depth: 0.01,
    })
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    textMesh = new THREE.Mesh(geometry, material)
    textMesh.position.x = -text.length / 10 // Center the text horizontally
    textMesh.position.y = 5 // Center the text vertically
    scene.add(textMesh)
  })
}

const initThree = () => {
  scene = new THREE.Scene()
  
  camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 10

  renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth / 4, window.innerHeight / 4)
  if (sceneContainer.value) {
    sceneContainer.value.appendChild(renderer.domElement)
  }

  const animate = () => {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', onWindowResize)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / 2 / (window.innerHeight )
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth / 2, window.innerHeight )
}

watch(() => props.letter, async (newValue) => {
  if (textMesh) {
    scene.remove(textMesh)
  }
  if (newValue) {
    await nextTick()
    setTimeout(() => {
      createTextMesh(newValue)
    }, 2000) // 2秒後にテキストメッシュを作成
  }
})

onMounted(async () => {
  await nextTick()
  initThree()
  createTextMesh(props.letter)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  if (textMesh) {
    scene.remove(textMesh)
  }
})

//console.log("Received props:", props.letter)
</script>

<style scoped>
.halfscreen {
  
  width: 50%;
  height: 50%;
  z-index: -100;
}
</style>
