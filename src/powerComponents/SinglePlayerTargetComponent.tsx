import { CardDisplay } from "../Arena";
import { Card } from "../classes/Card";
import { Player } from "../classes/Player";
import { CharacterName } from "../utility/characterBible";
import { characterClasses } from "../utility/characterColor";
import { specialMoves } from "../utility/specialMoves";
import { PowerPlayerCard } from "./powerHelperComponents/PowerPlayerCard";

export const SinglePlayerTargetComponent = ({ 
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
    const validTargets = players.filter(
        p => p.active && p.uid !== currentPlayer.uid
    )

    const handleSpecialFunction = async (player: Player) => {
        const specialFunction = specialMoves[card.name]
        await specialFunction(currentPlayer, player, card)
        if (currentPlayer.moves === 0) updateTurnIndex()
    }
    return (
        <div className="player-targets-div">
            <div className="target-interface">
                {
                    validTargets.map(player => {
                        return (
                            <div key={player.uid} className={`player-target ${characterClasses[player.deck.character as CharacterName]}`}>
                                <PowerPlayerCard playerInfo={player} />
                                <p>{player.hand.length} Card{player.hand.length !== 1 && 's'}</p>
                                <button
                                onClick={() => handleSpecialFunction(player)}>
                                    Choose
                                </button>
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