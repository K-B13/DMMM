import { ActiveShields, Player } from "./classes/Player"

export const PlayerCard2 = ({ player }: { player: Player }) => {
    return (
        <div>
            <h4>{`${player.name} - ${player.deck.character}`}</h4>
            <p>{player.active ? `HP: ${player.hitpoints}`: 'Dead' }</p>
            <p>Moves: {player.moves}</p>
        </div> 
    )
}