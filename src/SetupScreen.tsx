import { Dispatch, SetStateAction, useState } from "react"
import { PlayerState } from "./App"
import { EntryPlayer } from "./EntryPlayer"
import { FirstTurn } from "./FirstTurn"

export const SetupScreen = ({ playerSetup, setPlayerSetup }: { playerSetup: PlayerState[], setPlayerSetup: Dispatch<SetStateAction<PlayerState[]>> }) => {
    const [ firstTurnPlayer, setFirstTurnPlayer ] = useState(0)
    const allCharacters = ["Azzan", "Blorp", "Delilah Deathray", "Dr Tentaculous", "Hoots McGoots", "Lia", "Lord Cinderpuff", "Mimi LeChaise", "Oriax", "Sutha"]

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, position: number) => {
        setPlayerSetup((prevState: PlayerState[]) => {
            const updated = [...prevState]
            updated[position] = {... updated[position], [e.target.name]: e.target.value}
            return updated
    })}

     const handleFirstPlayerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFirstTurnPlayer(parseInt(e.target.value))
    }

    const getDisabledCharacters = (index: number) => {
        return playerSetup
        .filter((_, i) => i !== index)
        .map(p => p.character)
        .filter(Boolean)
    }

    const handleCheckbox = (readyStatus: boolean, position: number) => {
        setPlayerSetup(prevState => {
            const updated = [...prevState]
            updated[position] = {... updated[position], ['ready']: !readyStatus}
            return updated
        })
    }

    const handlePlayerRemoval = (player: PlayerState) => {
        setPlayerSetup((prevState: PlayerState[]) => {
            const newPlayers = [...prevState].filter((singlePlayer: PlayerState) => {
                return singlePlayer !== player
            })
            return newPlayers
        })
    }

    return (
        <div className="selection-screen">
            <div className="entryBoard">
                {playerSetup.map((player: PlayerState, index: number) => {
                    return <EntryPlayer 
                    player={player} 
                    key={index} 
                    position={index} 
                    allCharacters={allCharacters} 
                    handleChange={handleChange} 
                    handleCheckbox={handleCheckbox}
                    getDisabledCharacters={getDisabledCharacters}
                    handlePlayerRemoval={handlePlayerRemoval}
                    />
                })}
            </div>

            <button
                onClick={() => {
                    if (playerSetup.length >= 6) return
                    const playerToAdd = {
                        name: 'Player',
                        character: '',
                        ready: false,
                        host: playerSetup.length === 0
                    }

                    setPlayerSetup(prevSetup => {
                        return [ ...prevSetup, playerToAdd ]
                    })
                }}
            >Add Player</button>

            <FirstTurn handleFirstPlayerSelect={handleFirstPlayerSelect} playerSetup={playerSetup} />
            
            {
                playerSetup.filter(player => {
                    console.log(player.ready)
                    return player.ready === false
                }).length > 0 ?
                <p>Not all players are ready</p>
                :
                <button>Start</button>
            }
        </div>
    )
}