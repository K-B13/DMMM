import { useState } from "react"
import { PlayerState } from "./App"
import { isCurrentPlayerHost } from "./utility/checkCurrentPlayerHost"

export const FirstTurn = ({
    handleFirstPlayerSelect,
    playerSetup,
    firstTurnPlayer

}: {
    handleFirstPlayerSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    playerSetup: PlayerState[],
    firstTurnPlayer: number
}) => {
    const [ selectTurnOrder, setSelectTurnOrder ] = useState(false)

    const handleClick = () => {
        setSelectTurnOrder(!selectTurnOrder)
    }

    const characterSelectionDisplay = (playerCharacter: string) => {
        return playerCharacter ? playerCharacter : 'Not Chosen'
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
                        {playerSetup[firstTurnPlayer].name} is going first.
                    </p>
                </div>
            {
                selectTurnOrder?
                <div className="whose-first-selection">
                    <select onChange={handleFirstPlayerSelect}>
                        <option>Please Select..</option>
                        {
                            playerSetup.map((player: PlayerState, index: number) => {
                                return <option value={index} key={index}>{`${index + 1}. ${player.name} (${characterSelectionDisplay(player.character)})`}</option>
                            })
                        }
                    </select>
                </div>:
                null
            }
        </div>
    )
}