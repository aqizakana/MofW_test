<template>
    <div ref="sceneContainer" class="fullscreen"></div>
   
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import * as THREE from 'three'
  import { defineProps } from 'vue'

 const props = defineProps({

  Vertices: {
    type: Number,
    required: true
  }
}) 


  const sceneContainer = ref(null)

  const vertices = ref(0)
  
  onMounted(() => {
    console.log("Vertices", props.Vertices)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true }) // 透明背景のための設定
    renderer.setSize(window.innerWidth, window.innerHeight)
    sceneContainer.value.appendChild(renderer.domElement)
  
    const particleCount = 1000  // パーティクルの数を増やす
    const waveCount = props.Vertices + 1   // ウェーブの数を増やす
    const waveSpacing = 2.5
    const waveHeight = 5// ウェーブの高さを増やす
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3 * waveCount)
  
    for (let j = 0; j < waveCount; j++) {
      for (let i = 0; i < particleCount; i++) {
        const x = (i / particleCount) * 10 - 5 *  Math.cos(Math.random()*1) 
        const y = Math.cos(x) * waveHeight
        const z = (j - waveCount / 2) * waveSpacing
        positions[(j * particleCount + i) * 3] = y * Math.sin(Math.random()*1) 
        positions[(j * particleCount + i) * 3 + 1] = x
        positions[(j * particleCount + i) * 3 + 2] = z
      }
    }
  
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
    const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.05, transparent: true, opacity: 0.5 })
    const particles = new THREE.Points(geometry, material)
  
    scene.add(particles)
    camera.position.z =10 // カメラを遠ざける
  
    const animate = function () {
      requestAnimationFrame(animate)
  
      const positions = particles.geometry.attributes.position.array
      const time = Date.now() * 0.0005
  
      for (let j = 0; j < waveCount; j++) {
        for (let i = 0; i < particleCount; i++) {
          const x = (i / particleCount) * 10 - 5
          positions[(j * particleCount + i) * 3 + 1] = Math.cos(x + time) * waveHeight
        }
      }
  
      particles.geometry.attributes.position.needsUpdate = true
  
      renderer.render(scene, camera)
    }
    //console.log("Props", props.Vertices, props.result)
  
    animate()
  })
  </script>
  
  <style scoped>
  .fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -200;
  }
  </style>
  
  