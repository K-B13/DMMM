import { Card } from '../src/classes/Card';
import { Deck, createDeck, discard, draw, grabFromDiscard, shuffle } from '../src/classes/Deck'

describe('Deck Object', () => {
    let deck : Deck;
    let mockArray: Card[]
    beforeEach(() => {
        mockArray = []
        for(let i = 0; i < 10; i++){
            const mockCard: Card = { character: 'Mimi LeChaise', name: `MockCard ${i}`, id: i }
            mockArray.push(mockCard)
        }

        const deckComponents = {
            cards: [...mockArray],
            discardPile: [],
            character: 'Mimi LeChaise'
        }

        deck = createDeck({...deckComponents})
    })

    it('Check deck setup correctly', () => {
        expect(deck.character).toBe('Mimi LeChaise')
        expect(deck.discardPile).toEqual([])
        expect(deck.cards).toHaveLength(10)
        expect(deck.cards).toEqual(mockArray)
    })

    it('Card array gets shuffled and same number of cards as well as same cards', () => {
        shuffle(deck)
        expect(deck.cards).toHaveLength(10)
        for (const card of mockArray) {
            expect(deck.cards).toContainEqual(card);
        }
    })

    it('Card array gets shuffled so cards are not in the same positions', () => {
        shuffle(deck)
        expect(deck.cards).not.toEqual(mockArray);
        const oneShuffle = [...deck.cards]
        shuffle(deck)
        expect(deck.cards).not.toEqual(oneShuffle);
    })

    it('tests that draw removes the card from the deck and does not change the order other than that', () => {
        const nextCard = deck.cards[0]
        const drawnCard = draw(deck)

        expect(deck.cards.includes(drawnCard as Card)).toBe(false)
        expect(deck.cards).not.toContain(nextCard)
        expect(deck.cards).toHaveLength(9)
        expect(drawnCard).toEqual(nextCard)
    })

    it('tests that multiple draws works correctly', () => {
        draw(deck)
        draw(deck)
        draw(deck)

        expect(deck.cards).toHaveLength(7)
        expect(deck.cards).toEqual(mockArray.slice(3))
    })

    it('tests that cards get discarded correctly', () => {
        const firstDrawnCard = draw(deck)
        draw(deck)
        draw(deck)

        discard(firstDrawnCard as Card, deck)
        expect(deck.cards).toHaveLength(7)
        expect(deck.discardPile).toEqual([firstDrawnCard])
        expect(deck.discardPile).toHaveLength(1)
    })

    it('tests that cards get discarded correctly when there are more than 1 card discarded', () => {
        const firstDrawnCard = draw(deck)
        const secondDrawnCard = draw(deck)
        draw(deck)
        draw(deck)
        draw(deck)

        discard(firstDrawnCard as Card, deck)
        discard(secondDrawnCard as Card, deck)
        expect(deck.cards).toHaveLength(5)
        expect(deck.discardPile).toEqual([firstDrawnCard, secondDrawnCard])
    })

    it('tests that grabbing the top card of the discard is possible', () => {
        const firstDrawnCard = draw(deck)
        const secondDrawnCard = draw(deck)
        const thirdDrawnCard = draw(deck)
        draw(deck)
        draw(deck)

        discard(firstDrawnCard as Card, deck)
        discard(secondDrawnCard as Card, deck)
        discard(thirdDrawnCard as Card, deck)
        expect(deck.cards.length).toBe(5)
        expect(deck.discardPile).toEqual([firstDrawnCard, secondDrawnCard, thirdDrawnCard])
        const topDiscardedCard = grabFromDiscard(thirdDrawnCard as Card, deck)
        expect(topDiscardedCard).toEqual(thirdDrawnCard)
        expect(deck.discardPile).toEqual([firstDrawnCard, secondDrawnCard])
    })

    it('tests that drawing when deck is blank and discard pile contains cards that discard is shuffled and creates new deck', () => {
        const firstDrawnCard = draw(deck)
        const secondDrawnCard = draw(deck)
        const thirdDrawnCard = draw(deck)
        for(let i = 0; i <= 7; i++) {
            draw(deck)
        }
        discard(firstDrawnCard as Card, deck)
        discard(secondDrawnCard as Card, deck)
        discard(thirdDrawnCard as Card, deck)
        const finalCard = draw(deck)
        expect(deck.cards).not.toContain(finalCard)
        expect(deck.cards).toHaveLength(2)
        expect(deck.discardPile).toEqual([])
    })

    it('tests grabbing card from discard when none is available.', () => {
        const firstDrawnCard = draw(deck)
        expect(grabFromDiscard(firstDrawnCard as Card, deck)).toBe(false)    
    })

    it('tests that drawing when deck is blank and discard pile is blank return false', () => {
        for(let i = 0; i <= 10; i++) {
            draw(deck)
        }
        const response = draw(deck)
        expect(deck.cards).toHaveLength(0)
        expect(deck.discardPile).toHaveLength(0)
        expect(response).toBe(false)
    })


})