import { useEffect, useState } from "react"
import { play, Player, shieldDamage, takeDamage } from "../../classes/Player"
import { Card } from "../../classes/Card"
import { CardDisplay } from "../../Arena"
import { writeValue } from "../../utility/firebaseActions"
import { gameplayPlayerPath, winnerPath } from "../../utility/firebasePaths"
import { PlayerTarget } from "../../PlayerTarget"
import { specialMoves } from "../../utility/specialMoves"
import { PowerPlayerCard } from "../powerHelperComponents/PowerPlayerCard"

export const MindBlastComponent = ({
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
    player: Player,
    cancel: () => void,
    updateTurnIndex: () => void,
    cardPlayed: (c: CardDisplay | undefined) => void
}) => {
    const [ attackDamage, setAttackDamage ] = useState(0)
    const [ hasAttackOptions, setHasAttackOptions ] = useState(false)
    const [ possibleTargets, setPossibleTargets ] = useState<Player[]>([])
    const [ selectedPlayer, setSelectedPlayer ] = useState<Player | null>(null)
    const [ lockInChoice, setLockInChoice ] = useState(false)
    
    const getTargetIndexes = () => {
        return players.filter(p => p.uid !== currentPlayer.uid && p.active)
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
            play(currentPlayer, card)
            cardPlayed({ currentCard: card, cardOwner: currentPlayer })
            await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
            await writeValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
            setAttackDamage(leftoverDamage)
            if (currentPlayer.moves === 0) updateTurnIndex()
        }
    }

    const handleAttack = async (targetedPlayer: Player) => {
        takeDamage(attackDamage, targetedPlayer)
        play(currentPlayer, card)
        cardPlayed({ currentCard: card, cardOwner: currentPlayer })
        await winCheck()
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        await writeValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        setAttackDamage(0)
        if (currentPlayer.moves === 0) updateTurnIndex()
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
    const cancelBeforeFirstAttack = () => {
        setSelectedPlayer(null)
        setLockInChoice(true)
    }

    return (
        <div>

            {
                hasAttackOptions ?
                <div className="player-targets-div">
                    <div className="target-interface">                    
                        {
                            !selectedPlayer ?
                            <div>
                                <div>
                                {
                                    possibleTargets.map((target, i: number) => {
                                        return (
                                            <div key={i}>
                                                <PowerPlayerCard playerInfo={target} showTotalShields={true}/>
                                                <button
                                                onClick={() => {
                                                    setSelectedPlayer(target)
                                                    setAttackDamage(target.hand.length) 
                                                }}>
                                                    Choose
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                                {
                                    !lockInChoice &&
                                    <button
                                    onClick={cancelBeforeFirstAttack}>
                                        Cancel
                                    </button>
                                }
                            </div>:
                            <div>
                                <p>Attack Strength: {attackDamage}</p>
                                <PlayerTarget 
                                playerInfo={selectedPlayer} 
                                handleShieldAttack={handleShieldAttack}
                                handleAttack={handleAttack}
                                cancelButton={cancelButton}
                                />
                            </div>
                        }
                    </div>
                </div>
                :
                <button 
                className="card-play"
                onClick={() => {
                setHasAttackOptions(true)
                }
                }>
                    Play
                </button>
            }
        </div>
    )
}