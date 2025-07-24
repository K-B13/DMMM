import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card } from "../../classes/Card"; 
import { play, Player, shieldDamage, takeDamage } from "../../classes/Player";
import { CardDisplay } from "../../Arena";
import { PlayerTarget } from "../../PlayerTarget";
import { writeValue } from "../../utility/firebaseActions";
import { gameplayPlayerPath, winnerPath } from "../../utility/firebasePaths";

export const ForMyNextTrick = ({ 
    player, 
    card, 
    players, 
    updateTurnIndex,
    cardPlayed,
}: {
    player: Player, 
    card: Card, 
    players: Player[], 
    updateTurnIndex: () => void,
    cardPlayed: (c: CardDisplay | undefined) => void,
 }) => {
    const [ hasAttackOptions, setHasAttackOptions ] = useState(false)
    const [ attackDamage, setAttackDamage ] = useState(1)
    const [ currentTargetIndex, setCurrentTargetIndex ] = useState(0);

    const getAllValidTargets = () => {
        const options = players.filter(p => {
            return p.uid !== player.uid && p.targetable && p.active
        })
        return options
    }

    const validTargets = getAllValidTargets()


    const nextPlayer = async () => {
        const targetPlayer = validTargets[currentTargetIndex]
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
        await writeValue(gameplayPlayerPath(player.uid), player)
        if (currentTargetIndex === validTargets.length - 1) {
            setAttackDamage(0)
            play(player, card)
            if (player.moves === 0) updateTurnIndex()
            await writeValue(gameplayPlayerPath(player.uid), player)
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

    const cancelButton = () => {
        setHasAttackOptions(false)
        setAttackDamage(0)
    }
    return (
        <div>
            {
                hasAttackOptions ?
                <div className="player-targets-div">
                    <div className="target-interface">
                        <p>Attack Strength: {attackDamage}</p>
                        {
                            <div className="player-target">
                                <PlayerTarget 
                                playerInfo={validTargets[currentTargetIndex]}
                                handleShieldAttack={handleShieldAttack}
                                handleAttack={handleAttack}
                                />
                            </div>
                        }
                        {
                            currentTargetIndex === 0 &&
                            <button onClick={cancelButton}>Cancel</button>
                        }
                    </div>
                </div>
                :
                !attackDamage && 
                <button
                className="card-play"
                onClick={() => {
                    setHasAttackOptions(true)
                    setAttackDamage(card.attack as number)
                }}
                >
                    Play
                </button>
            }
        </div>
    )
}