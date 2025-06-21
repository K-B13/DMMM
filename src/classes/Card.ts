export interface CardPower {
    attack?: number;
    shield?: number;
    heal?: number;
    draw?: number;
    extra?: number;
}

export interface Card extends CardPower {
    name: string;
    character: string;
    id: number
    type?: 'normal' | 'special'
}

export type CardCreationType = (cardAttributes: Card) => Card

export const createCard: CardCreationType = (cardAttributes) => {
    const newCard = {
        ...cardAttributes,
        type: cardAttributes.type ?? 'normal',
        heal: cardAttributes.heal || 0,
        draw: cardAttributes.draw || 0,
        extra: cardAttributes.extra || 0,
        attack: cardAttributes.attack || 0,
        shield: cardAttributes.shield || 0,
        
    }

    return newCard
}