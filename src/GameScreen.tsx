import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react"
import { Player, startingHand } from "./classes/Player"
import { shuffle } from "./classes/Deck"
import { writeValue } from "./utility/firebaseActions"
import { startDoor } from "./utility/firebasePaths"
import { onValue, ref } from "firebase/database"
import { db } from "./firebaseConfig"
import { Arena } from "./Arena"

export const GameScreen = ({ allPlayers, setAllPlayers }: { allPlayers: Player[], setAllPlayers: Dispatch<SetStateAction<Player[]>> }) => {
    const [ startGame, setGameStart ] = useState(false)
    const [ doorOpenStep, setDoorOpenStep ] = useState(0)
    const startedRef = useRef(false)

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
                    }, 1000)
                }, 100)
            }
        })
        return () => unsubscribe()
    }, [])
    return (
        <div>
            {
                startGame ?
                <div>
                    <Arena 
                    players={allPlayers} 
                    setPlayers={setAllPlayers}
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