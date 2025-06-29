import { useEffect, useState } from "react"
import { Card } from "./classes/Card"
import { play, Player, shieldDamage, startTurn, takeDamage } from "./classes/Player"
import { updateValue } from "./utility/firebaseActions"
import { gameplayPlayerPath } from "./utility/firebasePaths"
import { getUid } from "./utility/getUid"
import { CurrentPlayerView } from "./CurrentPlayerView"
import { OtherPlayersView } from "./OtherPlayersView"

export const PlayerView = ({ 
    player, 
    turnIndex,
    updateTurnIndex,
    currentPlayer,
    players,
}: { 
    player: Player, 
    turnIndex: number,
    updateTurnIndex: () => void,
    currentPlayer: Player,
    players: Player[],
}) => {
    const [ canDraw, setCanDraw ] = useState(false)
    const [ attackDamage, setAttackDamage ] = useState(0)

    const nonAttackClick = async (card: Card) => {
        play(player, card)

        if (player.moves === 0) {
            updateTurnIndex()
        }
        await updateValue(gameplayPlayerPath(player.uid), player)

    }

    useEffect(() => {
        startTurnFunction()
    }, [turnIndex])

    const drawCardFromDeck = async (player: Player) => {
        startTurn(player)
        await updateValue(gameplayPlayerPath(player.uid), player)
        setCanDraw(false)
    }

    const startTurnFunction = async () => {
        if (player.uid === currentPlayer.uid) {
            setCanDraw(true)
        }
    }

     const handleGhostShieldAttack = async (index: number, targetedPlayer: Player) => {
        shieldDamage(index, 1, targetedPlayer)
        console.log(`${player} is targeting ${targetedPlayer}'s shield`)
        await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        updateTurnIndex()
    }

    const handleGhostAttack = async (targetedPlayer: Player) => {
        takeDamage(1, targetedPlayer)
        console.log(`${player} is targeting ${targetedPlayer}`)
        await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        updateTurnIndex()
    }

    return (
        <div>
            {
                getUid() === player.uid ? 
                <CurrentPlayerView 
                player={player}
                currentPlayer={currentPlayer}
                canDraw={canDraw}
                attackDamage={attackDamage}
                nonAttackClick={nonAttackClick}
                players={players}
                updateTurnIndex={updateTurnIndex}
                setAttackDamage={setAttackDamage}
                drawCardFromDeck={drawCardFromDeck}
                handleGhostShieldAttack={handleGhostShieldAttack}
                handleGhostAttack={handleGhostAttack}
                />
                :
                <OtherPlayersView 
                player={player}
                />
            }       
        </div> 
    )
}