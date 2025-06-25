import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Player, startingHand } from "./classes/Player";
import { PlayerView } from "./PlayerView";
import { positionMap } from "./utility/positionMap";
import { getUid } from "./utility/getUid";
import { onValue, ref } from "firebase/database";
import { db } from "./firebaseConfig";
import { gameplayPlayerHand, turnIndexPath } from "./utility/firebasePaths";
import { writeValue } from "./utility/firebaseActions";

export const Arena = ({ players, setPlayers, startGame }: { players: Player[], setPlayers: Dispatch<SetStateAction<Player[]>>, startGame: boolean }) => {
    const [ turnIndex, setTurnIndex ] = useState(0)
    useEffect(() => {
        const initilizeHand = async () => {
            const updated = await Promise.all(players.map(async (player: Player) => {
                if (player.hand.length === 0) {
                    startingHand({ player })
                    await writeValue(gameplayPlayerHand(player.uid), player.hand);
                }
                return player
            }))
            setPlayers([ ...updated ]);
        }
        initilizeHand()
    }, [startGame])
    const positions = positionMap[players.length]

    useEffect(() => {
        const turnIndexRef = ref(db, turnIndexPath())
        const unsubscribe = onValue(turnIndexRef, (snapshot) => {
            const data = snapshot.val() as number;
            if(data === null || data === undefined) return;
            setTurnIndex(data)
        })
        return () => unsubscribe()
    }, [])

    const reframePlayers = (players: Player[]) => {
        const uid = getUid()
        if (!uid) return []
        const playerIndex = players.findIndex((player: Player) => player.uid === uid)
        const firstSection = players.slice(playerIndex)
        const secondSection = players.slice(0, playerIndex)
        console.log([...firstSection, ...secondSection])
        return [...firstSection, ...secondSection]
    }

    const updateTurnIndex = () => {
        const newIndex = (turnIndex + 1) % players.length
        writeValue(turnIndexPath(), newIndex)
    }

    return (
        <div className="player-grid">
            {
                reframePlayers(players).map((player: Player, index: number) => {
                    return (
                        <div className={`${positions[index]}`} key={index}>
                            <PlayerView
                            player={player}
                            turnIndex={turnIndex}
                            updateTurnIndex={updateTurnIndex}
                            currentPlayer={players[turnIndex]}
                            />
                        </div>
                    )
                })
            }
            <button
            onClick={() => console.log(players)}
            >Log</button>
            <button
            onClick={updateTurnIndex}
            >
                Update Turn
            </button>
        </div>
    )
}