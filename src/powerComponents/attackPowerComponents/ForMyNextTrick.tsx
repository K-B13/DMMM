import { useEffect, useState } from "react";
import { Card } from "../../classes/Card"; 
import { Player, removeFromHand, shieldDamage, takeDamage } from "../../classes/Player";
import { CardDisplay } from "../../Arena";
import { PlayerTarget } from "../../PlayerTarget";
import { writeValue } from "../../utility/firebaseActions";
import { gameplayPlayerPath, winnerPath } from "../../utility/firebasePaths";

export const ForMyNextTrick = ({ 
    currentPlayer,
    card,
    players,
    cancel,
    updateTurnIndex,
    cardPlayed
}: {
    currentPlayer: Player, 
    card: Card,
    players: Player[],
    cancel: () => void,
    updateTurnIndex: () => void,
    cardPlayed: (c: CardDisplay | undefined) => void
 }) => {
    const [ attackDamage, setAttackDamage ] = useState(1)
    const [ currentTargetIndex, setCurrentTargetIndex ] = useState(0);

    const getAllValidTargets = () => {
        const options = players.filter(p => {
            return p.uid !== currentPlayer.uid && p.targetable && p.active
        })
        return options
    }

    const validTargets = getAllValidTargets()


    const nextPlayer = async () => {
        const targetPlayer = validTargets[currentTargetIndex]
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        if (currentTargetIndex === validTargets.length - 1) {            
            currentPlayer.moves -= 1
            removeFromHand(card, currentPlayer)
            if (currentPlayer.moves === 0) updateTurnIndex()
            await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        return
        }
        setCurrentTargetIndex(prevIndex => prevIndex + 1)
    }

    const handleShieldAttack = async (index: number, targetedPlayer: Player) => {
        shieldDamage(index, attackDamage, targetedPlayer)
        // cardPlayed({ currentCard: card, cardOwner: player })
        await nextPlayer()
    }

    const handleAttack = async (targetedPlayer: Player) => {
        takeDamage(attackDamage, targetedPlayer)
        // cardPlayed({ currentCard: card, cardOwner: player })
        await winCheck()
        await nextPlayer()
    }

    const winCheck = async () => {
        const alivePlayers = players.filter(p => p.active === true)    
        if (alivePlayers.length === 1)
        {
            await writeValue(winnerPath(), alivePlayers[0])
        }
    }
    useEffect(() => {
        currentPlayer.moves += 1
        currentPlayer.hitAll = true
    }, [])

    const cancelCard = () => {
        currentPlayer.moves -= 1
        currentPlayer.hitAll = false
        cancel()
    }
    const playAnywayFunction = async () => {
        currentPlayer.moves -= 1
        removeFromHand(card, currentPlayer)
        if (currentPlayer.moves === 0) updateTurnIndex()
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    }

    return (
        <div>
            <div className="player-targets-div">
                <div className="target-interface">
                    {
                        validTargets.length >= 1 ?
                        <>
                            <p>Attack Strength: {attackDamage}</p>
                            {
                                <div className="player-target">
                                    <PlayerTarget 
                                    playerInfo={validTargets[currentTargetIndex]}
                                    handleShieldAttack={handleShieldAttack}
                                    handleAttack={handleAttack}
                                    ignoreShields={currentPlayer.ignoreShields as boolean}
                                    />
                                </div>
                            }
                        </>
                        :   
                        <button onClick={playAnywayFunction}>
                            Play Anyway
                        </button>                        
                    }
                    {
                        currentTargetIndex === 0 &&
                        <button onClick={cancelCard}>Cancel</button>
                    }
                </div>
            </div>            
        </div>
    )
}