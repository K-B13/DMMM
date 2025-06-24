import { CardDetails } from "./CardDetails"
import { Card } from "./classes/Card"
import { Player } from "./classes/Player"
import { PlayerCard } from "./PlayerCard"

export const PlayerView = ({ player }: { player: Player }) => {
    return (
        <div>
            <PlayerCard player={player} />
            {
                player.active &&
                player.hand.map((card: Card, index: number) => {
                    return (
                        <div key={index} className="card-details">
                            <CardDetails card={card} />
                        </div>
                    )
                })
            }
        </div> 
    )
}