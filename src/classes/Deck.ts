import { Card } from "./Card";

export interface Deck {
    cards: Card[];
    discardPile: Card[];
    character: string;
}

export type DeckCreationType = ({ cards, character }: { cards: Card[], character: string }) => Deck

export const createDeck: DeckCreationType = ({ cards, character }) => {
    const newDeck = {
        cards: cards,
        discardPile: [],
        character: character
    }

    return newDeck
}

export const shuffle = (deck: Deck) => {
    for (let i = deck.cards.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]]; 
    } 
}

export const draw = (deck: Deck) => {
    if(deck.cards.length > 0) {
        return deck.cards.shift()
    }

    if(deck.discardPile.length > 0) {
        deck.cards = [...deck.discardPile]
        deck.discardPile = []
        shuffle(deck)
        return deck.cards.shift()
    }

    return false
}

export const discard = (card: Card, deck: Deck) => {
    deck.discardPile.push(card)
}

export const grabFromDiscard = (card: Card, deck: Deck, position: number) => {
    if(deck.discardPile.length > 0) {
        deck.discardPile.splice(position, 1)
        // deck.discardPile = deck.discardPile.filter(c => {
        //     return c !== card
        // })
        return card
    }
    return false
}

export const grabTopCardFromDiscard = (deck: Deck) => {
    if(deck.discardPile.length > 0) {
        const chosenCard = deck.discardPile.splice(deck.discardPile.length - 1, 1)
        return chosenCard
    }
    return false
}