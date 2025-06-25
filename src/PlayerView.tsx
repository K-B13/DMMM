import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CardDetails } from "./CardDetails"
import { Card } from "./classes/Card"
import { play, Player, startTurn } from "./classes/Player"
import { PlayerCard } from "./PlayerCard"
import { updateValue } from "./utility/firebaseActions"
import { gameplayPlayerPath } from "./utility/firebasePaths"
import { getUid } from "./utility/getUid"
import { AttackButton } from "./AttackButton"

export const PlayerView = ({ 
    player, 
    turnIndex,
    updateTurnIndex,
    currentPlayer,
    players,
    activeCard,
    setActiveCard
}: { 
    player: Player, 
    turnIndex: number,
    updateTurnIndex: () => void,
    currentPlayer: Player,
    players: Player[],
    activeCard: boolean,
    setActiveCard: Dispatch<SetStateAction<boolean>>
}) => {

    const nonAttackClick = async (card: Card) => {
        play(player, card)

        if (player.moves === 0) {
            updateTurnIndex()
        }
        await updateValue(gameplayPlayerPath(player.uid), player)

    }
    const [ canDraw, setCanDraw ] = useState(false)

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
                                    <CardDetails card={card} />
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
                                                activeCard={activeCard}
                                                setActiveCard={setActiveCard}
                                                />
                                            </div>
                                            :
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
            </div>
        </div> 
    )
}