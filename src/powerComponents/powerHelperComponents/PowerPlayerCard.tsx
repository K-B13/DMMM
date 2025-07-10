import { Player } from "../../classes/Player"

export const PowerPlayerCard = ({ playerInfo, showTotalShields = false }: { playerInfo: Player, showTotalShields?: boolean }) => {
    const totalShields = () => {
        return playerInfo.activeShields.reduce((accum, p) => {
            return accum += p.hp
        }, 0)
    }
    return (
        <div className="target-player-data">
            <p>{playerInfo.name} - {playerInfo.deck.character}</p>
            <p>HP: {playerInfo.hitpoints}</p>
            {
                showTotalShields &&
                <p>Has {totalShields()} shield strength</p>
            }
        </div>
    )
}