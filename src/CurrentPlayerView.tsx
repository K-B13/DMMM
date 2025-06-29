import { Dispatch, SetStateAction } from "react"
import { AttackButton } from "./AttackButton"
import { CardDetails } from "./CardDetails"
import { Card } from "./classes/Card"
import { Player } from "./classes/Player"
import { PlayerCard2 } from "./PlayerCard2"
import { ShieldDisplay } from "./ShieldDisplay"
import { PlayerTarget } from "./PlayerTarget"

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
    handleGhostAttack 
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
    handleGhostAttack: (tG: Player) => void
}) => {
    return (
        <div className="current-player-div">
            <div className="stat-window">
                <PlayerCard2 player={player} />
                <ShieldDisplay player={player} />
            </div>
            {
                player.active ?
                <div className="card-area-div">
                    <div className="discard-pile-div">
                        <button>Discard Pile{`\n${player.deck.discardPile.length} cards`}</button>
                    </div>
                    <div className="player-hand card-array-div">
                        {
                            player.active &&
                            player.hand.map((card: Card, pos: number) => {
                                return (
                                    <div key={pos} className="card-details">
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
                    <div className="deck-div">
                        {
                            player.uid === currentPlayer.uid &&
                            canDraw ?
                            <button
                             onClick={() => drawCardFromDeck(player)}
                            >
                            Draw
                            </button>:
                            <div className="">
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