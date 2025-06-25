import { useEffect, useState } from "react"
import { CardDetails } from "./CardDetails"
import { Card } from "./classes/Card"
import { Player, startTurn } from "./classes/Player"
import { PlayerCard } from "./PlayerCard"
import { updateValue } from "./utility/firebaseActions"
import { gameplayPlayerActive, gameplayPlayerPath, gameplayPlayerActiveShields, gameplayPlayerDeck, gameplayPlayerHand, gameplayPlayerHitpoints, turnIndexPath } from "./utility/firebasePaths"
import { getUid } from "./utility/getUid"

export const PlayerView = ({ 
    player, 
    turnIndex,
    updateTurnIndex,
    currentPlayer
}: { 
    player: Player, 
    turnIndex: number,
    updateTurnIndex: () => void,
    currentPlayer: Player
}) => {

    // const nonAttackClick = async (card: Card) => {
    //     play(player, card)

    //     if (player.moves === 0) {
    //         updateTurnIndex()
    //     }
    //     await writeValue(gameplayPlayerHand(player.uid), player.hand)
    //     await writeValue(gameplayPlayerDeck(player.uid), player.deck)
    //     await writeValue(gameplayPlayerMoves(player.uid), player.moves);
    //     await writeValue(gameplayPlayerHitpoints(player.uid), player.hitpoints);
    //     await writeValue(gameplayPlayerActive(player.uid), player.active);
    //     await writeValue(gameplayPlayerActiveShields(player.uid), player.activeShields);

    // }
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
                                                <button>Attack</button>
                                            </div>
                                            :
                                            <div>
                                                {/* Regular Button */}
                                                <button
                                                // onClick={() => nonAttackClick(card)}
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