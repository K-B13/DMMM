import { Card } from "./classes/Card"

export const CardDetails = ({ card }: { card: Card }) => {
    return (
        <div className="card">
            <p className="card-name">{card.name}</p>
            <div className="card-icon-row">
                {card.extra ? <div>
                     {[...Array(card.extra).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/extra.png'} width='25rem' height='25rem'/>
                    })}
                </div> : null}
                {card.heal ? <div>
                    {[...Array(card.heal).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/heal.png'} width='25rem' height='25rem'/>
                    })}
                </div> : null}
                {card.attack ? <div>
                    {[...Array(card.attack).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/attack.png'} width='25rem' height='25rem'/>
                    })}
                </div> : null}
                {card.draw ? <div>
                    {[...Array(card.draw).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/card.png'} width='25rem' height='25rem'/>
                    })}
                </div> : null}
                {card.shield ? <div>
                    {[...Array(card.shield).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/shield_alive.png'} width='25rem' height='25rem'/>
                    })}
                </div> : null}
            </div>
            <div className="card-footer"></div>
        </div>
    )
}