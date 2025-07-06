import { PlayerState } from "../App";
import { Player } from "../classes/Player";

export const findPlayer = (players: PlayerState[], playerToFind: string) => {
    const player = players.find(p => p.uid === playerToFind)
    if (player) return player
    return ''
}

export const findPlayerIndex = (players: Player[], playerToFind: string) => {
    const player = players.findIndex(p => {
        return p.uid === playerToFind
    })
    if (player === -1) {
        const randomIndex = Math.floor(Math.random() * players.length)
        return randomIndex
    }
    return player
}