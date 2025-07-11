import { useEffect, useState } from "react"
import { play, Player, removeFromHand, shieldDamage, takeDamage } from "../../classes/Player"
import { Card } from "../../classes/Card"
import { CardDisplay } from "../../Arena"
import { writeValue } from "../../utility/firebaseActions"
import { gameplayPlayerPath, winnerPath } from "../../utility/firebasePaths"
import { PlayerTarget } from "../../PlayerTarget"
import { PowerPlayerCard } from "../powerHelperComponents/PowerPlayerCard"
import { PowerShieldComponent } from "../powerHelperComponents/PowerShieldCard"
import { discard } from "../../classes/Deck"

export const ToTheFaceComponent = ({
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
    const [ possibleTargets, setPossibleTargets ] = useState<Player[]>([])
    
    const getTargetIndexes = () => {
        return players.filter(p => p.uid !== currentPlayer.uid && p.active && p.targetable)
    }

    useEffect(() => {
        const targetOptions = getTargetIndexes()
        setPossibleTargets([...targetOptions])
    }, [])

    useEffect(() => {
        setPossibleTargets(getTargetIndexes())
    }, [card])

    const handleTargetSelectedForCard = (target: Player, leftoverDamage: number) => {
        setAttackDamage(leftoverDamage)
        setPossibleTargets([target])
    }

    const shieldTargets = () => {
        return players.filter(p => {
            return p.activeShields.length > 0
        })
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
        setAttackDamage(0)
    }

    const handleShieldSelection = async (targetPlayer: Player, position: number) => {
        const selectedShield = targetPlayer.activeShields.splice(position, 1)[0]
        discard(selectedShield.card, targetPlayer.deck)
        setAttackDamage(selectedShield.card.shield as number)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
    }

    const handleNoTargets = async () => {
        currentPlayer.moves -= 1
        if (currentPlayer.moves === 0) updateTurnIndex()
        removeFromHand(card, currentPlayer)
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    }

    return (
        <div>
            <div className="player-targets-div">
                <div className="target-interface">
                {
                    attackDamage ?
                    <>
                        <p>Attack Strength: {attackDamage}</p>
                        {
                            possibleTargets.map((target, i: number) => {
                                return (
                                    <div 
                                    key={i}
                                    >
                                        <PlayerTarget 
                                        playerInfo={target} 
                                        handleShieldAttack={handleShieldAttack}
                                        handleAttack={handleAttack}
                                        cancelButton={cancelButton}
                                        />
                                    </div>
                                )
                            })
                        }
                    </>:
                    <>
                        <div className="player-target">
                            {
                                shieldTargets().map(player => {
                                    return (
                                        <div key={player.uid}>
                                            <PowerPlayerCard playerInfo={player}/>
                                            <PowerShieldComponent playerInfo={player} handleSpecialFunction={handleShieldSelection}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <button onClick={handleNoTargets}>Play Anyway</button>
                        <button onClick={cancel}>Cancel</button>
                    </>
                    }
                </div>
            </div>
        </div>
    )
}