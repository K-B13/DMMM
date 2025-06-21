import { PlayerState } from "./App"
import { CharacterSelection } from "./CharacterSelection"

export const EntryPlayer = ({ 
    player, 
    position, 
    allCharacters, 
    handleChange,
    handleCheckbox,
    handlePlayerRemoval,
    getDisabledCharacters 
}: { 
    player: PlayerState, 
    position: number, 
    allCharacters: string[], 
    handleChange: (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, p: number) => void,
    handleCheckbox: (readyStatus: boolean, position: number) => void,
    handlePlayerRemoval: (player: PlayerState) => void,
    getDisabledCharacters: (index: number) => string[] 
}) => {

    
    
    return (
        <div className="characterRow">
            <div className="checkbox">
                <input onChange={() => {
                    handleCheckbox(player.ready, position)
                }} 
                name='ready' 
                type='checkbox'
                
                />
            </div>
            <div className="player-name">
                <div className="player-position-entry-screen">
                    <p>{position + 1}.</p>
                </div>
                <p>{player.name}</p>

            </div>
            <div className="select-character-div">
                <CharacterSelection allCharacters={allCharacters} handleChange={handleChange} disabledCharacters={getDisabledCharacters(position)} position={position} selectedCharacter={player.character}/>
                {/* Check the uid of the host rather than who is host. */}
                {/* {
                    player.host ?
                    <button onClick={() => handlePlayerRemoval(player)}
                    className="remove-player-btn"
                    >X</button> :
                    null
                } */}
            </div>
        </div>
    )
}