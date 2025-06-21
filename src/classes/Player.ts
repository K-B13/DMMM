import { Card } from "./Card";
import { Deck, discard, draw, shuffle } from "./Deck";

export interface ActiveShields {
    card: Card;
    hp: number
}

export interface Player {
    name: string;
    moves: number;
    host: boolean;
    hitpoints: number;
    activeShields: ActiveShields[];
    deck: Deck;
    hand: Card[];
    active: boolean;
}

export type PlayerCreationType = ({ name, host, deck }: { name: string, host?: boolean, deck: Deck }) => Player

export const createPlayer: PlayerCreationType = ({ name, host, deck }) => {

    const newPlayer = {
        name: name,
        moves: 0,
        host: !!host,
        hitpoints: 10,
        activeShields: [],
        deck: deck,
        hand: [],
        active: true,
    }

    return newPlayer
}

export const startingHand = ({ player }: { player: Player }) => {
    shuffle(player.deck)
    for(let i = 0; i < 3; i++) {
        const drawnCard = draw(player.deck)
        if (drawnCard) {
            player.hand.push(drawnCard)
        }
    }
}

export const startTurn = (player: Player) => {
    player.moves = 1
    const newCard = draw(player.deck)
    if(newCard) {
        player.hand.push(newCard)
    }
}

export const shieldDamage = (indexOfShield: number, damage: number, player: Player) => {
    const targetedShield = player.activeShields[indexOfShield]
        targetedShield.hp -= damage
        if (targetedShield.hp === 0) {
            player.activeShields.splice(indexOfShield, 1)
            discard(targetedShield.card, player.deck)
        }
}

export const takeDamage = (damage: number, player: Player) => {
    player.hitpoints -= damage
    if (player.hitpoints <= 0) {
        player.active = false
        player.hand = []
        player.deck.discardPile = []
        player.deck.cards = []
    }
}

export const emptyHand = (player: Player) => {
    for (let i = 1; i <= 2; i++) {
        const newCard = draw(player.deck)
        if(newCard) {
            player.hand.push(newCard)
        }
    }
}

export const removeFromHand = (card: Card, player: Player) => {
    const newHand = player.hand.filter(currentCard => {
        return currentCard !== card
    })
    player.hand = [...newHand]

    if (!card.shield) discard(card, player.deck)

    if (player.hand.length === 0) {
        emptyHand(player)
    }
}

export const play = (player: Player, card: Card) => {
    if (!player.active) {
        player.moves--
        return
    }

    if (card.heal) {
        player.hitpoints = Math.min(player.hitpoints + card.heal, 10)
    }

    if (card.draw) {
        for (let i = 1; i <= card.draw; i++) {
            const newCard = draw(player.deck)
            if (newCard) {
                player.hand.push(newCard)
            }
        }
    }

    if (card.extra) {
        player.moves += card.extra
    }

    if (card.shield) {
        player.activeShields.push({
            card: card,
            hp: card.shield
        })
    }

    removeFromHand(card, player)

    if (card.attack) {
        player.moves--
        return card.attack
    }

    player.moves--
}

