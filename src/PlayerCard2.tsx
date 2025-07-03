import { Player } from "./classes/Player"

export const PlayerCard2 = ({ player, isCurrentPlayer }: { player: Player, isCurrentPlayer: boolean }) => {
    return (
        <div className="player-info">
            <h4>{`${player.name} - ${player.deck.character}`}</h4>
            <p>{player.active ? `HP: ${player.hitpoints}`: 'Dead' }</p>
            {isCurrentPlayer ? <p>Moves: {player.moves}</p> : <p>Cards: {player.hand.length}</p>}
        </div> 
    )
}