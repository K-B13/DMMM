import { ActiveShields, Player } from "./classes/Player"

export const ShieldDisplay = ({ player }: { player: Player }) => {
    return (
        <div>
            {
                player.activeShields.map((shield: ActiveShields, index: number) => {
                    return (
                        <div key={index} className="card-details">
                            <p>{shield.card.name}</p>
                            <div>
                                {[...Array(shield.card.shield).keys()].map(num => {
                                    if (num < shield.hp) {
                                        return <img key={num} src={`images/shield_alive.png`} height='30rem' width='30rem' />
                                    }
                                    return <img key={num} src={`images/shield_dead.png`} height='30rem' width='30rem' />
                                })}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}