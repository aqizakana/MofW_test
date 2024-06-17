<template>
  <div class="container">
    <h1>Generate Image</h1>
    <div v-if="imagePath">
      <h2>Generated Image:</h2>
      <img :src="imagePath" alt="Generated Image" class="generated-image"/>
    </div>
    <div v-if="error">{{ error }}</div>
    <button @click="uploadImage" 
      v-if="imagePath" 
      class="center bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 focus:outline-none focus:ring focus:ring-violet-300 rounded-full">
        Upload image
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { defineProps } from 'vue'
import axios from 'axios'

const props = defineProps({
  imagePath: {
    type: String,
    required: true
  }
})

const error = ref(null)

watch(() => props.imagePath, (newPath) => {
  if (!newPath) {
    error.value = "Invalid image path"
  } else {
    error.value = null
  }
})

const uploadImage = async () => {
  try {
    const response = await axios.post('upload-image', {
      image: props.imagePath
    })
    console.log("Upload Image API Response:", response.data)
  } catch (error) {
    console.error('Error uploading image:', error)
    error.value = 'Error uploading image'
  }
}
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
}

img {
  margin-top: 20px;
  max-width: 100%;
}

div {
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  margin-top: 10px;
}
</style>
