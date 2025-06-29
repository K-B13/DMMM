import { ActiveShields, Player } from "./classes/Player"

export const PlayerCard = ({ player }: { player: Player }) => {
    return (
        <div>
            <h4>{`${player.name} - ${player.deck.character}`}</h4>
            <p>{player.active ? `HP: ${player.hitpoints}`: 'Dead' }</p>
            <p>Moves: {player.moves}</p>
            {
                player.activeShields.map((shield: ActiveShields, index: number) => {
                    return (
                        <div key={index} className="card-details">
                            <p>{shield.card.name}</p>
                            {[...Array(shield.card.shield).keys()].map(num => {
                                if (num < shield.hp) {
                                    return <img key={num} src={`images/shield_alive.png`} height='30rem' width='30rem' />
                                }
                                return <img key={num} src={`images/shield_dead.png`} height='30rem' width='30rem' />
                            })}
                        </div>
                    )
                })
            }
        </div> 
    )
}