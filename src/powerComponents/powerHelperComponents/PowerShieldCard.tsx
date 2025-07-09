import { Player } from "../../classes/Player"

export const PowerShieldComponent = ({ 
    playerInfo, 
    handleSpecialFunction 
}: { playerInfo: Player
    handleSpecialFunction: (playerInfo: Player, position: number) => void
 }) => {
    return (
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
                                onClick={() => handleSpecialFunction(playerInfo, index)}>
                                    Choose
                                </button>
                        </div>
                    )
                })
            }
        </div>
    )
}