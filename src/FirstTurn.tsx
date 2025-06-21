import { useState } from "react"
import { PlayerState } from "./App"

export const FirstTurn = ({
    handleFirstPlayerSelect,
    playerSetup

}: {
    handleFirstPlayerSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    playerSetup: PlayerState[]
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
            <div className="choose-whose-first">
                <div className="choose-whose-first-para">
                    <p>Choose who goes first</p>
                </div>
                <button onClick={handleClick}>
                    Select
                </button>
            </div>
            {
                selectTurnOrder?
                <div className="whose-first-selection">
                    <select>
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