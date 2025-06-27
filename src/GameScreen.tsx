import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react"
import { Player } from "./classes/Player"
import { writeValue } from "./utility/firebaseActions"
import { allGameplayPlayers, startDoor } from "./utility/firebasePaths"
import { onValue, ref } from "firebase/database"
import { db } from "./firebaseConfig"
import { Arena } from "./Arena"

export const GameScreen = ({ allPlayers, setAllPlayers, exitGameScreen }: { allPlayers: Player[], setAllPlayers: Dispatch<SetStateAction<Player[]>>, exitGameScreen: () => void }) => {
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

    // useEffect(() => {
    //     const winner = checkForWinner(allPlayers)
    //       if (winner) {
    //         console.log(`${winner.name} is the winner!`)
    //         // alert(`${winner} has won the game`)
    //         // exitGameScreen()
    //     }
    // }, [allPlayers])

    // const checkForWinner = (players: Player[]) => {
    //     if (players.length === 0) return null
    //     const alive = players.filter(p => p.active)
    //     return alive.length === 1 ? alive[0]: null
    // }

    return (
        <div>
            {
                startGame ?
                <div>
                    <Arena 
                    players={allPlayers} 
                    setPlayers={setAllPlayers}
                    startGame={startGame}
                    />
                </div>
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