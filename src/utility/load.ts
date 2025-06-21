import { characterBible, CharacterName } from "./characterBible"
import { Card, createCard } from "../classes/Card"

export const loadCharacterData = async (character: CharacterName) => {
    const characterPath = characterBible[character]
    const response = await fetch(`/decks/${characterPath}.json`)
    if (!response.ok) throw new Error(`Could not load deck for ${character}`);

    const rawCards = await response.json();
    return rawCards.map((cardData: any, index: number) => {
        const newCard = {
            ...cardData,
            id: index
        }
        
        return createCard(newCard)
    });
}