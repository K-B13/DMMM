import { useState } from "react"
import { PlayerState } from "../App"
import { isCurrentPlayerHost } from "../utility/checkCurrentPlayerHost"
import { findPlayer } from "../utility/findPlayer"

export const FirstTurn = ({
    handleFirstPlayerSelect,
    playerSetup,
    firstTurnPlayer

}: {
    handleFirstPlayerSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    playerSetup: PlayerState[],
    firstTurnPlayer: string
}) => {
    const [ selectTurnOrder, setSelectTurnOrder ] = useState(false)

    const handleClick = () => {
        setSelectTurnOrder(!selectTurnOrder)
    }

    const characterSelectionDisplay = (playerCharacter: string) => {
        return playerCharacter ? playerCharacter : 'Not Chosen'
    }

    const displayFirstPlayer = () => {
        const player = findPlayer(playerSetup, firstTurnPlayer)
        if (player) return `${player.name} is going first.`
        return 'Random player will go first'
    }

    
    return (
        <div className="choose-whose-first-div">
            {
                isCurrentPlayerHost(playerSetup) &&
                <div className="choose-whose-first">
                    <div className="choose-whose-first-para">
                        <p>Choose who goes first</p>
                    </div>
                    <button onClick={handleClick}>
                        Select
                    </button>
                </div>
            }
                <div className="first-turn-display-div">
                    <p className="first-turn-display">
                        { displayFirstPlayer() }
                    </p>
                </div>
            {
                selectTurnOrder?
                <div className="whose-first-selection">
                    <select onChange={handleFirstPlayerSelect}>
                        <option>Please Select..</option>
                        {
                            playerSetup.map((player: PlayerState, index: number) => {
                                return <option value={player.uid} key={index}>{`${index + 1}. ${player.name} (${characterSelectionDisplay(player.character)})`}</option>
                            })
                        }
                    </select>
                </div>:
                null
            }
        </div>
    )
}