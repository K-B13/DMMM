import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Player, startingHand } from "./classes/Player";
import { PlayerView } from "./PlayerView";
import { positionMap } from "./utility/positionMap";
import { getUid } from "./utility/getUid";
import { onValue, ref } from "firebase/database";
import { db } from "./firebaseConfig";
import { currentCardPath, gameplayPlayerDeck, gameplayPlayerHand, turnIndexPath } from "./utility/firebasePaths";
import { writeValue } from "./utility/firebaseActions";
import { CurrentTurnDisplay } from "./CurrentTurnDisplay";
import { Card } from "./classes/Card";
import { findPlayerIndex } from "./utility/findPlayer";
import { isCurrentPlayerHost } from "./utility/checkCurrentPlayerHost";

export interface CardDisplay {
    currentCard: Card,
    cardOwner: Player
}

export const Arena = ({ 
    players,
    setPlayers, 
    startGame,
    firstTurnPlayer
}: { 
    players: Player[], 
    setPlayers: Dispatch<SetStateAction<Player[]>>, 
    startGame: boolean,
    firstTurnPlayer: string
}) => {
    
    const [ turnIndex, setTurnIndex ] = useState(0)
    const [ currentCardDisplay, setCurrentCardDisplay ] = useState<CardDisplay | undefined>(undefined)

    useEffect(() => {
        const initilizeHand = async () => {
            const updated = await Promise.all(players.map(async (player: Player) => {
                if (player.hand.length === 0) {
                    startingHand({ player })
                    await writeValue(gameplayPlayerHand(player.uid), player.hand);
                    await writeValue(gameplayPlayerDeck(player.uid), player.deck)
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

    useEffect(() => {
        const previousCardPlayedRef = ref(db, currentCardPath())
        const unsubscribe = onValue(previousCardPlayedRef, (snapshot) => {
            const data = snapshot.val() ;
            setCurrentCardDisplay(data)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (isCurrentPlayerHost(players)) {
            const playerIndex = findPlayerIndex(players, firstTurnPlayer)
            writeValue(turnIndexPath(), playerIndex)
        }
    }, [startGame])

    const reframePlayers = (players: Player[]) => {
        const uid = getUid()
        if (!uid) return []
        const playerIndex = players.findIndex((player: Player) => player.uid === uid)
        const firstSection = players.slice(playerIndex)
        const secondSection = players.slice(0, playerIndex)
        return [...firstSection, ...secondSection]
    }

    const updateTurnIndex = () => {
        const newIndex = (turnIndex + 1) % players.length
        writeValue(turnIndexPath(), newIndex)
    }

    const cardPlayed = async (data: CardDisplay | undefined) => {
        if (data === undefined) {
            await writeValue(currentCardPath(), null)
            return
        }
        await writeValue(currentCardPath(), data)
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
                            players={players}
                            cardPlayed={cardPlayed}
                            />
                        </div>
                    )
                })
            }
            <div className="center">
                {
                    currentCardDisplay &&
                    <CurrentTurnDisplay 
                    currentCardDisplay={currentCardDisplay}
                    />
                }
            </div>
            <button
            onClick={() => console.log(players, 'players', turnIndex, 'turnIndex')}
            >Log</button>
        </div>
    )
}