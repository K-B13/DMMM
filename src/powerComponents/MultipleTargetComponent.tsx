import { useState } from "react";
import { Card } from "../classes/Card";
import { Player } from "../classes/Player";
import { CharacterName } from "../utility/characterBible";
import { characterClasses } from "../utility/characterColor";
import { specialMoves } from "../utility/specialMoves";
import { PowerPlayerCard } from "./powerHelperComponents/PowerPlayerCard";
import { CardDisplay } from "../Arena";

export const MultipleTargetComponent = ({ 
    currentPlayer,
    card,
    players,
    cancel,
    updateTurnIndex,
    cardPlayed
}: {
    currentPlayer: Player, 
    card: Card,
    players: Player[],
    player: Player,
    cancel: () => void,
    updateTurnIndex: () => void,
    cardPlayed: (c: CardDisplay | undefined) => void
}) => {
    const [ firstOption, setFirstOption ] = useState<Player | null>(null)
    const validTargets = players.filter(
        p => p.active && (firstOption ? firstOption.uid !== p.uid: true)
    )

    const handleSpecialFunction = async (player: Player) => {
        const specialFunction = specialMoves[card.name]
        await specialFunction(currentPlayer, firstOption, player, card)
        setFirstOption(null)
        if (currentPlayer.moves === 0) updateTurnIndex()
    }
    return (
        <div className="player-targets-div">
            <div className="target-interface">
                {firstOption ? <p>{firstOption.name} selected to change</p>: <p>Select whose HP you want to change</p>}
                {
                    validTargets.map(player => {
                        return (
                            <div key={player.uid} className={`player-target ${characterClasses[player.deck.character as CharacterName]}`}>
                                <PowerPlayerCard playerInfo={player} />
                                {
                                    <button
                                        onClick={() => {
                                            firstOption ?
                                            handleSpecialFunction(player)
                                            :
                                            setFirstOption(player)
                                            }}>
                                            Choose
                                    </button>
                                    }
                            </div>
                        )
                    })
                }
                <button onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}