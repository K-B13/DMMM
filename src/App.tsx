import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import { NameInput } from "./NameInput";
import { SetupScreen } from "./SetupScreen";

export interface PlayerState {
    name: string;
    character: string;
    ready: boolean,
    // uid: string,
    host: boolean
}

export const App = () => {
    const [ playerSetup, setPlayerSetup ] = useState<PlayerState[]>([])
    const [ showNameInput, setShowNameInput ] = useState(true)

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //         }
    //     })
    //     return () => unsubscribe()
    // }, [])

    // const handleChange = () => {

    // }

    const addPlayer = (name: string) => {
        if(!name) return
        const newPlayer: PlayerState = {
            name: name,
            character: '',
            ready: false,
            host: playerSetup.length === 0
        }
        setPlayerSetup([...playerSetup, newPlayer])
        setShowNameInput(false)
    }
    
    return (
        <main>
            <div className="heading">
                <img className='torch' src='/images/torch.png' alt="Torch Left" />
                <h1>Dungeon Mayhem Monster Madness</h1>
                <img className='torch' src='/images/torch.png' alt="Torch Left" />
            </div>

            {
                showNameInput ?
                <NameInput addPlayer={addPlayer} playerSetup={playerSetup}/>:
                <div>
                    <SetupScreen playerSetup={playerSetup} setPlayerSetup={setPlayerSetup}/>
                </div>
            }
        </main>
    );
}