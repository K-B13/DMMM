import { Card } from "../classes/Card";
import { discard, draw, grabFromDiscard, grabTopCardFromDiscard } from "../classes/Deck";
import { ActiveShields, heal, Player, removeFromHand, takeDamage } from "../classes/Player";
import { writeValue } from "./firebaseActions";
import { allGameplayPlayers, gameplayPlayerHitpoints, gameplayPlayerPath } from "./firebasePaths";

export const specialMoves: Record<string, any> = {
    "Clever Disguise": async (currentPlayer: Player, card: Card) => {
        currentPlayer.targetable = false
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    },
    "Sneak Attack": async (currentPlayer: Player, targetPlayer: Player, position: number, card: Card) => {
        currentPlayer.moves += 1
        const targetedShield = targetPlayer.activeShields[position]
        discard(targetedShield.card, targetPlayer.deck)
        targetPlayer.activeShields.splice(position, 1)
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    },
    // "Pick Pocket": async (currentPlayer: Player, targetPlayer: Player) => {
    //     const drawnCard = draw(targetPlayer.deck)
    //     if (!drawnCard) return
    //     // This may need to be looked at
    //     play(currentPlayer, drawnCard)
    //     await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    //     await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    // },
    "Charm": async (currentPlayer: Player, targetPlayer: Player, position: number, card: Card) => {
        const targetPlayerShields = [...targetPlayer.activeShields]
        const selectedShield = targetPlayerShields.splice(position, 1)[0]
        selectedShield.hp = selectedShield.card.shield as number
        currentPlayer.activeShields = [...currentPlayer.activeShields, selectedShield]
        targetPlayer.activeShields = [...targetPlayerShields]
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    },
    "Vamperic Touch": async (currentPlayer: Player, player: Player, card: Card) => {
        const currentPlayerHp = currentPlayer.hitpoints
        const targetPlayerHp = player.hitpoints
        currentPlayer.hitpoints = targetPlayerHp
        player.hitpoints = currentPlayerHp
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerHitpoints(currentPlayer.uid), currentPlayer.hitpoints)
        await writeValue(gameplayPlayerHitpoints(player.uid), player.hitpoints)
    },
    "Banishing Smite": async (players: Player[], currentPlayer: Player, card: Card) => {
        currentPlayer.moves += 1
        const newPlayerState = players.map(p => {
            if (!p.active) return p
            const playersShields = [...p.activeShields.map(s => s.card)]
            p.activeShields = []
            p.deck.discardPile = [ ...p.deck.discardPile, ...playersShields ]
        })
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(allGameplayPlayers(), newPlayerState)
    },
    "Divine Inspiration": async (currentPlayer: Player, chosenCard: Card, position: number, card: Card) => {
        grabFromDiscard(chosenCard, currentPlayer.deck, position)
        currentPlayer.hand.push(chosenCard)
        heal(currentPlayer, 2)
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    },
    "Battle Roar": async (players: Player[], currentPlayer: Player, card: Card) => {
        currentPlayer.moves += 1
        const newPlayerState = players.map(p => {
            if (!p.active) return p
            const hand = [...p.hand]
            p = { ...p, hand: [], deck: { ...p.deck, discardPile: [...p.deck.discardPile, ...hand]}}
            for(let i = 1; i <= 3; i ++) {
                const cardDrawn = draw(p.deck)
                if (cardDrawn) p.hand.push(cardDrawn)
            }
        })
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(allGameplayPlayers(), newPlayerState)
    },
    "Mighty Toss": async (currentPlayer: Player, targetPlayer: Player, position: number, card: Card) => {
        const targetedShield = targetPlayer.activeShields[position]
        discard(targetedShield.card, targetPlayer.deck)
        targetPlayer.activeShields.splice(position, 1)
        const cardDrawn = draw(currentPlayer.deck)
        if (cardDrawn) currentPlayer.hand.push(cardDrawn)
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    },
    "Tell me about your Mother": async (currentPlayer: Player, players: Player[], card: Card) => {
        const newHand = [...currentPlayer.hand]
        const updatedPlayers = players.map(p => {
            if (p.uid === currentPlayer.uid || !p.active) return p
            const chosenCard = grabTopCardFromDiscard(p.deck)
            if (!chosenCard) return p
            newHand.push(chosenCard[0])

            return p
        })
        const finalPlayers = updatedPlayers.map(p => {
            return p.uid === currentPlayer.uid ? { ...p, hand: newHand } : p
        })
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(allGameplayPlayers(), finalPlayers)
    },
    "Mind Games": async (currentPlayer: Player, targetPlayer: Player, card: Card) => {
        const currentPlayerHand = [...currentPlayer.hand]
        const targetedPlayerHand = [...targetPlayer.hand]
        currentPlayer.hand = targetedPlayerHand
        targetPlayer.hand = currentPlayerHand
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    },
    "Owl Bear Boogie": async (currentPlayer: Player, players: Player[], card: Card) => {
        const currentPlayerDraws: Card[] = []
        const updatedPlayers = players.map(p => {
            if (!p.active) return p
            if (p.uid === currentPlayer.uid) return p
            const drawnCard = draw(p.deck)
            if (!drawnCard) return p
            const updatedOpponent = {
                ...p,
                hand: [...p.hand, drawnCard]
            }

            const bonusDraw = draw(currentPlayer.deck)
            if (bonusDraw) {
                currentPlayerDraws.push(bonusDraw)
            }

            return updatedOpponent
        })

        const finalPlayers = updatedPlayers.map(p => {
            return p.uid === currentPlayer.uid ?
            { ...p, hand: [...p.hand, ...currentPlayerDraws] } : p
        })
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(allGameplayPlayers(), finalPlayers)
    },
    "For my Next Trick": async (currentPlayer: Player, card: Card) => {
        currentPlayer.hitAll = true
        currentPlayer.moves -= 1
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    },
    "Charm Ray": async (currentPlayer: Player, targetPlayer: Player, card: Card) => {
        targetPlayer.onlyTarget = true
        currentPlayer.moves -= 1
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    },
    "Death Ray": async (currentPlayer: Player, players: Player[], card: Card) => {
        const updatedPlayers = [...players].map(p => {
            if (p.activeShields.length > 0) {
                const destroyedShields = [...p.activeShields]
                destroyedShields.forEach(shield => {
                    discard(shield.card, p.deck)
                })
                p.activeShields = []
                return p
            }
            takeDamage(2, p)
            return p
        })
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(allGameplayPlayers(), updatedPlayers)
    },
    "It's Not a Trap": async (currentPlayer: Player, targetPlayerHpChanging: Player, targetPlayerHpUnchanging: Player, card: Card) => {
        targetPlayerHpChanging.hitpoints = targetPlayerHpUnchanging.hitpoints
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayerHpChanging.uid), targetPlayerHpChanging)
    },
    "Definitely Just a Mirror": async (currentPlayer: Player, targetPlayer: Player, position: number, card: Card) => {
        const shield = targetPlayer.activeShields[position]
        shield.hp = shield.card.shield as number
        currentPlayer.activeShields = [...currentPlayer.activeShields, shield]
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    },
    "Hugs": async (currentPlayer: Player, targetPlayer: Player, position: number, card: Card) => {
        const shield = targetPlayer.activeShields[position]
        heal(currentPlayer, shield.card.shield as number)
        const targetPlayerShields = [...targetPlayer.activeShields]
        targetPlayerShields.splice(position, 1)
        targetPlayer.activeShields = [...targetPlayerShields]
        discard(card, currentPlayer.deck)
        removeFromHand(card, currentPlayer)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    }
}