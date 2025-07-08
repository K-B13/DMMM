import { Card } from "../classes/Card"
import { Player } from "../classes/Player"
import { CharacterName } from "../utility/characterBible"
import { characterClasses } from "../utility/characterColor"
import { specialMoves } from "../utility/specialMoves"

export const SingleShieldTargetComponent = ({ 
    currentPlayer,
    card,
    players,
    cancel,
    updateTurnIndex 
}: {
    currentPlayer: Player, 
    card: Card,
    players: Player[],
    player: Player,
    cancel: () => void,
    updateTurnIndex: () => void,
}) => {

    const handleSpecialFunction = async (playerInfo: Player, position: number) => {
        const specialFunction = specialMoves[card.name]
        await specialFunction(currentPlayer, playerInfo, position, card)
        if (currentPlayer.moves === 0) updateTurnIndex()
    }

    // const validTargets = players.filter(
    //     p => p.active && p.uid !== currentPlayer.uid && p.activeShields.length > 0
    // )

    return (
        <div className="player-targets-div">
            <div className="target-interface">
                {
                    players.map(playerInfo => {
                        if (playerInfo.active && playerInfo.activeShields.length > 0 && playerInfo.uid !== currentPlayer.uid) {
                            return (
                                <div key={playerInfo.uid} className={`player-target ${characterClasses[playerInfo.deck.character as CharacterName]}`}>
                                    <div className="target-player-data">
                                        <p>{playerInfo.name} - {playerInfo.deck.character}</p>
                                        <p>HP: {playerInfo.hitpoints}</p>
                                    </div>
                                    <div className="shield-div card-array-div">
                                        {
                                            playerInfo.activeShields.map((shield, index: number) => {
                                                return (
                                                    <div key={index} className="target-shields">
                                                        <p>{shield.card.name}</p>
                                                        <div className="shields">
                                                        {[...Array(shield.card.shield).keys()].map(num => {
                                                            if (num < shield.hp) {
                                                                return <img key={num} src={`images/shield_alive.png`} height='30rem' width='30rem' />
                                                            }
                                                        return <img key={num} src={`images/shield_dead.png`} height='30rem' width='30rem' />
                                                        })}
                                                        </div>
                                                            <button
                                                            onClick={() => handleSpecialFunction(playerInfo, index)}
                                                            >Choose</button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }
                    })
                }
                {
                    <button onClick={cancel}>
                        Cancel
                    </button>
                }
            </div>
        </div>
    )
}