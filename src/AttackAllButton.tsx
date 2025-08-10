import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card } from "./classes/Card";
import { play, Player, shieldDamage, takeDamage } from "./classes/Player";
import { CardDisplay } from "./Arena";
import { PlayerTarget } from "./PlayerTarget";
import { writeValue } from "./utility/firebaseActions";
import { gameplayPlayerPath, winnerPath } from "./utility/firebasePaths";

export const AttackAllButton = ({ 
    player, 
    card, 
    players, 
    updateTurnIndex,
    attackDamage,
    setAttackDamage,
    cardPlayed,
    cancel
}: {
    player: Player, 
    card: Card, 
    players: Player[], 
    updateTurnIndex: () => void,
    attackDamage: number,
    setAttackDamage: Dispatch<SetStateAction<number>>,
    cardPlayed: (c: CardDisplay | undefined) => void,
    cancel?: () => void
 }) => {
    const [ hasAttackOptions, setHasAttackOptions ] = useState(false)
    const [ tempAttackDamage, setTempAttackDamage ] = useState(0)
    const [ currentTargetIndex, setCurrentTargetIndex ] = useState(0);

    useEffect(() => {
        setTempAttackDamage(attackDamage)
    }, [attackDamage])

    const getAllValidTargets = () => {
        const options = players.filter(p => {
            return p.uid !== player.uid && p.targetable && p.active
        })
        return options
    }

    const handleTargetSelectedForCard = (leftoverDamage: number) => {
        setTempAttackDamage(leftoverDamage)
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
        setTempAttackDamage(attackDamage)
        setCurrentTargetIndex(prevIndex => prevIndex + 1)
    }

    const handleShieldAttack = async (index: number, targetedPlayer: Player) => {
        const targetedShield = targetedPlayer.activeShields[index]
        if (tempAttackDamage > targetedShield.hp) {
            const leftoverDamage = tempAttackDamage - targetedShield.hp
            shieldDamage(index, targetedShield.hp, targetedPlayer)
            handleTargetSelectedForCard(leftoverDamage)
        }
        else {
            const leftoverDamage = Math.max(tempAttackDamage - targetedShield.hp, 0)
            shieldDamage(index, tempAttackDamage, targetedPlayer)
            // cardPlayed({ currentCard: card, cardOwner: player })
            handleTargetSelectedForCard(leftoverDamage)
            await nextPlayer()
        }
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

    const playAnywayFunction = async () => {
        setAttackDamage(0)
        play(player, card)
        if (player.moves === 0) updateTurnIndex()
        await writeValue(gameplayPlayerPath(player.uid), player)
    }
    return (
        <div>
            {
                hasAttackOptions ?
                    <div className="player-targets-div">
                        <div className="target-interface">
                            {
                                validTargets.length >= 1 ?
                                <>
                                    <p>Attack Strength: {tempAttackDamage}</p>
                                    <div className="player-target">
                                        <PlayerTarget 
                                        playerInfo={validTargets[currentTargetIndex]}
                                        handleShieldAttack={handleShieldAttack}
                                        handleAttack={handleAttack}
                                        ignoreShields={player.ignoreShields as boolean}
                                        />
                                    </div>
                                </>
                                :   
                                <button onClick={playAnywayFunction}>
                                    Play Anyway
                                </button>
                            }
                            {
                                currentTargetIndex === 0 &&
                                <button onClick={cancel ? cancel: cancelButton}>Cancel</button>
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