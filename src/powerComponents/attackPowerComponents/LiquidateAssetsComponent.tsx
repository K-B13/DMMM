import { useEffect, useState } from "react"
import { play, Player, shieldDamage, takeDamage } from "../../classes/Player"
import { Card } from "../../classes/Card"
import { CardDisplay } from "../../Arena"
import { writeValue } from "../../utility/firebaseActions"
import { gameplayPlayerPath, winnerPath } from "../../utility/firebasePaths"
import { PlayerTarget } from "../../PlayerTarget"

export const LiquidateAssets = ({
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
    const [ attackDamage, setAttackDamage ] = useState(Math.min(currentPlayer.hand.length, 5) - 1)
    // const [ hasAttackOptions, setHasAttackOptions ] = useState(false)
    const [ possibleTargets, setPossibleTargets ] = useState<Player[]>([])
    
    const getTargetIndexes = () => {
        return players.filter(p => p.uid !== currentPlayer.uid && p.active)
    }

    useEffect(() => {
        const targetOptions = getTargetIndexes()
        setPossibleTargets([...targetOptions])
    }, [])

    useEffect(() => {
        // setHasAttackOptions(false);
        setPossibleTargets(getTargetIndexes())
    }, [card])

    const handleTargetSelectedForCard = (target: Player, leftoverDamage: number) => {
        setAttackDamage(leftoverDamage)
        setPossibleTargets([target])
    }

    const discardEntireHand = () => {
        if (currentPlayer.hand.length > 1) {
            currentPlayer.deck.discardPile = [...currentPlayer.deck.discardPile, ...currentPlayer.hand]
            currentPlayer.hand = []
        }
    }

    const handleShieldAttack = async (index: number, targetedPlayer: Player) => {
        discardEntireHand()
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
        discardEntireHand()
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

    return (
        <div>

            {
                <div className="player-targets-div">
                    <div className="target-interface">
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
                    </div>
                </div>
            }
        </div>
    )
}