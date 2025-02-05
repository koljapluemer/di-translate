// // doesn't do much except handling the user clicking on 'wrong', 'right' and so on
// // the complexity arises from the fact that we're also tracking learning for tenses, negations, forms, tense+form, etc.

// import { loadCardsFromLocalStorage, loadListFromLocalStorage, saveCardsToLocalStorage, saveListToLocalStorage } from "@/utils/localStoreUtils";
// import { createEmptyCard, FSRS, generatorParameters, Rating, type Card, type FSRSParameters, type IPreview } from "ts-fsrs";
// import { ref } from "vue";

// const cards = ref(loadCardsFromLocalStorage())

// // currently unused
// export function storeExerciseFeedback(exercise: Item, feedback: Rating) {
//     const timestamp = Date.now()
//     const scoringData = loadListFromLocalStorage("scores")

//     scoringData.push(
//         {
//             exercise: exercise,
//             timestamp: timestamp,
//             feedback: feedback
//         }
//     )

//     saveListToLocalStorage('scores', scoringData)
// }


// export function scoreExercise(item: Item, feedback: Rating) {
//     const negationString = item.isNegated ? 'negated' : 'not negated'
//     const formString = item.form.replace("!", "")

//     const learningCardsToLog: [ItemType, string, Record<string, any>][] = [
//         [ItemType.Item, item.english + " " + item.transliteration, { item: item }],
//         [ItemType.Word, item.word, { word: item.word }],
//         [ItemType.Form, item.form, { form: formString }],
//         [ItemType.Tense, item.tense, { tense: item.tense }],
//         [ItemType.Negation, negationString, { isNegated: item.isNegated }],

//         [ItemType.WordTense, `${item.word} + ${item.tense}`, { word: item.word, tense: item.tense }],
//         [ItemType.WordNegation, `${item.word} + ${negationString}`, { word: item.word, isNegated: item.isNegated }],
//         [ItemType.WordForm, `${item.word} + ${item.form}`, { word: item.word, form: formString }],
//         [ItemType.WordFormTense, `${item.word} + ${item.form} + ${item.tense}`, { word: item.word, form: formString, tense: item.tense }],
//         [ItemType.WordFormNegation, `${item.word} + ${item.form} + ${negationString}`, { word: item.word, form: formString, isNegated: item.isNegated }],
//         [ItemType.WordTenseNegation, `${item.word} + ${item.tense} + ${negationString}`, { word: item.word, tense: item.tense, isNegated: item.isNegated }],

//         [ItemType.TenseForm, `${item.tense} + ${item.form}`, { tense: item.tense, form: formString }],
//         [ItemType.TenseNegation, `${item.tense} + ${negationString}`, { tense: item.tense, isNegated: item.isNegated }],
//         [ItemType.TenseFormNegation, `${item.tense} + ${item.form} + ${negationString}`, { tense: item.tense, form: formString, isNegated: item.isNegated }],

//         [ItemType.FormNegation, `${item.form} + ${negationString}`, { form: formString, isNegated: item.isNegated }]
//     ]

//     learningCardsToLog.forEach(learningCardToBe => {
//         cards.value[learningCardToBe[1]] = {
//             type: learningCardToBe[0],
//             card: getFsrsRatedCard(cards.value[learningCardToBe[1]]?.card, feedback),
//             data: learningCardToBe[2]
//         }
//     })

//     saveCardsToLocalStorage(cards.value)
// }

// function getFsrsRatedCard(cardIn: Card | undefined, feedback: number): Card {
//     let card: Card
//     if (!cardIn) {
//         card = createEmptyCard()
//     } else {
//         card = cardIn
//     }

//     const params: FSRSParameters = generatorParameters({ maximum_interval: 1000 });
//     const f = new FSRS(params)
//     const schedulingOptions = f.repeat(card, new Date())

//     switch (feedback) {
//         case 1:
//             return schedulingOptions[Rating.Hard].card
//         case 0:
//             return schedulingOptions[Rating.Again].card
//         case 3:
//             return schedulingOptions[Rating.Easy].card
//         case 2:
//             return schedulingOptions[Rating.Good].card
//         default:
//             console.error('FSRS rating unknown, this should not happen')
//             return schedulingOptions[Rating.Good].card
//     }

// }
