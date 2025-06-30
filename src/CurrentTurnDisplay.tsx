import { CardDisplay } from "./Arena"
import { CardDetails } from "./CardDetails"

export const CurrentTurnDisplay = ({
    currentCardDisplay
}: {
    currentCardDisplay: CardDisplay
}) => {
    return (
        <div className="current-turn-display">
            <h4>{currentCardDisplay.cardOwner.name} - {currentCardDisplay.cardOwner.deck.character}</h4>
            <div></div>
            <CardDetails card={currentCardDisplay.currentCard} />
        </div>
    )
}