import { Player } from "../../classes/Player"

export const PowerPlayerCard = ({ playerInfo }: { playerInfo: Player }) => {
    return (
        <div className="target-player-data">
            <p>{playerInfo.name} - {playerInfo.deck.character}</p>
            <p>HP: {playerInfo.hitpoints}</p>
        </div>
    )
}