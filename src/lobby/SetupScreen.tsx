import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { PlayerState } from "../App"
import { EntryPlayer } from "./EntryPlayer"
import { FirstTurn } from "./FirstTurn"
import { loadCharacterData } from "../utility/load"
import { CharacterName } from "../utility/characterBible"
import { createDeck } from "../classes/Deck"
import { createPlayer, Player } from "../classes/Player"
import { removeValue, writeValue } from "../utility/firebaseActions"
import { countdownStart, firstPlayer, gameplayPlayerPath, playerCharacterPath, playerPath, playerReadyPath, turnIndexPath } from "../utility/firebasePaths"
import { getUid } from "../utility/getUid"
import { onValue, ref } from "@firebase/database"
import { db } from "../firebaseConfig"
import { isCurrentPlayerHost } from "../utility/checkCurrentPlayerHost"

export const SetupScreen = ({ 
    playerSetup, 
    setPlayerSetup,
    exitSetupScreen,
    firstTurnPlayer,
    setFirstTurnPlayer 
}: { 
    playerSetup: PlayerState[], 
    setPlayerSetup: Dispatch<SetStateAction<PlayerState[]>>,
    exitSetupScreen: () => void,
    firstTurnPlayer: string,
    setFirstTurnPlayer: Dispatch<SetStateAction<string>>
}) => {
    const [ countDown, setCountDown ] = useState(6)

    const intervalIdRef = useRef<number | null>(null)
    // const allCharacters = ["Azzan", "Blorp", "Delilah Deathray", "Dr Tentaculous", "Hoots McGoots", "Lia", "Lord Cinderpuff", "Mimi LeChaise", "Oriax", "Sutha"]
const allCharacters = ["Azzan", "Dr Tentaculous", "Lia", "Oriax", "Sutha"]
    // Conecting the the firstPlayer Index in firebase
    useEffect(() => {
        const unsubscribe = onValue(ref(db, firstPlayer()), (snapshot) => {
        const index = snapshot.val();
        setFirstTurnPlayer(index);
    });
    return () => unsubscribe();
    }, [])

    useEffect(() => {
        const unsubscribe = onValue(ref(db, countdownStart()), (snapshot) => {
            const started = snapshot.val();
            if(started) {
                const timer = setInterval(() => {
                    setCountDown((prev) => {
                        if (prev === 1) {
                            clearInterval(timer)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
                intervalIdRef.current = timer
            } else {
                if (intervalIdRef) {
                    clearInterval(intervalIdRef.current!)
                    intervalIdRef.current = null
                }
                setCountDown(6)
            }
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (countDown === 0) {
            createPlayers()
            exitSetupScreen()
            writeValue(turnIndexPath(), 0);
        }
    }, [countDown])

    useEffect(() => {
        if (playerSetup.length > 1 && playerSetup.some(p => !p.ready)) {
            writeValue(countdownStart(), null);
        }
    }, [playerSetup])

    const handleCharacterChange = async (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
        const uid = getUid()
        if(!uid) return;
        await writeValue(playerCharacterPath(uid), e.target.value)
        // maybe remove this setting of the state
        setPlayerSetup(prevState => {
            return prevState.map(indivPrevState => {
                return indivPrevState.uid === uid ? { ...indivPrevState, character: e.target.value } : indivPrevState
            })
        })
    }

     const handleFirstPlayerSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        await writeValue(firstPlayer(), e.target.value)
        setFirstTurnPlayer(e.target.value)
    }

    const getDisabledCharacters = (index: number) => {
        return playerSetup
        .filter((_, i) => i !== index)
        .map(p => p.character)
        .filter(Boolean)
    }

    const handleCheckbox = async (readyStatus: boolean) => {
        const uid = getUid();
        if(!uid) return;
        await writeValue(playerReadyPath(uid), !readyStatus)
        setPlayerSetup(prevState => {
            return prevState.map(indivPrevState => {
                return indivPrevState.uid === uid ? { ...indivPrevState, ready: !readyStatus } : indivPrevState
            })
        })
    }

    const handlePlayerRemoval = async (player: PlayerState) => {
        await removeValue(playerPath(player.uid))
        setPlayerSetup((prevState: PlayerState[]) => {
            const newPlayers = [...prevState].filter((singlePlayer: PlayerState) => {
                return singlePlayer !== player
            })
            return newPlayers
        })
    }

    const createDecks = async (character: CharacterName) => {
        const characterCards = await loadCharacterData(character)
        return createDeck({cards: characterCards, character})
    }

    const createPlayers = async () => {
    const uid = getUid();
    const currentPlayer = playerSetup.find(p => p.uid === uid);
    if (!currentPlayer?.host) return; 

    const taken = playerSetup.map(p => p.character).filter(Boolean);
    const available = allCharacters.filter(c => !taken.includes(c));
    const orderedPlayers = [...playerSetup]

    const createdPlayers = await Promise.all(
      orderedPlayers.map(async (player) => {
        let assignedCharacter = player.character;

        if (!assignedCharacter) {
          const randomIndex = Math.floor(Math.random() * available.length);
          assignedCharacter = available.splice(randomIndex, 1)[0];
          await writeValue(playerCharacterPath(player.uid), assignedCharacter);
        }

        const deck = await createDecks(assignedCharacter as CharacterName);
        const created = createPlayer({
          name: player.name,
          uid: player.uid,
          host: player.host,
          deck,
        });

        return created;
      })
    );

  // Host writes full players to Firebase
  await Promise.all(
    createdPlayers.map(player =>
      writeValue(gameplayPlayerPath(player.uid), player)
    )
  );
};

    const handleCountDown = async () => {
        await writeValue(countdownStart(), true) 
    }

    const cancelCountDown = async () => {
        const uid = getUid()
        if (!uid) return;

        await writeValue(countdownStart(), null)
        await writeValue(playerReadyPath(uid), false)
        setPlayerSetup(prevState => {
            return prevState.map(indiv => 
                indiv.uid === uid ? { ...indiv, ready: false } : indiv
            );
        });
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
                    handleChange={handleCharacterChange} 
                    handleCheckbox={handleCheckbox}
                    getDisabledCharacters={getDisabledCharacters}
                    handlePlayerRemoval={handlePlayerRemoval}
                    playerSetup={playerSetup}
                    />
                })}
            </div>

            <FirstTurn 
            handleFirstPlayerSelect={handleFirstPlayerSelect} 
            playerSetup={playerSetup} 
            firstTurnPlayer={firstTurnPlayer}
            />
            
            {
                checkReadyToStart() ?
                <p
                className="not-all-ready"
                >Not all players are ready</p>
                : null
            }
                <div>                 
                    {
                        countDown === 6 ?
                        (
                            playerSetup.length > 1 &&
                            isCurrentPlayerHost(playerSetup) &&
                                <button
                                disabled={checkReadyToStart()}
                                onClick={handleCountDown}>
                                    Start
                                </button>
                        )
                        :
                        <p className="countdown-number">{countDown}</p>  
                    }            
                    {
                        countDown < 6 && countDown > 1 && (
                            <button 
                            className="cancel-countdown-button"
                            onClick={cancelCountDown}>
                                Cancel Countdown
                            </button>
                        )
                    }         
                </div>
        </div>
    )
}