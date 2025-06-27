import { signInAnonymously } from "firebase/auth";
import { get, onDisconnect, onValue, ref, set } from "firebase/database"
import { auth, db } from "./firebaseConfig";
import { useState, useEffect } from "react";
import { NameInput } from "./NameInput";
import { SetupScreen } from "./SetupScreen";
import { Player } from "./classes/Player";
import { updateValue } from "./utility/firebaseActions";
import { allPlayersPath, countdownStart, playerPath, startDoor, turnIndexPath } from "./utility/firebasePaths";
import { getUid } from "./utility/getUid";
import { GameScreen } from "./GameScreen";

export interface PlayerState {
    name: string;
    character: string;
    ready: boolean,
    uid: string,
    host: boolean,
    joinedAt: number
}

export const App = () => {
    const [ playerSetup, setPlayerSetup ] = useState<PlayerState[]>([])
    const [ showNameInput, setShowNameInput ] = useState(true)
    const [ allPlayers, setAllPlayers ] = useState<Player[]>([])
    const [ gameSetup, setGameSetup ] = useState(true)

    const exitSetupScreen = () => {
        setGameSetup(!gameSetup)
    }

    const checkHost = async () => {
        const snapshot = await get(ref(db, allPlayersPath()));
        const isFirst = !snapshot.exists();
        return isFirst
    }

    const addPlayer = async (name: string) => {
        if(!name) return
        try {
            // first we try to sign in anonymously
            const userCredentials = await signInAnonymously(auth)
            const uid = userCredentials.user.uid

            const isHost = await checkHost()
            // create a new player
            const newPlayer: PlayerState = {
                name: name,
                character: '',
                ready: false,
                uid: uid,
                host: isHost,
                joinedAt: Date.now()
            }

            // Write to /setup/players/{uid} 
            const playerRef = ref(db, playerPath(uid))
            await set(playerRef, newPlayer)
            const countDownRef = ref(db, countdownStart())
            const doorOpenRef = ref(db, startDoor())
            onDisconnect(playerRef).remove()
            onDisconnect(countDownRef).remove()
            onDisconnect(doorOpenRef).remove()

            setShowNameInput(false)
        } catch (err) {
            console.error('Failed to Join lobby:', err)
        }
    }

    useEffect(() => {
        const playerRef = ref(db, 'setup/players');
        const unsubscribe = onValue(playerRef, async (snapshot) => {
            const data = snapshot.val() as Record<string, PlayerState>
            if (!data) return
            const playerList: PlayerState[] = Object.values(data).sort((a, b) => a.joinedAt - b.joinedAt)

            const hasHost = playerList.some(p => p.host === true);

            if(!hasHost && playerList.length > 0) {
                const firstPlayerUid = playerList[0].uid;
                await updateValue(playerPath(firstPlayerUid), { host: true })
            }
            setPlayerSetup(playerList)
        });
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const uid = getUid()
        if (!uid) return;

        const stillExists = playerSetup.some(player => player.uid === uid);

        if (!stillExists) {
            setShowNameInput(true)
        }
    }, [playerSetup])

    // for development only
    const clearLobby = async () => {
        try {
          await set(ref(db, 'setup/'), null);
          await set(ref(db, 'gameState/'), null);
          console.log('Lobby cleared!');
        } catch (err) {
          console.error('Failed to clear lobby:', err);
        }
    };
    
    return (
        <main>
            <div className="heading">
                <img className='torch' src='/images/torch.png' alt="Torch Left" />
                <h1>Dungeon Mayhem Monster Madness</h1>
                <img className='torch' src='/images/torch.png' alt="Torch Left" />
            </div>

            {
                showNameInput ?
                <div>
                    <NameInput addPlayer={addPlayer} playerSetup={playerSetup}/>
                    <button onClick={clearLobby}>
                    🧹 Clear Lobby
                    </button>
                </div>    
                :
                <div>
                {
                    gameSetup ?
                        <SetupScreen 
                        playerSetup={playerSetup} 
                        setPlayerSetup={setPlayerSetup}
                        exitSetupScreen={exitSetupScreen}
                        />
                        :
                        <GameScreen 
                        allPlayers={allPlayers} 
                        setAllPlayers={setAllPlayers} 
                        exitGameScreen={exitSetupScreen}
                        />
                }
                </div>
            }
        </main>
    );
}