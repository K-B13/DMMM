import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { play, Player, shieldDamage, takeDamage } from "./classes/Player"
import { Card } from "./classes/Card"
import { updateValue, writeValue } from "./utility/firebaseActions"
import { gameplayPlayerPath, winnerPath } from "./utility/firebasePaths"
import { PlayerTarget } from "./PlayerTarget"
import { CardDisplay } from "./Arena"

export const AttackButton = ({ 
    player, 
    card, 
    players, 
    updateTurnIndex,
    attackDamage,
    setAttackDamage,
    cardPlayed,
}: { 
    player: Player, 
    card: Card, 
    players: Player[], 
    updateTurnIndex: () => void,
    attackDamage: number,
    setAttackDamage: Dispatch<SetStateAction<number>>,
    cardPlayed: (c: CardDisplay | undefined) => void,
}) => {
    
    const [ hasAttackOptions, setHasAttackOptions ] = useState(false)
    const [ possibleTargets, setPossibleTargets ] = useState<Player[]>([])

    const getTargetIndexes = () => {
        const currentIndex = players.findIndex(p => p.uid === player.uid)
        const numPlayers = players.length

        let left = (currentIndex - 1 + numPlayers) % numPlayers;
        let right = (currentIndex + 1) % numPlayers;

        while (!players[left].active) {
            left = (left - 1 + numPlayers) % numPlayers;
            if (left === currentIndex) break;
        }
        while (!players[right].active) {
            right = (right + 1) % numPlayers;
            if (right === currentIndex) break;
        }
        
        if (left === right) {
            return [players[left]]
        }
        return [players[right], players[left]]
    }

    useEffect(() => {
        const targetOptions = getTargetIndexes()
        setPossibleTargets([...targetOptions])
    }, [])

    useEffect(() => {
        setHasAttackOptions(false);
        setPossibleTargets(getTargetIndexes())
    }, [card])

    const handleTargetSelectedForCard = (target: Player, leftoverDamage: number) => {
        setAttackDamage(leftoverDamage)
        setPossibleTargets([target])
    }

    const handleShieldAttack = async (index: number, targetedPlayer: Player) => {
        const targetedShield = targetedPlayer.activeShields[index]
        if (attackDamage > targetedShield.hp) {
            const leftoverDamage = attackDamage - targetedShield.hp
            shieldDamage(index, targetedShield.hp, targetedPlayer)
            handleTargetSelectedForCard(targetedPlayer, leftoverDamage)
        }
        else {
            const leftoverDamage = Math.max(attackDamage - targetedShield.hp, 0)
            shieldDamage(index, attackDamage, targetedPlayer)
            play(player, card)
            cardPlayed({ currentCard: card, cardOwner: player })
            await updateValue(gameplayPlayerPath(player.uid), player)
            await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
            setAttackDamage(leftoverDamage)
            if (player.moves === 0) updateTurnIndex()
        }
    }

    const handleAttack = async (targetedPlayer: Player) => {
        takeDamage(attackDamage, targetedPlayer)
        play(player, card)
        cardPlayed({ currentCard: card, cardOwner: player })
        await winCheck()
        await updateValue(gameplayPlayerPath(player.uid), player)
        await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        setAttackDamage(0)
        if (player.moves === 0) updateTurnIndex()
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

    const handleCannotAttack = async () => {
        play(player, card)
        await writeValue(gameplayPlayerPath(player.uid), player)
        if (player.moves === 0) updateTurnIndex()
        
    }

    return (
        <div>

            {
                hasAttackOptions ?
                <div className="player-targets-div">
                    <div className="target-interface">
                    <p>Attack Strength: {attackDamage}</p>
                        {
                            possibleTargets.map((target, i: number) => {
                                return (
                                    <div 
                                    key={i}
                                    >
                                        {
                                        target.targetable ?
                                            <PlayerTarget 
                                            playerInfo={target} 
                                            handleShieldAttack={handleShieldAttack}
                                            handleAttack={handleAttack}
                                            cancelButton={cancelButton}
                                            />
                                            : null
                                        }
                                    </div>
                                )
                            })
                        }
                    {
                        possibleTargets.length === 1 && possibleTargets[0].targetable === false &&
                        <div>
                        <button onClick={handleCannotAttack}>
                            Play Without Attack
                        </button>
                        <button onClick={cancelButton}>
                            Cancel
                        </button>
                        </div>
                    }
                    </div>
                </div>
                :
                !attackDamage &&
                <button 
                className="card-play"
                onClick={() => {
                setHasAttackOptions(true)
                setAttackDamage((card.attack as number))
                }
                }>
                    Play
                </button>
            }
        </div>
    )
}