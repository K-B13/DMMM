import { useEffect, useState } from "react"
import { CardDisplay } from "../../Arena"
import { Card } from "../../classes/Card"
import { Player } from "../../classes/Player"
import { specialMoves } from "../../utility/specialMoves"
import { writeValue } from "../../utility/firebaseActions"
import { gameplayPlayerPath } from "../../utility/firebasePaths"
import { PowerAttackAll } from "../powerHelperComponents/PowerAttackAll"

export const HereIComeComponent = ({
    currentPlayer, 
    card,
    players,
    cancel,
    updateTurnIndex,
    cardPlayed
    }: {
    currentPlayer: Player, 
    card: Card,
    players: Player[],
    cancel: () => void,
    updateTurnIndex: () => void,
    cardPlayed: (c: CardDisplay | undefined) => void
}) => {
    const [ attackDamage, setAttackDamage ] = useState(3)

    const handleSpecialFunction = async () => {
        const specialFunction = specialMoves[card.name]
        await specialFunction(currentPlayer, players, card)
    }


    useEffect(() => {
        handleSpecialFunction()
    }, [])

    const cancelButton = async () => {
        cancel()
        currentPlayer.ignoreShields = false
        // await writeValue(gameplayPlayerPath(currentPlayer.uid), currentPlayer)
    }

    return (
        <>
            {
                currentPlayer.hitAll ?
                <div>
                    <PowerAttackAll 
                    player={currentPlayer}
                    card={card}
                    players={players}
                    updateTurnIndex={updateTurnIndex}
                    attackDamage={attackDamage}
                    setAttackDamage={setAttackDamage}
                    cardPlayed={cardPlayed}
                    cancel={cancelButton}
                    />
                </div>
                :
                <div>
                    <PowerAttackAll 
                    player={currentPlayer}
                    card={card}
                    players={players}
                    updateTurnIndex={updateTurnIndex}
                    attackDamage={attackDamage}
                    setAttackDamage={setAttackDamage}
                    cardPlayed={cardPlayed}
                    cancel={cancelButton}
                    />
                </div>
            }
        </>
    )
}