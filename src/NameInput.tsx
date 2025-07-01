import { useState } from "react"
import { PlayerState } from "./App"

export const NameInput = ({ addPlayer, playerSetup }: { addPlayer: (name: string) => void, playerSetup: PlayerState[] }) => {
    const [ nameInput, setNameInput ] = useState('')
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(e.target.value)
    }
    return (
        <div className="name-input-div">
            <input className="name-input" value={nameInput} onChange={handleChange}/>
            <button disabled={!(playerSetup.length < 6)} onClick={()=> addPlayer(nameInput)}>Join</button>
            {
                playerSetup.length < 6 ?
                    null: <p>Lobby is Full</p>
            }
        </div>
    )
}