import { Dispatch, SetStateAction, useEffect } from "react";
import { Player, startingHand } from "./classes/Player";
import { PlayerView } from "./PlayerView";

export const Arena = ({ players, setPlayers }: { players: Player[], setPlayers: Dispatch<SetStateAction<Player[]>> }) => {
    useEffect(() => {
        const updated = players.map((player: Player) => {
                startingHand({ player })
                return player
            });
            setPlayers([ ...updated ]);
    }, [])

    return (
        <div>
            {
                players.map((player: Player, index: number) => {
                    return <PlayerView player={player} key={index} />
                })
            }
        </div>
    )
}