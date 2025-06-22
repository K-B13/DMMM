import { signInAnonymously } from "firebase/auth";
import { get, onValue, ref, set } from "firebase/database"
import { auth, db } from "./firebaseConfig";
import { useState, useEffect } from "react";
import { NameInput } from "./NameInput";
import { SetupScreen } from "./SetupScreen";
import { Player } from "./classes/Player";

export interface PlayerState {
    name: string;
    character: string;
    ready: boolean,
    uid: string,
    host: boolean
}

export const App = () => {
    const [ playerSetup, setPlayerSetup ] = useState<PlayerState[]>([])
    const [ showNameInput, setShowNameInput ] = useState(true)
    const [ allPlayers, setAllPlayers ] = useState<Player[]>([])

    const acquireAllPlayerData = (players: Player[]) => {
        setAllPlayers([ ...players ])
    }

    const checkHost = async () => {
        const snapshot = await get(ref(db, 'setup/players'));
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
                host: isHost
            }

            // Write to /setup/players/{uid} 
            await set(ref(db, `setup/players/${uid}`), newPlayer)
            setShowNameInput(false)
        } catch (err) {
            console.error('Failed to Join lobby:', err)
        }
    }

    useEffect(() => {
        const playerRef = ref(db, 'setup/players');
        const unsubscribe = onValue(playerRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                const playerList: PlayerState[] = Object.values(data)
                setPlayerSetup(playerList)
            }
        });
        return () => unsubscribe()
    }, [])

    // for development only
    const clearLobby = async () => {
        try {
          await set(ref(db, 'setup/players'), null);
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
                    <SetupScreen 
                    playerSetup={playerSetup} 
                    setPlayerSetup={setPlayerSetup}
                    acquireAllPlayerData={acquireAllPlayerData}
                    />
                </div>
            }
        </main>
    );
}