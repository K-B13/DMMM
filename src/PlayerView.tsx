import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CardDetails } from "./CardDetails"
import { Card } from "./classes/Card"
import { play, Player, shieldDamage, startTurn, takeDamage } from "./classes/Player"
import { PlayerCard } from "./PlayerCard"
import { updateValue } from "./utility/firebaseActions"
import { gameplayPlayerPath } from "./utility/firebasePaths"
import { getUid } from "./utility/getUid"
import { AttackButton } from "./AttackButton"
import { PlayerTarget } from "./PlayerTarget"

export const PlayerView = ({ 
    player, 
    turnIndex,
    updateTurnIndex,
    currentPlayer,
    players,
}: { 
    player: Player, 
    turnIndex: number,
    updateTurnIndex: () => void,
    currentPlayer: Player,
    players: Player[],
}) => {
    const [ canDraw, setCanDraw ] = useState(false)
    const [ attackDamage, setAttackDamage ] = useState(0)

    const nonAttackClick = async (card: Card) => {
        play(player, card)

        if (player.moves === 0) {
            updateTurnIndex()
        }
        await updateValue(gameplayPlayerPath(player.uid), player)

    }

    useEffect(() => {
        startTurnFunction()
    }, [turnIndex])

    const drawCardFromDeck = async (player: Player) => {
        startTurn(player)
        await updateValue(gameplayPlayerPath(player.uid), player)
        setCanDraw(false)
    }

    const startTurnFunction = async () => {
        if (player.uid === currentPlayer.uid) {
            setCanDraw(true)
        }
    }

     const handleGhostShieldAttack = async (index: number, targetedPlayer: Player) => {
        shieldDamage(index, 1, targetedPlayer)
        console.log(`${player} is targeting ${targetedPlayer}'s shield`)
        await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        updateTurnIndex()
    }

    const handleGhostAttack = async (targetedPlayer: Player) => {
        takeDamage(1, targetedPlayer)
        console.log(`${player} is targeting ${targetedPlayer}`)
        await updateValue(gameplayPlayerPath(targetedPlayer.uid), targetedPlayer)
        updateTurnIndex()
    }

    return (
        <div>            
            <PlayerCard player={player} />
            <div className="player-hand card-array-div">
                {
                    player.active &&
                    <>
                        {player.hand.map((card: Card, index: number) => {
                            return (
                                <div key={index} className="card-details">
                                    {
                                        getUid() === player.uid ?
                                        <CardDetails card={card} />:
                                        <div>
                                            <p>Dungeon Mayhehm</p>
                                            <p>Monster Madness</p>
                                        </div>
                                    }
                                    {
                                        player.uid === currentPlayer.uid &&
                                        !canDraw &&
                                         ( 
                                            card.attack ?
                                            <div>
                                                {/* Attack Button */}
                                                <AttackButton 
                                                player={player} 
                                                card={card}
                                                players={players}
                                                updateTurnIndex={updateTurnIndex}
                                                attackDamage={attackDamage}
                                                setAttackDamage={setAttackDamage}
                                                />
                                            </div>
                                            :
                                            !attackDamage &&
                                            <div>
                                                {/* Regular Button */}
                                                <button
                                                onClick={() => nonAttackClick(card)}
                                                >
                                                    Play
                                                </button>
                                            </div>
                                        )
                                    }
                                    
                                </div>
                            )
                        })}
                        {
                            player.uid === currentPlayer.uid &&
                            getUid() === currentPlayer.uid &&
                            canDraw ?
                            <button
                             onClick={() => drawCardFromDeck(player)}
                            >
                            Deck (Can Draw)
                            </button>:
                            <div>
                                Deck (Cannot Draw)
                            </div>
                        }
                    </>
                }
                {
                !player.active &&
                player.uid === currentPlayer.uid &&
                getUid() === currentPlayer.uid &&
                <div>
                    {
                        players.filter(player => {
                            return player.active && 
                            player.hitpoints > 1
                        }).map((player, index: number) => {
                            return (
                                <div className="dead-attack-options-div" key={index}>
                                    <PlayerTarget 
                                    playerInfo={player} 
                                    handleShieldAttack={handleGhostShieldAttack} 
                                    handleAttack={handleGhostAttack}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            }
            </div>
        </div> 
    )
}