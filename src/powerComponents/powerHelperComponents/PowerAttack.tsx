import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { play, Player, shieldDamage, takeDamage } from "../../classes/Player"
import { Card } from "../../classes/Card"
import { updateValue, writeValue } from "../../utility/firebaseActions"
import { gameplayPlayerPath, winnerPath } from "../../utility/firebasePaths"
import { PlayerTarget } from "../../PlayerTarget"
import { CardDisplay } from "../../Arena"

export const PowerAttack = ({ 
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
    
    const [ possibleTargets, setPossibleTargets ] = useState<Player[]>([])

    const getForcedTarget = (): Player | undefined => {
        return players.find(p => p.onlyTarget === true && p.active && p.uid !== player.uid);
    };

    const getTargetIndexes = () => {
        const currentIndex = players.findIndex(p => p.uid === player.uid)
        const numPlayers = players.length

        const forced = getForcedTarget()
        if (forced) {
            if (forced.targetable) return [forced]
            return []
        }

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
        setPossibleTargets(getTargetIndexes())
    }, [card])

    const handleTargetSelectedForCard = (target: Player, leftoverDamage: number) => {
        setAttackDamage(leftoverDamage)
        setPossibleTargets([target])
    }

    // const handleShieldAttack = async (index: number, targetedPlayer: Player) => {
    //     const targetedShield = targetedPlayer.activeShields[index]
    //     if (attackDamage > targetedShield.hp) {
    //         const leftoverDamage = attackDamage - targetedShield.hp
    //         shieldDamage(index, targetedShield.hp, targetedPlayer)
    //         handleTargetSelectedForCard(targetedPlayer, leftoverDamage)
    //     }
    //     else {
    //         const leftoverDamage = Math.max(attackDamage - targetedShield.hp, 0)
    //         shieldDamage(index, attackDamage, targetedPlayer)
    //         play(player, card)
    //         cardPlayed({ currentCard: card, cardOwner: player })
    //         await updateValue(gameplayPlayerPath(player.uid), player)
    //         await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
    //         setAttackDamage(leftoverDamage)
    //         if (player.moves === 0) updateTurnIndex()
    //     }
    // }

    const handleAttack = async (targetedPlayer: Player) => {
        takeDamage(attackDamage, targetedPlayer)
        play(player, card)
        cardPlayed({ currentCard: card, cardOwner: player })
        await winCheck()
        await updateValue(gameplayPlayerPath(player.uid), player)
        await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        if (player.moves === 0) updateTurnIndex()
    }

    const winCheck = async () => {
        const alivePlayers = players.filter(p => p.active === true)    
        if (alivePlayers.length === 1)
        {
            await writeValue(winnerPath(), alivePlayers[0])
        }
    }

    const handleCannotAttack = async () => {
        setAttackDamage(0)
        play(player, card)
        await writeValue(gameplayPlayerPath(player.uid), player)
        if (player.moves === 0) updateTurnIndex()
        
    }

    return (
        <div>
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
                                        // handleShieldAttack={handleShieldAttack}
                                        handleAttack={handleAttack}
                                        ignoreShields={player.ignoreShields as boolean}
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
                        <button onClick={cancel}>
                            Cancel
                        </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}