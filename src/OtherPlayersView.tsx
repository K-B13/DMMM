import { Card } from "./classes/Card"
import { Player } from "./classes/Player"
import { PlayerCard2 } from "./PlayerCard2"
import { ShieldDisplay } from "./ShieldDisplay"
import { CharacterName } from "./utility/characterBible"
import { characterClasses } from "./utility/characterColor"

export const OtherPlayersView = ({ player }: { player: Player }) => {
    return (
        <div className="other-player-div">
            <div className="stat-window">
                <PlayerCard2 player={player} isCurrentPlayer={false}/>
                <ShieldDisplay player={player} />
                
            </div>
            <div className="other-card-array-div">
                {
                    player.hand.map((card: Card, index: number) => {
                        const characterName = card.character as CharacterName
                        return (
                            <div key={index} className={`card-details ${characterClasses[characterName]}`}>
                                <p>Dungeon Mayhehm</p>
                                <p>Monster Madness</p>
                            </div>
                        )
                    })
                }
            </div>
            <p>{player.hand.length} Cards</p>
        </div>
    )
}