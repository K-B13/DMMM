export const CharacterSelection = ({
    selectedCharacter, 
    handleChange,
    disabledCharacters,
    allCharacters,
    position    
}: {
    selectedCharacter: string, 
    handleChange: (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => void,
    disabledCharacters: string[],
    allCharacters: string[],
    position: number    
}) => {
    return (
        <select name='character' value={selectedCharacter} onChange={handleChange}>
            <option value='Random'>Select Character...</option>
            {
                allCharacters.map((character: string, index: number) => {
                    return <option value={character} key={index} disabled={disabledCharacters.includes(character)} >{character}</option>        
                })
            }
        </select>
    )
}