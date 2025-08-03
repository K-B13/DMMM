import { useState } from "react"
import { CardDisplay } from "../../Arena"
import { Card } from "../../classes/Card"
import { play, Player, shieldDamage, takeDamage } from "../../classes/Player"
import { gameplayPlayerPath, winnerPath } from "../../utility/firebasePaths"
import { writeValue } from "../../utility/firebaseActions"
import { PlayerTarget } from "../../PlayerTarget"

export const HostileTakeoverComponent = ({
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

    const [ phase, setPhase ] = useState<'initial' | 'phase1' | 'phase2'>('initial')
    const [ attackDamage, setAttackDamage ] = useState(1)
    const [ phase1Target, setPhase1Target ] = useState<Player | null>(null)
    const [ currentTargetIndex, setCurrentTargetIndex ] = useState(0)
    // Needs to loop through attacking all
    // Need to have a cancel for the first loop option.
    // Present all the options for the double attack
    // Above needs to handle if there are no options
    // Needs to store the option
    // Present all options but the previously selected one
    // Needs to handle if there are no options

    const getValidTargets = () => {
        return players.filter(p => p.uid !== currentPlayer.uid && p.active && p.targetable && p.uid !== phase1Target?.uid)
    }
    
    const allTargets = getValidTargets()

    const handleTargetSelectedForCard = async (leftoverDamage: number, targetPlayer: Player) => {
        setAttackDamage(leftoverDamage)
        await writeValue(gameplayPlayerPath(targetPlayer.uid), targetPlayer)
        if (phase === 'phase1') {
            setAttackDamage(1)
            setPhase1Target(targetPlayer)
            setPhase('phase2')
        }
        if (phase === 'phase2') {
            play(currentPlayer, card)
            if (currentPlayer.moves === 0) updateTurnIndex()
            await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
        }
    }


    const nextPlayer = async () => {
        const player = allTargets[currentTargetIndex]
        await writeValue(gameplayPlayerPath(player.uid), player)
        if (currentTargetIndex === allTargets.length - 1) {
            setAttackDamage(2)
            setPhase('phase1')
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
            handleTargetSelectedForCard(leftoverDamage, targetedPlayer)
        }
        else {
            const leftoverDamage = Math.max(attackDamage - targetedShield.hp, 0)
            shieldDamage(index, attackDamage, targetedPlayer)
            handleTargetSelectedForCard(leftoverDamage, targetedPlayer)
            // cardPlayed({ currentCard: card, cardOwner: currentPlayer })
            if (phase === 'initial') {
                await nextPlayer()           
            }    
        }
    }

    const handleAttack = async (targetedPlayer: Player) => {
        takeDamage(attackDamage, targetedPlayer)
        // cardPlayed({ currentCard: card, cardOwner: currentPlayer })
        await winCheck()        
        if (phase === 'initial') {
            await nextPlayer()
        } else {
            handleTargetSelectedForCard(0, targetedPlayer)
        }
    }

    const winCheck = async () => {
        const alivePlayers = players.filter(p => p.active === true)    
        if (alivePlayers.length === 1)
        {
            await writeValue(winnerPath(), alivePlayers[0])
        }
    }

    const handlePlayAnyway = async () => {
        play(currentPlayer, card)
        if (currentPlayer.moves === 0) updateTurnIndex()
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    }

    const renderValidTargets = () => {
        const options = getValidTargets()
        if (options.length === 0) {
            const phaseDescription = "There are no valid targets for you to attack"
            return (
                <div>
                    <p>{phaseDescription}</p>
                    <button onClick={handlePlayAnyway}>Play Anyway</button>
                </div>
            )
        } else {
            const phaseDescription = phase === 'phase1'
            ? "Choose a player for 2 additional damage:"
            : "Choose a different player for 1 additional damage:"
            return options.map((target, i) => {
                return (
                    <div key={i}>
                        <p>{phaseDescription}</p>
                        <div>
                            <PlayerTarget
                            playerInfo={target}
                            handleShieldAttack={handleShieldAttack}
                            handleAttack={handleAttack}
                            />
                        </div>
                    </div>
                )
            })
        }        
    }
    

    return (
        <div className="player-targets-div">
            <div className="target-interface">
                <p>You have {attackDamage} attack damage</p>
                {
                    phase === 'initial' && 
                    <div className="player-target"> 
                        <PlayerTarget
                        playerInfo={allTargets[currentTargetIndex]}
                        handleShieldAttack={handleShieldAttack}
                        handleAttack={handleAttack}
                        />
                    </div>
                }
                {
                    phase === 'phase1' &&
                    renderValidTargets()
                }
                {
                    phase === 'phase2' &&
                    renderValidTargets()
                }
            </div>

            {
                currentTargetIndex === 0 &&
                <button onClick={cancel}>Cancel</button>
            }

        </div>
    )

}