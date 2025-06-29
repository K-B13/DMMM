import { Card } from "./classes/Card"
import { Player } from "./classes/Player"
import { PlayerCard2 } from "./PlayerCard2"
import { ShieldDisplay } from "./ShieldDisplay"

export const OtherPlayersView = ({ player }: { player: Player }) => {
    return (
        <div className="other-player-div">
            <div className="stat-window">
                <PlayerCard2 player={player}/>
                <ShieldDisplay player={player} />
            </div>
            <div>
                {
                    player.hand.map((card: Card, index: number) => {
                        return (
                            <div key={index} className="card-details">
                                <p>Dungeon Mayhehm</p>
                                <p>Monster Madness</p>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}