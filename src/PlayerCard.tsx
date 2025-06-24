import { ActiveShields, Player } from "./classes/Player"

export const PlayerCard = ({ player }: { player: Player }) => {
    return (
        <div>
            <p>{`${player.name} - ${player.deck.character}`}</p>
            <p>{player.active ? `HP: ${player.hitpoints}`: 'Dead' }/  Moves: {player.moves}</p>
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