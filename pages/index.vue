<template>
  <div class="switch">
    <h1>テスト</h1>
    <div class="flex">
      <div class="left border-solid border-2 border-sky-500">
        <div class="vertical-stack">
          <textarea v-model="text"></textarea>
          <button @click="updateTextAndAnalyze" class="vertical-stack bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 focus:outline-none focus:ring focus:ring-violet-300 rounded-full">
            Analyze
          </button>
          <button @click="updateTextStatistics" class="vertical-stack bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 focus:outline-none focus:ring focus:ring-violet-300 rounded-full">
            updateText
          </button>
          
          <div v-if="analyzedTextResult && generatedTextResult">
            <h2>Analyzed Text Result</h2>
            <TextAnalysisResult :result="analyzedTextResult" :letter="generatedTextResult.generated_text" :vertices="extractedLabelNumber" :statistic="textStatistics" />
            <Three_moji :result="analyzedTextResult" :letter="generatedTextResult.generated_text" class="border-solid border-2 border-sky-500"/>
          </div>
        </div>
      </div>
      <div class="right border-solid border-2 border-sky-500">
        <div v-if="analyzedTextResult && generatedTextResult">
          <div class="vertical-stack">
            <P5Image :vertices="extractedLabelNumber" :result="analyzedTextResult"  class="border-solid border-2 border-sky-500"/>
            <Generate_Image :image-path="generatedImagePath" />
            <!--<button @click="reranking" class="vertical-stack bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 focus:outline-none focus:ring focus:ring-violet-300 rounded-full">
            Rerank
          </button>-->
          </div>
        </div>

        <div class="empty" v-else>
        </div>
      </div>
    </div>
    <div class="center">
      <ThreeBack  :Vertices="extractedLabelNumber"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app'
import TextAnalysisResult from '~/components/TextAnalysisResult.vue'
import Three_moji from '~/components/Three_moji.vue'
import Generate_Image from '~/components/Generate_Image.vue'
import P5Image from '~/components/P5Image.vue'

const config = useRuntimeConfig()
const apiUrl = config.public.apiBaseUrl

const text = ref('')
const generatedTextResult = ref(null)
const analyzedTextResult = ref(null)
const generate_phi3 = ref(null)

const generatedImagePath = ref('')
const extractedLabelNumber = ref(0) // 数字を格納するref
const textStatistics = ref({ leng: 0, alphabet: {} })// 文字数とアルファベットの出現回数を格納するref
const rerankResult = ref(null)

const generateText = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/generate`, { text: text.value })
    console.log("Generate API Response:", response.data)
    generatedTextResult.value = response.data
  } catch (error) {
    console.error('Error generating text:', error)
  }
}
const generated_phi3 = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/generate-phi3`, { text: text.value })
    console.log("Generate Phi3_API Response:", response.data)
    generate_phi3.value = response.data
  } catch (error) {
    console.error('Error generating text:', error)
  }
}

const analyzeText = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/analyze`, { text: generatedTextResult.value.generated_text })
    console.log("Analyze API Response:", response.data)
    analyzedTextResult.value = response.data
    extractLabelNumber(response.data) // ラベルから数字を抽出
  } catch (error) {
    console.error('Error analyzing text:', error)
  }
}

const reranking = async () => {
  try {
    console.log('Generated Text:', generatedTextResult.value.generated_text);  // 追加
    const response = await axios.post(`${apiUrl}/api/rerank`, { text: generatedTextResult.value.generated_text })
    console.log("Rerank API Response:", response.data)
    rerankResult.value = response.data  // 結果をrerankResultに設定する
  } catch (error) {
    console.error('Error reranking text:', error.response ? error.response.data : error.message);  // 修正
  }
}



 const generateImage = async (promptText) => {
  try {
    const response = await axios.post(`${apiUrl}/api/generate-image`, { text: promptText })
    console.log("Generate Image API Response:", response.data)
    generatedImagePath.value = `${apiUrl}/${response.data.image_path}`
  } catch (err) {
    console.error('Error generating image:', err)
  }
} 
const extractLabelNumber = (result) => {
  const label = result[0].label;
  const numberMatch = label.match(/\d+/); // ラベルから数字を抽出

  if (numberMatch) {
    extractedLabelNumber.value = parseInt(numberMatch[0]);
  } else {
    extractedLabelNumber.value = 0; // 数字が見つからない場合のデフォルト値
  }
};

const updateTextAndAnalyze = async () => {
  generatedTextResult.value = null
  analyzedTextResult.value = null
  generatedImagePath.value = ''
  generate_phi3.value = null
  extractedLabelNumber.value = 0

  //entity.value = null

  await generateText()
  await generated_phi3()
  await analyzeText()
  updateTextStatistics(generatedTextResult.value.generated_text)
/*   if (generatedTextResult.value) {

    //await entityText()
    await generateImage(generatedTextResult.value.generated_text) 
  } */

 /*  setTimeout(() => {
    showLoading.value = true
  }, 2000) */
}

const updateTextStatistics = (generatedText) => {
  const combinedText = text.value + (generatedText || "")
  const alphabetCount = {}
  const words = combinedText.split(/\s+/).filter(Boolean)  // 単語に分割し、空の要素をフィルタリング

  words.forEach(word => {
    for (let char of word) {
      if (char.match(/[a-zA-Z]/)) {
        const lowerChar = char.toLowerCase()
        alphabetCount[lowerChar] = (alphabetCount[lowerChar] || 0) + 1
      }
    }
  })

  textStatistics.value = {
    wordCount: words.length,  // 単語数
    alphabet: alphabetCount
  }
  console.log("textStatistics", JSON.stringify(textStatistics.value, null, 2)) // データをJSON形式で表示
}

// extractedLabelNumberが変更されたときにThreeBackを更新する
watch(extractedLabelNumber, (newVal) => {
  console.log("extractedLabelNumber updated:", newVal)
  // ThreeBackの更新に必要な処理をここに追加
})
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
}

.left {
  flex: 1;
  width:30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.right {
  flex: 1;
  width:50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vertical-stack {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

textarea {
  width: 100%;
  height:100%;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  margin-bottom: 10px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.center p {
  margin: 0;
}

.empty {
  height:600px;
  width: 600px;
  border: 0px solid #ccc;
  margin-bottom: 10px;
}
</style>
