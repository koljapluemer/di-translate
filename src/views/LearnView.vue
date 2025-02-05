<template>
  <div class="" v-if="currentExercise">

    <div class="card-body text-3xl text-center">
      {{ currentExercise.de }}
    </div>
    <div class="card" v-if="isRevealed">
      <div class="card-body text-2xl text-center">
        {{ currentExercise.en }}
      </div>


    </div>
  </div>

  <button class="btn" @click="isRevealed = !isRevealed" v-if="!isRevealed">
    Reveal
  </button>
  <div class="flex flex-row gap-2 m-auto">
    <button class="btn" @click="score(0)" v-if="isRevealed">
      Wrong
    </button>
    <button class="btn" @click="score(1)" v-if="isRevealed">
      Hard
    </button>
    <button class="btn" @click="score(2)" v-if="isRevealed">
      Correct
    </button>
    <button class="btn" @click="score(3)" v-if="isRevealed">
      Easy
    </button>
  </div>
</template>


<script setup lang="ts">


import { ref } from 'vue';

import type { Rating } from 'ts-fsrs';
import { getRandomExercise } from '@/composables/exercisePicker';
// import { scoreExercise } from '@/composables/exerciseSaver';
import type { WordEntry } from '@/types';

const isRevealed = ref(false);
const currentExercise = ref(undefined as WordEntry | undefined)


const getNext = () => {
  currentExercise.value = getRandomExercise()
  isRevealed.value = false;
}

const score = (feedback: Rating) => {
  if (currentExercise.value !== undefined) {
    // scoreExercise(currentExercise.value, feedback)
  }
  getNext()
}

getNext();



</script>