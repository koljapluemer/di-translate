<template>
    <div class="p-4 space-y-6">
        <h1 class="text-3xl font-bold mb-6">OCR & Translation Flow</h1>

        <!-- Step 1: Upload or Capture Photo -->
        <div class="card bg-base-100 shadow-xl p-4" v-if="step === 1">
            <h2 class="text-xl font-semibold mb-2">Step 1: Upload or Take a Photo</h2>
            <input type="file" accept="image/*"
                class="file-input file-input-bordered file-input-primary w-full max-w-xs mb-2"
                @change="handleFileChange" />
            <p v-if="selectedFileName" class="text-sm mb-2">{{ selectedFileName }}</p>
            <button class="btn btn-primary" :disabled="!imageFile" @click="goToStep2">
                Next
            </button>
        </div>

        <!-- Step 2: Perform OCR -->
        <div class="card bg-base-100 shadow-xl p-4" v-else-if="step === 2">
            <h2 class="text-xl font-semibold mb-2">Step 2: Extracting Text...</h2>
            <p v-if="ocrInProgress" class="text-sm text-gray-500">Running OCR, please wait...</p>
            <p v-else-if="ocrResult" class="mt-2 whitespace-pre-line">{{ ocrResult }}</p>
            <button class="btn mt-4" @click="step = 1">
                Go Back
            </button>
            <button class="btn btn-primary mt-2" :disabled="!ocrResult" @click="goToStep3">
                Next
            </button>
        </div>

        <!-- Step 3: Select Words to Keep -->
        <div class="card bg-base-100 shadow-xl p-4" v-else-if="step === 3">
            <h2 class="text-xl font-semibold mb-2">Step 3: Select Words to Practice</h2>
            <div class="flex flex-wrap gap-2">
                <span v-for="(word, index) in splittedWords" :key="index"
                    class="p-3 text-lg badge badge-outline cursor-pointer"
                    :class="selectedWords.includes(word) ? 'badge-primary' : 'badge-outline'" @click="toggleWord(word)">
                    {{ word }}
                </span>
            </div>
            <button class="btn btn-primary mt-4" :disabled="selectedWords.length === 0" @click="goToStep4">
                Next
            </button>
        </div>

        <!-- Step 4: Translate & Save -->
        <div class="card bg-base-100 shadow-xl p-4" v-else-if="step === 4">
            <h2 class="text-xl font-semibold mb-2">Step 4: Translations</h2>
            <p v-if="translationInProgress" class="text-sm text-gray-500">Translating with ChatGPT, please wait...</p>
            <ul v-else class="list-disc list-inside">
                <li v-for="entry in finalWordList" :key="entry.de" class="mt-1">
                    <strong>{{ entry.de }}</strong> - {{ entry.en }}
                </li>
                <router-link to="learn" class="btn btn-primary mt-4"> Finish &amp; Go to Practice</router-link>
            </ul>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'
import Tesseract from 'tesseract.js'
import type { WordEntry } from '../types'

// --------------------
// Step management
// --------------------
const step = ref<number>(1)

// --------------------
// Step 1: Upload
// --------------------
const imageFile = ref<File | null>(null)
const selectedFileName = ref<string>('')

function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        imageFile.value = target.files[0]
        selectedFileName.value = target.files[0].name
    }
}

function goToStep2() {
    if (!imageFile.value) return
    step.value = 2
    performOcr()
}

// --------------------
// Step 2: Perform OCR
// --------------------
const ocrResult = ref<string>('')
const ocrInProgress = ref<boolean>(false)

async function performOcr() {
    if (!imageFile.value) return
    ocrInProgress.value = true

    try {
        // Convert file to a blob URL so Tesseract can process it
        const imageUrl = URL.createObjectURL(imageFile.value)

        const { data } = await Tesseract.recognize(imageUrl, 'deu')  // 'deu' for German
        ocrResult.value = data.text
    } catch (error) {
        console.error('OCR Error:', error)
        ocrResult.value = ''
    } finally {
        ocrInProgress.value = false
    }
}

function goToStep3() {
    if (!ocrResult.value) return
    step.value = 3
}

// --------------------
// Step 3: Select words
// --------------------
const splittedWords = computed(() => {
    // Simple splitting by whitespace + removing punctuation
    return ocrResult.value
        .split(/\s+/)
        .map((w) => w.replace(/[^\p{L}\p{M}]+/gu, ''))
        .filter((w) => w.length > 0)
})

const selectedWords = ref<string[]>([])

function toggleWord(word: string) {
    if (selectedWords.value.includes(word)) {
        selectedWords.value = selectedWords.value.filter((w) => w !== word)
    } else {
        selectedWords.value.push(word)
    }
}

// --------------------
// Step 4: Translate
// --------------------
const finalWordList = ref<WordEntry[]>([])
const translationInProgress = ref<boolean>(false)

function goToStep4() {
    if (selectedWords.value.length === 0) return
    step.value = 4
    translateAndStore()
}

async function translateAndStore() {
    translationInProgress.value = true

    try {
        // 1) Request translations for the selected words
        const translations = await requestChatGptTranslation(selectedWords.value)

        // 2) Prepare the new WordEntry objects
        finalWordList.value = selectedWords.value.map((word, idx) => ({
            de: word,
            en: translations[idx] || '',
        }))

        // 3) Load existing words from localStorage
        const existingStr = localStorage.getItem('savedWords')
        let existing: WordEntry[] = []
        if (existingStr) {
            try {
                existing = JSON.parse(existingStr)
            } catch (err) {
                console.error('Could not parse existing savedWords:', err)
            }
        }

        // 4) Merge old + new
        //    Optionally remove duplicates by original text or ID if desired.
        const merged = [...existing, ...finalWordList.value]

        // 5) Store the updated array
        localStorage.setItem('savedWords', JSON.stringify(merged))
    } catch (err) {
        console.error(err)
    } finally {
        translationInProgress.value = false
    }
}


// --------------------
// ChatGPT Integration
// --------------------
async function requestChatGptTranslation(words: string[]): Promise<string[]> {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

    // 1) Construct a prompt to translate from German to English
    const prompt = `
    Please translate the following German words to English as a JSON array (only translations, same order):
    ${words.join(', ')}
  `

    // 2) Call the GPT-3.5-Turbo endpoint
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that translates German to English.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            // Lower temperature means more deterministic translations
            temperature: 0.2
        })
    })

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    let rawAnswer = data?.choices?.[0]?.message?.content?.trim() || '[]'

    // Attempt to parse the assistant’s reply as an array
    let translations: string[] = []
    try {
        translations = JSON.parse(rawAnswer)
        if (!Array.isArray(translations)) {
            translations = []
        }
    } catch (error) {
        console.warn('Could not parse GPT response as JSON array.', error)
    }

    // In case the reply is just a single string instead of an array
    if (typeof translations === 'string') {
        translations = [translations]
    }

    return translations
}

</script>

<style scoped>
.word-item {
    display: inline-block;
    margin: 4px;
    padding: 4px 8px;
    border: 1px solid #ccc;
    cursor: pointer;
}

.word-item.selected {
    border-color: green;
    background-color: #d2f8d2;
}
</style>