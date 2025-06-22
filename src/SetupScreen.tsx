import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { PlayerState } from "./App"
import { EntryPlayer } from "./EntryPlayer"
import { FirstTurn } from "./FirstTurn"
import { loadCharacterData } from "./utility/load"
import { CharacterName } from "./utility/characterBible"
import { createDeck } from "./classes/Deck"
import { createPlayer, Player } from "./classes/Player"

export const SetupScreen = ({ 
    playerSetup, 
    setPlayerSetup,
    acquireAllPlayerData 
}: { 
    playerSetup: PlayerState[], 
    setPlayerSetup: Dispatch<SetStateAction<PlayerState[]>>,
    acquireAllPlayerData: (players: Player[]) => void 
}) => {
    const [ firstTurnPlayer, setFirstTurnPlayer ] = useState(0)
    const [ countDown, setCountDown ] = useState(4)
    const [ intervalId, setIntervalId ] = useState(0)
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

    const reorderBasedOnTurnOrder = () => {
        if (firstTurnPlayer === 0) return [...playerSetup]
        const firstGrouping = playerSetup.slice(firstTurnPlayer)
        const secondGrouping = playerSetup.slice(0, firstTurnPlayer)
        const newOrder = [...firstGrouping, ...secondGrouping]
        return [...newOrder]
    }

    const createDecks = async (character: CharacterName) => {
        const characterCards = await loadCharacterData(character)
        return createDeck({cards: characterCards, character})
    }

     const createPlayers = async () => {
        const taken = playerSetup.map(p => p.character).filter(Boolean)
        const available = allCharacters.filter(c => !taken.includes(c))
        
        const orderedPlayers = reorderBasedOnTurnOrder()
        const createdPlayers = await Promise.all(
            orderedPlayers.map( async (player) => {
                if(player.character === "") {
                    const randomIndex = Math.floor(Math.random() * available.length)
                    const assigned = available.splice(randomIndex, 1)[0]
                    player.character = assigned
                }
                const playerDeck = await createDecks(player.character as CharacterName)
                const createdPlayer = createPlayer({ name: player.name, host: player.host, deck: playerDeck })
                return createdPlayer
        }))
        acquireAllPlayerData([...createdPlayers])
    }

    const handleCountDown = () => {
        const timer = setInterval(countDownFunction, 1000)
        setIntervalId(timer)
        
    }

    useEffect(() => {
        if (countDown === 0) {
            clearInterval(intervalId)
            createPlayers()
        }
    }, [countDown])

    const countDownFunction = () => {
            setCountDown(prevState => {
                console.log(prevState)
                const newState = prevState - 1
                return newState
            })
    }

    const checkReadyToStart = () => {
        const check = playerSetup.length > 1 && playerSetup.filter(player => {
            return player.ready === false
        }).length > 0
        return check
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

            <FirstTurn handleFirstPlayerSelect={handleFirstPlayerSelect} playerSetup={playerSetup} />
            
            {
                checkReadyToStart() ?
                <p>Not all players are ready</p>
                : null
            }
                <div>                 
                    {
                        countDown === 4 ?
                        (
                            playerSetup.length > 1 &&
                                <button
                                disabled={checkReadyToStart()}
                                onClick={handleCountDown}>
                                    Start
                                </button>):
                        <p>{countDown}</p>  
                    }                     
                </div>
        </div>
    )
}