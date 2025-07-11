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

export const FireballComponent = ({
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
    const [ attackDamage, setAttackDamage ] = useState(3)
    // const [ possibleTargets, setPossibleTargets ] = useState<Player[]>([])
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
    // const [damageLeft, setDamageLeft] = useState(3);
    // const [damageAllocations, setDamageAllocations] = useState<Record<string, number>>({});
    // const [allTargets, setAllTargets] = useState<Player[]>([]);
    
    // const getTargetIndexes = () => {
    //     return players.filter(p => p.uid !== currentPlayer.uid && p.active)
    // }

    // useEffect(() => {
    //     setPossibleTargets([...targetOptions])
    // }, [])

    // useEffect(() => {
    //     setPossibleTargets(getTargetIndexes())
    // }, [card])

    const allAlivePlayers = () => {
        return players.filter(p => p.active)
    }

    const handleTargetSelectedForCard = (leftoverDamage: number) => {
        setAttackDamage(leftoverDamage)
        // setPossibleTargets([target])
    }

    const nextPlayer = async () => {
        const player = allAlivePlayers()[currentTargetIndex]
        await writeValue(gameplayPlayerPath(allAlivePlayers()[currentTargetIndex].uid), player)
        if (currentTargetIndex === allAlivePlayers().length - 1) {
            play(currentPlayer, card)
            if (currentPlayer.moves === 0) updateTurnIndex()
            await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        return
        }
        setAttackDamage(3)
        setCurrentTargetIndex(prevIndex => prevIndex + 1)
    }

    const handleShieldAttack = async (index: number, targetedPlayer: Player) => {
        const targetedShield = targetedPlayer.activeShields[index]
        if (attackDamage > targetedShield.hp) {
            const leftoverDamage = attackDamage - targetedShield.hp
            shieldDamage(index, targetedShield.hp, targetedPlayer)
            handleTargetSelectedForCard(leftoverDamage)
        }
        else {
            const leftoverDamage = Math.max(attackDamage - targetedShield.hp, 0)
            shieldDamage(index, attackDamage, targetedPlayer)
            // cardPlayed({ currentCard: card, cardOwner: currentPlayer })
            // await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
            // await writeValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
            handleTargetSelectedForCard(leftoverDamage)
            await nextPlayer()
            
        }
    }

    const handleAttack = async (targetedPlayer: Player) => {
        takeDamage(attackDamage, targetedPlayer)
        // cardPlayed({ currentCard: card, cardOwner: currentPlayer })
        await winCheck()
        // await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        // await writeValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        setAttackDamage(0)
        await nextPlayer()
        // play(currentPlayer, card)
        // if (currentPlayer.moves === 0) updateTurnIndex()
    }

    const winCheck = async () => {
        const alivePlayers = players.filter(p => p.active === true)    
        if (alivePlayers.length === 1)
        {
            await writeValue(winnerPath(), alivePlayers[0])
        }
    }

    return (
        <div>
            <div className="player-targets-div">
                <div className="target-interface">
                    <p>You have {attackDamage} attack damage</p>
                    {
                        <div className="player-target">
                            <PlayerTarget 
                            playerInfo={allAlivePlayers()[currentTargetIndex]}
                            handleShieldAttack={handleShieldAttack}
                            handleAttack={handleAttack}
                            />
                        </div>
                    }
                    {
                        currentTargetIndex === 0 &&
                        attackDamage === 3 &&
                        <button onClick={cancel}>Cancel</button>
                    }
                </div>
            </div>
        </div>
    )
}