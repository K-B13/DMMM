import { useState } from "react"
import { Card } from "./classes/Card"
import { Player } from "./classes/Player"
import { componentIndex } from "./utility/componentsIndex"
import { specialMoves } from "./utility/specialMoves"

export const PowerCard = ({
    currentPlayer,
    card,
    players,
    updateTurnIndex
}: {
    currentPlayer: Player,
    card: Card,
    players: Player[],
    updateTurnIndex: () => void,
}) => {
    const [ hasOptions, setHasOptions ] = useState(false)

    const handleOptions = () => {
        setHasOptions(true)
    }

    const cancelButton = () => {
        setHasOptions(false)
    }

    const handleSpecialFunction = async () => {
        const specialFunction = specialMoves[card.name]
        await specialFunction(currentPlayer, players, card)
        console.log(currentPlayer, 'currentPlayer')
        if (currentPlayer.moves === 0) updateTurnIndex()
    }
    const Component = componentIndex[card.name]
    return (
        <div>
            {
                hasOptions ?
                    Component && <Component
                    currentPlayer={currentPlayer}
                    card={card}
                    players={players}
                    cancel={cancelButton}
                    updateTurnIndex={updateTurnIndex}
                    />
                    :
                    (
                        Component ?
                        <button
                        onClick={handleOptions}
                        >
                            Play
                        </button>:
                        <button onClick={handleSpecialFunction}>
                            Play
                        </button>
                    )
            }
            
        </div>
    )
}