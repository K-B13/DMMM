import { Player } from "./classes/Player"
import { CharacterName } from "./utility/characterBible"
import { characterClasses } from "./utility/characterColor"

export const PlayerTarget = ({
    playerInfo,
    handleShieldAttack,
    handleAttack,
    cancelButton
}:
{
    playerInfo: Player,
    handleShieldAttack: (index: number, target: Player) => void,
    handleAttack: (targetedPlayer: Player) => void,
    cancelButton?: () => void

}) => {
    return (
        <div className={`player-target ${characterClasses[playerInfo.deck.character as CharacterName]}`}>
            <div className="target-player-data">
                <p>{playerInfo.name} - {playerInfo.deck.character}</p>
                <p>HP: {playerInfo.hitpoints}</p>
            </div>
            <div className="bottom-target-player">
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
                                        onClick={() => handleShieldAttack(index, playerInfo)}
                                        >Attack</button>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    cancelButton ?
                    <button
                    onClick={cancelButton}
                    >Cancel</button>:
                    null
                }
            </div>
        </div>
    )
}