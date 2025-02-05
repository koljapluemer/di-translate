import type { Card } from "ts-fsrs"

export type WordEntry = {
    de: string,
    en: string,
    card?: Card
}

export type FsrsItem = {
    card: Card,
    data: any
}