import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react"
import { Player } from "./classes/Player"
import { getValue, writeValue } from "./utility/firebaseActions"
import { allGameplayPlayers, allPlayersPath, countdownStart, gameStatePath, playerReadyPath, startDoor, winnerPath } from "./utility/firebasePaths"
import { onValue, ref } from "firebase/database"
import { db } from "./firebaseConfig"
import { Arena } from "./Arena"

export const GameScreen = ({ allPlayers, setAllPlayers, exitGameScreen, firstTurnPlayer }: { allPlayers: Player[], setAllPlayers: Dispatch<SetStateAction<Player[]>>, exitGameScreen: () => void, firstTurnPlayer: string }) => {
    const [ startGame, setGameStart ] = useState(false)
    const [ doorOpenStep, setDoorOpenStep ] = useState(0)
    const [ winner, setWinner ] = useState<Player | undefined>(undefined)
    const startedRef = useRef(false)

    useEffect(() => {
        const playerRef = ref(db, allGameplayPlayers());
        const unsubscribe = onValue(playerRef, (snapshot) => {
          const data = snapshot.val() as Record<string, Player>;
          if (!data) return;
          const playerList: Player[] = Object.values(data);
          const players = playerList.map(player => {
            if (!player.hand) {
                player.hand = []
            }

            if (!player.deck.discardPile) {
                player.deck.discardPile = []
            }

            if (!player.activeShields) {
                player.activeShields = []
            }
             if (!player.deck.cards) {
                player.deck.cards = []
            }
            return player
          })
          setAllPlayers([...players]);
        });

        return () => unsubscribe();
    }, []);

    const handleGameStart = () => {
        setGameStart(true)
    }

    const startOpeningDoor = async () => {
        await writeValue(startDoor(), true)
    }

    useEffect(() => {
        const unsubscribe = onValue(ref(db, startDoor()), (snapshot) => {
            const shouldStart = snapshot.val()
            if (shouldStart && !startedRef.current) {
                startedRef.current = true
                let step = 0;
                const interval = setInterval(() => {
                    step++
                    setDoorOpenStep(step)
                    if (step >= 7) {
                        clearInterval(interval)
                    }
                    setTimeout(() => {
                        handleGameStart()
                    }, 2000)
                }, 100)
            }
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const unsubscribe = onValue(ref(db, winnerPath()), (snapshot) => {
            const data = snapshot.val()
            if (!data) return
            setWinner(data)
        })
        return () => unsubscribe()
    }, [])

    const goToLobby = async () => {
        await writeValue(gameStatePath(), null)
        await writeValue(startDoor(), 0)
        await writeValue(countdownStart(), null)

        const playerSetupReadyValues = await getValue(allPlayersPath())
        const data = await playerSetupReadyValues.val()
        await Promise.all(
            Object.entries(data).map(([uid]) => {
                writeValue(playerReadyPath(uid), false)

            })
        )
        
        setGameStart(false)
        startedRef.current = false
        exitGameScreen()
        
    }

    return (
        <div className="game-screen">
            {
                startGame ?
                (!winner ? <div className="arena-div">
                    <Arena 
                    players={allPlayers} 
                    setPlayers={setAllPlayers}
                    startGame={startGame}
                    firstTurnPlayer={firstTurnPlayer}
                    />
                </div>:
                <div>
                    <p>{`${winner.name} - ${winner.deck.character}`} WINS</p>
                    <button
                    onClick={goToLobby}
                    >Lobby</button>
                </div>    
                )
                :
                <div>
                    <div className="door-animation-container">
                        <img 
                          src={`/images/door_${doorOpenStep}.png`} 
                          alt="Opening door"
                          className="door-image"
                        />
                    </div>
                    <div className="begin-game-btn">
                        <button
                        onClick={startOpeningDoor}
                        >
                            Enter the Dungeon
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}