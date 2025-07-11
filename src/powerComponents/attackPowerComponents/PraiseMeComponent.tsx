import { useEffect, useState } from "react"
import { heal, play, Player, shieldDamage, takeDamage } from "../../classes/Player"
import { Card } from "../../classes/Card"
import { CardDisplay } from "../../Arena"
import { writeValue } from "../../utility/firebaseActions"
import { gameplayPlayerPath, winnerPath } from "../../utility/firebasePaths"
import { PlayerTarget } from "../../PlayerTarget"
import { draw } from "../../classes/Deck"

export const PraiseMeComponent = ({
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
    const [ attackDamage, setAttackDamage ] = useState(1)
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);

    const allAlivePlayers = () => {
        return [...players.filter(p => p.active && p.uid !== currentPlayer.uid)]
    }

    const handleTargetSelectedForCard = (leftoverDamage: number) => {
        setAttackDamage(leftoverDamage)
    }

    const alivePlayers = allAlivePlayers()

    const nextPlayer = async () => {
        if (currentTargetIndex === 0) {
            for(let i = 1; i <= 3; i++) {
                const drawnCard = draw(currentPlayer.deck)
                if (!drawnCard) continue
                currentPlayer.hand = [...currentPlayer.hand, drawnCard]
            }
            await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        }
        const player = alivePlayers[currentTargetIndex]
        await writeValue(gameplayPlayerPath(player.uid), player)
        if (currentTargetIndex === alivePlayers.length - 1) {
            play(currentPlayer, card)
            if (currentPlayer.moves === 0) updateTurnIndex()
            await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        return
        }
        setAttackDamage(1)
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
            handleTargetSelectedForCard(leftoverDamage)
            await nextPlayer()
            
        }
    }

    const handleAttack = async (targetedPlayer: Player) => {
        takeDamage(attackDamage, targetedPlayer)
        // cardPlayed({ currentCard: card, cardOwner: currentPlayer })
        await winCheck()
        setAttackDamage(0)
        await nextPlayer()
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
                    <p>You have 1 attack damage</p>
                    {
                        <div className="player-target">
                            <PlayerTarget 
                            playerInfo={alivePlayers[currentTargetIndex]}
                            handleShieldAttack={handleShieldAttack}
                            handleAttack={handleAttack}
                            />
                        </div>
                    }
                    {
                        currentTargetIndex === 0 &&
                        <button onClick={cancel}>Cancel</button>
                    }
                </div>
            </div>
        </div>
    )
}