<template>
    <div class="flex gap-1 flex-col" v-if="savedWords">
        <div class="card card-sm shadow-lg" v-for="word in savedWords">
            <div class="card-body text-lg">
                <em>{{ word.de }}</em> {{ word.en }}
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const savedWords = ref([])
savedWords.value = JSON.parse(localStorage.getItem("savedWords") || "[]")

</script>