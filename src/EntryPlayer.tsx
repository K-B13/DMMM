import { PlayerState } from "./App"
import { CharacterSelection } from "./CharacterSelection"
import { auth } from "./firebaseConfig"
import { isCurrentPlayerHost } from "./utility/checkCurrentPlayerHost"
import { getUid } from "./utility/getUid"

export const EntryPlayer = ({ 
    player, 
    position, 
    allCharacters, 
    handleChange,
    handleCheckbox,
    handlePlayerRemoval,
    getDisabledCharacters,
    playerSetup 
}: { 
    player: PlayerState, 
    position: number, 
    allCharacters: string[], 
    handleChange: (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => void,
    handleCheckbox: (readyStatus: boolean) => void,
    handlePlayerRemoval: (player: PlayerState) => void,
    getDisabledCharacters: (index: number) => string[],
    playerSetup: PlayerState[] 
}) => {

    
    
    return (
        <div className="characterRow">
            <div className="checkbox">
                {
                    auth.currentUser?.uid === player.uid ?
                    <input 
                    onChange={() => {
                        handleCheckbox(player.ready)
                    }} 
                    name='ready' 
                    type='checkbox'
                    />:
                    <p className="player-ready-text">{player.ready ? 'Ready': 'Not Ready'}</p>
                }
            </div>
            <div className="player-name">
                <div className="player-position-entry-screen">
                    <p>{position + 1}.</p>
                </div>
                <p>{player.name}</p>

            </div>
            <div className="select-character-div">
                {
                    getUid() === player.uid ?
                    <CharacterSelection 
                    allCharacters={allCharacters} 
                    handleChange={handleChange} 
                    disabledCharacters={getDisabledCharacters(position)} 
                    selectedCharacter={player.character}/>
                    :
                    <p className="character-para">{player.character ? player.character: 'Random'}</p>
                }
                {/* Check the uid of the host rather than who is host. */}
                {
                    isCurrentPlayerHost(playerSetup) && !player.host ?
                    <button onClick={() => handlePlayerRemoval(player)}
                    className="remove-player-btn"
                    >X</button> :
                    null
                }
            </div>
        </div>
    )
}