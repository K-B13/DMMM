import { Card } from '../src/classes/Card';
import { createDeck, Deck } from '../src/classes/Deck';
import { createPlayer, emptyHand, play, Player, removeFromHand, shieldDamage, startingHand, startTurn, takeDamage } from '../src/classes/Player';

describe('Player Object', () => {
    let deck : Deck;
    let mockArray: Card[]
    let player: Player
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
            player = createPlayer({
                name: 'Player One',
                deck: deck,
                uid: 'It41jd13mk' 
            })
        })

    it('Player created successfully.', () => {
        expect(player.name).toBe('Player One')
        expect(player.deck).toEqual(deck)
        expect(player.moves).toBe(0)
        expect(player.host).toBe(false)
        expect(player.hitpoints).toBe(10)
        expect(player.activeShields).toEqual([])
        expect(player.hand).toEqual([])
        expect(player.active).toBe(true)
    })

    it('Starting Hand 3 cards are drawn successfully.', () => {
        startingHand({ player: player })
        expect(player.hand).toHaveLength(3)
        expect(player.deck.cards).toHaveLength(7)
    })

    it('start turn sets the moves and draws a card', () => {
        startTurn(player)
        expect(player.moves).toBe(1)
        expect(player.hand).toHaveLength(1)
    })

    it('shield damage with hp still having leftover', () => {
        for (let i = 1; i <= 3; i++) {
            const shieldCard = mockArray[i]
            shieldCard.shield = i
            const newShield = {
                card: { ...shieldCard },
                hp: i
            }
            player.activeShields.push(newShield)
        }
        shieldDamage(2, 2, player)

        expect(player.activeShields).toHaveLength(3)
        expect(player.activeShields[0].hp).toBe(1)
        expect(player.activeShields[1].hp).toBe(2)
        expect(player.activeShields[2].hp).toBe(1)
        
    })

    it('shield damage with hp not having leftover', () => {
        for (let i = 1; i <= 3; i++) {
            const shieldCard = mockArray[i]
            shieldCard.shield = i
            const newShield = {
                card: { ...shieldCard },
                hp: i
            }
            player.activeShields.push(newShield)
        }
        shieldDamage(2, 3, player)

        expect(player.activeShields).toHaveLength(2)
        expect(player.activeShields[0].hp).toBe(1)
        expect(player.activeShields[1].hp).toBe(2)
    })

    it('take damage where player survives', () => {
        takeDamage(3, player)

        expect(player.active).toBe(true)
        expect(player.hitpoints).toBe(7)
    })
    
    it('take damage where player dies', () => {
        takeDamage(10, player)

        expect(player.active).toBe(false)
        expect(player.hitpoints).toBe(0)
    })

    it('draws 2 when hand empty', () => {
        emptyHand(player)
        expect(player.hand).toHaveLength(2)
        expect(player.deck.cards).toHaveLength(8)
    })

    it('Remove from hand for a non shield card', () => {
        startingHand({ player })
        const playedCard = player.hand[0]
        removeFromHand(playedCard, player)

        expect(player.deck.discardPile).toHaveLength(1)
        expect(player.deck.discardPile).toEqual([playedCard])
        expect(player.hand).toHaveLength(2)
        expect(player.hand).not.toContain(playedCard)
    })

    it('Remove from hand for a shield card', () => {
        startingHand({ player })
        player.hand[0].shield = 1
        const playedCard = player.hand[0]
        removeFromHand(playedCard, player)

        expect(player.deck.discardPile).toHaveLength(0)
        expect(player.deck.discardPile).toEqual([])
        expect(player.hand).toHaveLength(2)
        expect(player.hand).not.toContain(playedCard)
    })

    it('Remove from hand resulting in an empty hand', () => {
        startingHand({ player })
        const firstPlayedCard = player.hand[0]
        const secondPlayerCard = player.hand[1]
        const thirdPlayerCard = player.hand[2]
        removeFromHand(firstPlayedCard, player)
        removeFromHand(secondPlayerCard, player)
        removeFromHand(thirdPlayerCard, player)

        expect(player.hand).toHaveLength(2)
        expect(player.hand).not.toContain(firstPlayedCard)
        expect(player.hand).not.toContain(secondPlayerCard)
        expect(player.hand).not.toContain(thirdPlayerCard)
        expect(player.deck.cards).toHaveLength(5)

    })

    describe('Play Function for the Player Object', () => {
        describe('testing heal functionality', () => {
            it('play a card with heal when max hp', () => {
                startingHand({ player })
                player.moves = 1
                const firstCard = player.hand[0]
                firstCard.heal = 1
                play(player, firstCard)
                expect(player.hand).toHaveLength(2)
                expect(player.hitpoints).toBe(10)
                expect(player.deck.discardPile).toHaveLength(1)
                expect(player.deck.discardPile).toEqual([firstCard])
                expect(player.moves).toBe(0)
            })
    
            it('play a card with heal when below max but will go over with heal', () => {
                startingHand({ player })
                const firstCard = player.hand[0]
                firstCard.heal = 2
                player.hitpoints = 9
                play(player, firstCard)
                expect(player.hand).toHaveLength(2)
                expect(player.hitpoints).toBe(10)
                expect(player.deck.discardPile).toHaveLength(1)
                expect(player.deck.discardPile).toEqual([firstCard])
            })
    
            it('play a card with heal when below max and will not go over with heal', () => {
                startingHand({ player })
                const firstCard = player.hand[0]
                firstCard.heal = 2
                player.hitpoints = 6
                play(player, firstCard)
                expect(player.hand).toHaveLength(2)
                expect(player.hitpoints).toBe(8)
                expect(player.deck.discardPile).toHaveLength(1)
                expect(player.deck.discardPile).toEqual([firstCard])
            })
        })

        describe('testing draw functionality', () => {
            it('play a draw card with 2 draws', () => {
                startingHand({ player })
                player.moves = 1
                const firstCard = player.hand[0]
                firstCard.draw = 2
                play(player, firstCard)
                expect(player.hand).toHaveLength(4)
                expect(player.deck.cards).toHaveLength(5)
                expect(player.deck.discardPile).toHaveLength(1)
                expect(player.deck.discardPile).toEqual([firstCard])
                expect(player.moves).toBe(0)
            })

            it('play a draw card with 3 draws', () => {
                startingHand({ player })
                const firstCard = player.hand[0]
                firstCard.draw = 3
                play(player, firstCard)
                expect(player.hand).toHaveLength(5)
                expect(player.deck.cards).toHaveLength(4)
                expect(player.deck.discardPile).toHaveLength(1)
                expect(player.deck.discardPile).toEqual([firstCard])
            })
        })

        describe('testing extra moves functionality', () => {
            it('play an extra move card with 2 extra moves', () => {
                startingHand({ player })
                player.moves = 1
                const firstCard = player.hand[0]
                firstCard.extra = 2
                play(player, firstCard)
                expect(player.hand).toHaveLength(2)
                expect(player.deck.cards).toHaveLength(7)
                expect(player.deck.discardPile).toHaveLength(1)
                expect(player.deck.discardPile).toEqual([firstCard])
                expect(player.moves).toBe(2)
            })
        })

        describe('testing shield functionality', () => {
            it('play a shield card', () => {
                startingHand({ player })
                player.moves = 1
                const firstCard = player.hand[0]
                firstCard.shield = 2
                firstCard.draw = 1
                play(player, firstCard)
                expect(player.hand).toHaveLength(3)
                expect(player.deck.cards).toHaveLength(6)
                expect(player.deck.discardPile).toHaveLength(0)
                expect(player.deck.discardPile).toEqual([])
                expect(player.moves).toBe(0)
                expect(player.activeShields).toEqual([
                    { card: { ...firstCard }, hp: 2 }
                ])
            })

            it('play multiple shield cards', () => {
                startingHand({ player })
                const firstCard = player.hand[0]
                const secondCard = player.hand[1]
                firstCard.shield = 2
                firstCard.draw = 1
                secondCard.shield = 3
                secondCard.heal = 1
                play(player, firstCard)
                play(player, secondCard)
                expect(player.hand).toHaveLength(2)
                expect(player.deck.cards).toHaveLength(6)
                expect(player.deck.discardPile).toHaveLength(0)
                expect(player.deck.discardPile).toEqual([])
                console.debug(player.activeShields)
                expect(player.activeShields).toEqual([
                    { card: { ...firstCard }, hp: 2 },
                    { card: { ...secondCard }, hp: 3 },
                ])
            })
        })

        describe('testing attack functionality', () => {
            it('play an attack card with 3 strength', () => {
                startingHand({ player })
                player.moves = 1
                const firstCard = player.hand[0]
                firstCard.attack = 2
                firstCard.draw = 1
                const response = play(player, firstCard)
                expect(player.hand).toHaveLength(3)
                expect(player.deck.cards).toHaveLength(6)
                expect(player.deck.discardPile).toHaveLength(1)
                expect(player.deck.discardPile).toEqual([firstCard])
                expect(player.moves).toBe(0)
                expect(response).toBe(2)
            })
        })
    })
})