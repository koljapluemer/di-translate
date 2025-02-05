// responsible for getting the next exercise
// at the time of writing, mostly simple random picking

import type { WordEntry } from "@/types";

import { filterDictByKeySubstring, getRandomKeyValue, pickRandom } from "@/utils/arrayUtils";
import { ref } from "vue";


const lastPickedItem = ref(undefined as WordEntry | undefined)

export function getRandomExercise(): WordEntry | undefined {
    // exercises are saved in localstorage savedWords, as a list of WordEntry
    // LOAD FROM LOCALSTORAGE:!!!!!!!!!!!!!
    const savedWords: WordEntry[] = JSON.parse(localStorage.getItem("savedWords") || "[]")
    // if there are saved words, pick one of them
    return pickRandom(savedWords)

}
