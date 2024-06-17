<template>
    <div ref="sceneContainer" class="fullscreen"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import * as THREE from 'three'
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
  }
})
  
  
  const sceneContainer = ref(null)
  let scene, camera, renderer, cube
  
  onMounted(() => {
    // シーンを作成
    scene = new THREE.Scene()
  
    // カメラを作成
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
  
    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({ alpha: true }) 
    renderer.setSize(window.innerWidth/2, window.innerHeight/2)
    sceneContainer.value.appendChild(renderer.domElement)
  
    // キューブを作成
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
  
    // アニメーションループを開始
    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += props.result[0].score *1
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()
  
    // ウィンドウリサイズイベントをハンドル
    window.addEventListener('resize', onWindowResize)
  })
  
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  
  onBeforeUnmount(() => {
    // クリーンアップ
    window.removeEventListener('resize', onWindowResize)
  })
  
  </script>
  
  <style scoped>
.fullscreen {
    position: fixed ;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -100;
    }

  </style>
  