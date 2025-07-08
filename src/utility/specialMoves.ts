import { Card } from "../classes/Card";
import { discard, draw, grabFromDiscard, grabTopCardFromDiscard } from "../classes/Deck";
import { heal, play, Player } from "../classes/Player";
import { writeValue } from "./firebaseActions";
import { allGameplayPlayers, gameplayPlayerHitpoints, gameplayPlayerPath } from "./firebasePaths";

export const specialMoves = {
    "Sneak Attack": async (currentPlayer: Player, targetPlayer: Player, position: number) => {
        currentPlayer.moves += 1
        const targetedShield = targetPlayer.activeShields[position]
        discard(targetedShield.card, targetPlayer.deck)
        targetPlayer.activeShields.splice(position, 1)
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
    "Vamperic Touch": async (currentPlayer: Player, player: Player) => {
        const currentPlayerHp = currentPlayer.hitpoints
        const targetPlayerHp = player.hitpoints
        currentPlayer.hitpoints = targetPlayerHp
        player.hitpoints = currentPlayerHp
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerHitpoints(currentPlayer.uid), currentPlayer.hitpoints)
        await writeValue(gameplayPlayerHitpoints(player.uid), player.hitpoints)
    },
    "Banishing Smite": async (players: Player[], currentPlayer: Player) => {
        currentPlayer.moves += 1
        const newPlayerState = players.map(p => {
            if (!p.active) return p
            const playersShields = [...p.activeShields.map(s => s.card)]
            p.activeShields = []
            p.deck.discardPile = [ ...p.deck.discardPile, ...playersShields ]
        })
        currentPlayer.moves -= 1
        await writeValue(allGameplayPlayers(), newPlayerState)
    },
    "Divine Inspiration": async (currentPlayer: Player, card: Card, position: number) => {
        grabFromDiscard(card, currentPlayer.deck, position)
        currentPlayer.hand.push(card)
        heal(currentPlayer, 2)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    },
    "Battle Roar": async (players: Player[], currentPlayer: Player) => {
        currentPlayer.moves += 1
        const newPlayerState = players.map(p => {
            if (!p.active) return p
            const hand = [...p.hand]
            p.hand = []
            p.deck.discardPile.push(...hand)
            for(let i = 1; i <= 3; i ++) {
                const cardDrawn = draw(p.deck)
                if (cardDrawn) p.hand.push(cardDrawn)
            }
        })
        currentPlayer.moves -= 1
        await writeValue(allGameplayPlayers(), newPlayerState)
    },
    "Mighty Toss": async (currentPlayer: Player, targetPlayer: Player, position: number) => {
        const targetedShield = targetPlayer.activeShields[position]
        discard(targetedShield.card, targetPlayer.deck)
        targetPlayer.activeShields.splice(position, 1)
        const cardDrawn = draw(currentPlayer.deck)
        if (cardDrawn) currentPlayer.hand.push(cardDrawn)
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    },
    "Tell me about your Mother": async (currentPlayer: Player, players: Player[]) => {
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
        currentPlayer.moves -= 1
        await writeValue(allGameplayPlayers(), finalPlayers)
    },
    "Mind Games": async (currentPlayer: Player, targetPlayer: Player) => {
        const currentPlayerHand = [...currentPlayer.hand]
        const targetedPlayerHand = [...targetPlayer.hand]
        currentPlayer.hand = targetedPlayerHand
        targetPlayer.hand = currentPlayerHand
        currentPlayer.moves -= 1
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    },
    "Owl Bear Boogie": async (currentPlayer: Player, players: Player[]) => {
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

        await writeValue(allGameplayPlayers(), finalPlayers)
    },
    "": async () => {}
}