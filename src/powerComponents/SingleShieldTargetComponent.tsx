import { Card } from "../classes/Card"
import { discard } from "../classes/Deck"
import { Player, removeFromHand } from "../classes/Player"
import { PowerPlayerCard } from "./powerHelperComponents/PowerPlayerCard"
import { CharacterName } from "../utility/characterBible"
import { characterClasses } from "../utility/characterColor"
import { writeValue } from "../utility/firebaseActions"
import { gameplayPlayerPath } from "../utility/firebasePaths"
import { specialMoves } from "../utility/specialMoves"
import { PowerShieldComponent } from "./powerHelperComponents/PowerShieldCard"
import { CardDisplay } from "../Arena"

export const SingleShieldTargetComponent = ({ 
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

    const handleSpecialFunction = async (playerInfo: Player, position: number) => {
        const specialFunction = specialMoves[card.name]
        await specialFunction(currentPlayer, playerInfo, position, card)
        if (currentPlayer.moves === 0) updateTurnIndex()
    }

    const validTargets = players.filter(
        p => p.active && p.uid !== currentPlayer.uid && p.activeShields.length > 0 && p.targetable
    )

    const handleNoTargets = async () => {
        currentPlayer.moves -= 1
        if (currentPlayer.moves === 0) updateTurnIndex()
        removeFromHand(card, currentPlayer)
        await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    }

    return (
        <div className="player-targets-div">
            <div className="target-interface">
                {
                    validTargets.map(playerInfo => {
                        return (
                            <div key={playerInfo.uid} className={`player-target ${characterClasses[playerInfo.deck.character as CharacterName]}`}>
                                <PowerPlayerCard playerInfo={playerInfo} />
                                <PowerShieldComponent playerInfo={playerInfo} handleSpecialFunction={handleSpecialFunction} />
                            </div>
                        )
                    })
                }
                {
                    validTargets.length === 0 && (
                        <div>
                            <p>No valid targets available.</p>
                            <button onClick={handleNoTargets}>
                                Play Anyway
                            </button>
                        </div>
                    )
                }
                <button onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}