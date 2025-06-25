import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { play, Player, shieldDamage, takeDamage } from "./classes/Player"
import { Card } from "./classes/Card"
import { updateValue } from "./utility/firebaseActions"
import { gameplayPlayerPath } from "./utility/firebasePaths"
import { PlayerTarget } from "./PlayerTarget"

export const AttackButton = ({ 
    player, 
    card, 
    players, 
    updateTurnIndex,
    activeCard,
    setActiveCard
}: { 
    player: Player, 
    card: Card, 
    players: Player[], 
    updateTurnIndex: () => void,
    activeCard: boolean,
    setActiveCard: Dispatch<SetStateAction<boolean>>
}) => {
    const [ attackDamage, setAttackDamage ] = useState(card.attack as number)
    const [ attackOptions, setAttackOptions ] = useState(false)
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
        setAttackOptions(false);
        setAttackDamage(card.attack as number)
        setPossibleTargets(getTargetIndexes())
    }, [card])

    const handleTargetSelectedForCard = (target: Player) => {
        setPossibleTargets([target])
    }

    const handleShieldAttack = async (index: number, targetedPlayer: Player) => {
        const targetedShield = targetedPlayer.activeShields[index]
        // const targetedPlayerIndex = players.findIndex(player => player === targetedPlayer)
        if (attackDamage > targetedShield.hp) {
            const leftoverDamage = attackDamage - targetedShield.hp
            shieldDamage(index, targetedShield.hp, targetedPlayer)
            setAttackDamage(leftoverDamage)
            handleTargetSelectedForCard(targetedPlayer)
            // const newTargetPlayerInfo = { newPlayerInfo: targetedPlayer, playerIndex: targetedPlayerIndex}
            await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
            setActiveCard(true)
        }
        else {
            shieldDamage(index, attackDamage, targetedPlayer)
            play(player, card)
            // const newCurrentPlayerInfo = { newPlayerInfo: player, playerIndex: position}
            // const newTargetPlayerInfo = { newPlayerInfo: targetedPlayer, playerIndex: targetedPlayerIndex}
            // updatePlayer([newCurrentPlayerInfo, newTargetPlayerInfo])
            await updateValue(gameplayPlayerPath(player.uid), player)
            await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
            if (player.moves === 0) updateTurnIndex()
            else setActiveCard(false)
        }
    }

    const handleAttack = async (targetedPlayer: Player) => {
        takeDamage(attackDamage, targetedPlayer)
        // const targetedPlayerIndex = players.findIndex(player => player === targetedPlayer)
        // currentPlayerInfo.play(card)
        play(player, card)
        // const newCurrentPlayerInfo = { newPlayerInfo: currentPlayerInfo, playerIndex: currentPlayerIndex}
        // const newTargetPlayerInfo = { newPlayerInfo: targetedPlayer, playerIndex: targetedPlayerIndex}
        // updatePlayer([newCurrentPlayerInfo, newTargetPlayerInfo])
        await updateValue(gameplayPlayerPath(player.uid), player)
        await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        if (player.moves === 0) updateTurnIndex()
        else setActiveCard(false)
    }



    return (
        <div>

            {
                attackOptions ?
                <div>
                    <p>Attack Strength: {attackDamage}</p>
                    {
                        possibleTargets.map((target, i: number) => {
                            return (
                                <div key={i}>
                                    <PlayerTarget 
                                    playerInfo={target} 
                                    handleShieldAttack={handleShieldAttack}
                                    handleAttack={handleAttack}
                                    />
                                </div>
                            )
                        })
                    }
                    {!activeCard && <button onClick={() => setAttackOptions(false)}>
                        Cancel
                    </button>}
                </div>
                :
                !activeCard &&
                <button onClick={() => setAttackOptions(true)}>
                    Play
                </button>
            }
        </div>
    )
}