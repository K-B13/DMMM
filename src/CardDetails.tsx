import { Card } from "./classes/Card"

export const CardDetails = ({ card }: { card: Card }) => {
    return (
        <div>
            <p>{card.name}</p>
            <div>
                <div>
                    {card.extra ? [...Array(card.extra).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/extra.png'} width='30rem' height='30rem'/>
                    }): null}
                </div>
                <div>
                    {card.heal ? [...Array(card.heal).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/heal.png'} width='30rem' height='30rem'/>
                    }): null}
                </div>
                <div>
                    {card.attack ? [...Array(card.attack).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/attack.png'} width='30rem' height='30rem'/>
                    }): null}
                </div>
                <div>
                    {card.draw ? [...Array(card.draw).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/card.png'} width='30rem' height='30rem'/>
                    }): null}
                </div>
                <div>
                    {card.shield ? [...Array(card.shield).keys()].map((_, index: number) => {
                        return <img key={index} src={'images/shield_alive.png'} width='30rem' height='30rem'/>
                    }): null}
                </div>
            </div>
        </div>
    )
}