import { Player } from "./classes/Player"

export const PlayerTarget = ({
    playerInfo,
    handleShieldAttack,
    handleAttack
}:
{
    playerInfo: Player,
    handleShieldAttack: (index: number, target: Player) => void,
    handleAttack: (targetedPlayer: Player) => void

}) => {
    return (
        <div>
            <p>{playerInfo.name} - {playerInfo.deck.character}</p>
            <p>HP: {playerInfo.hitpoints} / Moves: {playerInfo.moves}</p>
            {
                playerInfo.activeShields.length === 0 ?
                <button
                onClick={() => handleAttack(playerInfo)}
                >Attack</button>
                :null
            }
            <div className="shield-div card-array-div">
                {
                    playerInfo.activeShields.map((shield, index: number) => {
                        return (
                            <div key={index} className="card-details">
                                <p>{shield.card.name}</p>
                                <p>Starting: {shield.card.shield}</p>
                                <p>Current: {shield.hp}</p>
                                    <button
                                    onClick={() => handleShieldAttack(index, playerInfo)}
                                    >Attack</button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}