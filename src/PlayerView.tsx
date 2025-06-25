import { useEffect } from "react"
import { CardDetails } from "./CardDetails"
import { Card } from "./classes/Card"
import { play, Player, startTurn } from "./classes/Player"
import { PlayerCard } from "./PlayerCard"
import { writeValue } from "./utility/firebaseActions"
import { gameplayPlayerActive, gameplayPlayerActiveShields, gameplayPlayerDeck, gameplayPlayerHand, gameplayPlayerHitpoints, gameplayPlayerMoves, turnIndexPath } from "./utility/firebasePaths"

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

    // useEffect(() => {
    //     if (player.uid === currentPlayer.uid) startTurn(player)
    // }, [turnIndex])

    return (
        <div>            
            <PlayerCard player={player} />
            <div className="player-hand card-array-div">
                {
                    player.active &&
                    player.hand.map((card: Card, index: number) => {
                        return (
                            <div key={index} className="card-details">
                                <CardDetails card={card} />
                                {
                                    player.uid === currentPlayer.uid && ( 
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
                    })
                }
            </div>
        </div> 
    )
}