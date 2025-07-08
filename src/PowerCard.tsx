import { useState } from "react"
import { Card } from "./classes/Card"
import { Player } from "./classes/Player"
import { componentIndex } from "./utility/componentsIndex"

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
                    <button
                    onClick={handleOptions}
                    >
                        Play
                    </button>
            }
            
        </div>
    )
}