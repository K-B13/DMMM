import { Dispatch, SetStateAction } from "react"
import { AttackButton } from "./AttackButton"
import { CardDetails } from "./CardDetails"
import { Card } from "./classes/Card"
import { Player } from "./classes/Player"
import { PlayerCard2 } from "./PlayerCard2"
import { ShieldDisplay } from "./ShieldDisplay"
import { PlayerTarget } from "./PlayerTarget"
import { CardDisplay } from "./Arena"
import { CharacterName } from "./utility/characterBible"
import { characterClasses } from "./utility/characterColor"

export const CurrentPlayerView = ({ 
    player, 
    currentPlayer, 
    canDraw,
    attackDamage,
    nonAttackClick,
    players,
    updateTurnIndex,
    setAttackDamage,
    drawCardFromDeck,
    handleGhostShieldAttack,
    handleGhostAttack,
    cardPlayed 
}: { 
    player: Player, 
    currentPlayer: Player, 
    canDraw: boolean,
    attackDamage: number,
    nonAttackClick: (card: Card) => void,
    players: Player[],
    updateTurnIndex: () => void,
    setAttackDamage: Dispatch<SetStateAction<number>>,
    drawCardFromDeck: (player: Player) => void,
    handleGhostShieldAttack: (i: number, tG: Player) => void,
    handleGhostAttack: (tG: Player) => void,
    cardPlayed: (c: CardDisplay | undefined) => void
}) => {
    return (
        <div className="current-player-div">
            <div className="stat-window">
                <PlayerCard2 player={player} isCurrentPlayer={true}/>
                <ShieldDisplay player={player} />
            </div>
            {
                player.active ?
                <div className="card-area-div current-player-card-area">
                    <div className={`discard-pile-div ${characterClasses[player.deck.character as CharacterName]}`}>
                        <button
                        className="discard-pile"
                        >Discard Pile {`${player.deck.discardPile.length} cards`}</button>
                    </div>
                    <div className="player-hand card-array-div">
                        {
                            player.active &&
                            player.hand.map((card: Card, pos: number) => {
                                const characterName = card.character as CharacterName
                                return (
                                    <div key={pos} className={`card-details-player ${characterClasses[characterName]}`}>
                                        <CardDetails card={card} />
                                        {
                                            player.uid === currentPlayer.uid &&
                                            !canDraw &&
                                            (
                                                card.attack ?
                                                <div>
                                                    <AttackButton
                                                    player={player}
                                                    card={card}
                                                    players={players}
                                                    updateTurnIndex={updateTurnIndex}
                                                    attackDamage={attackDamage}
                                                    setAttackDamage={setAttackDamage}
                                                    cardPlayed={cardPlayed}
                                                    />
                                                </div>
                                                :
                                                !attackDamage &&
                                                <div>
                                                    <button onClick={() => nonAttackClick(card)}>
                                                        Play
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={`deck-div ${characterClasses[player.deck.character as CharacterName]}`}>
                        {
                            player.uid === currentPlayer.uid &&
                            canDraw ?
                            <button
                            className="deck"
                             onClick={() => drawCardFromDeck(player)}
                            >
                            Draw
                            </button>:
                            <div className="cannot-draw-deck">
                                Deck{`\n${player.deck.cards.length}`} cards
                            </div>
                        }
                    </div>
                </div>:
                player.uid === currentPlayer.uid &&
                <div>
                    {
                        players.filter(player => {
                            return player.active &&
                            (player.hitpoints > 1 || player.activeShields.length > 0)
                        }).map((player: Player, index: number) => {
                            return (
                                <div className="dead-attack-options-div" key={index}>
                                    <PlayerTarget
                                    playerInfo={player}
                                    handleShieldAttack={handleGhostShieldAttack}
                                    handleAttack={handleGhostAttack}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}