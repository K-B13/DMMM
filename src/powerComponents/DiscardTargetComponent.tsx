import { CardDisplay } from "../Arena"
import { CardDetails } from "../CardDetails"
import { Card } from "../classes/Card"
import { heal, Player, removeFromHand } from "../classes/Player"
import { writeValue } from "../utility/firebaseActions"
import { gameplayPlayerPath } from "../utility/firebasePaths"
import { specialMoves } from "../utility/specialMoves"

export const DiscardTargetComponent = ({
    currentPlayer, 
    card,
    players,
    player,
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

    const handleSpecialFunction = async (position: number) => {
        const specialFunction = specialMoves[card.name]
        await specialFunction(currentPlayer, position, card)
        if (currentPlayer.moves === 0) updateTurnIndex()
    }

    const handleNoTargets = async () => {
        currentPlayer.moves -= 1
        heal(currentPlayer, 2)
        if (currentPlayer.moves === 0) updateTurnIndex()
        removeFromHand(card, currentPlayer)
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    }

    return (
         <div className="player-targets-div">
            <div className="target-interface">
                {
                    currentPlayer.deck.discardPile.length > 0 ?
                    currentPlayer.deck.discardPile.map((disCard, index) => {
                        return (
                            <div key={index}>
                                <CardDetails card={disCard} />
                                <button onClick={() => handleSpecialFunction(index)}>
                                    Choose
                                </button>
                            </div>
                        )
                    })
                     :
                    <div>
                        <p>No valid targets available.</p>
                        <button onClick={handleNoTargets}>
                            Play Anyway
                        </button>
                    </div>
                }
                <button onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}