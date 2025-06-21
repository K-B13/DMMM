import { Card, createCard } from '../src/classes/Card'

describe('Card Object', () => {
    it('Creates a card that only heals', () => {
        const card: Card = { 
            heal: 2, 
            name: 'Just Another Coat Rack', 
            character: 'Mimi LeChaise',
            id: 1,
        }
        const newCard = createCard(card)

        expect(newCard.name).toBe('Just Another Coat Rack')
        expect(newCard.character).toBe('Mimi LeChaise')
        expect(newCard.heal).toEqual(2)
        expect(newCard.id).toEqual(1)
        expect(newCard.type).toEqual('normal')
    })

     it('Create a card that only attacks', () => {
        const card: Card = { 
            attack: 2, 
            name: 'Wing Buffet', 
            character: 'Lord Cinderpuff', 
            id: 1
        }

        const newCard = createCard(card)

        expect(card.name).toBe('Wing Buffet')
        expect(card.character).toBe('Lord Cinderpuff')
        expect(card.attack).toEqual(2)
        expect(card.id).toEqual(1)
        expect(newCard.type).toEqual('normal')
    })

    it('Create a card that only shields', () => {
        const card: Card = { 
            shield: 2, 
            name: 'Mirror Mirror', 
            character: 'Delilah Deathray', 
            id: 1
        }

        const newCard = createCard(card)

        expect(card.name).toBe('Mirror Mirror')
        expect(card.character).toBe('Delilah Deathray')
        expect(card.shield).toEqual(2)
        expect(card.id).toEqual(1)
        expect(newCard.type).toEqual('normal')
    })

    it('Create a card that only draws', () => {
        const card: Card = { 
            draw: 2, 
            name: 'Intermission', 
            character: 'Hoots McGoots', 
            id: 1
        }

        const newCard = createCard(card)

        expect(card.name).toBe('Intermission')
        expect(card.character).toBe('Hoots McGoots')
        expect(card.draw).toEqual(2)
        expect(card.id).toEqual(1)
        expect(newCard.type).toEqual('normal')
    })

    it('Create a card that only gives an extra go', () => {
        const card: Card = { 
            extra: 2, 
            name: 'Slime Time', 
            character: 'Blorp', 
            id: 1
        }

        const newCard = createCard(card)

        expect(card.name).toBe('Slime Time')
        expect(card.character).toBe('Blorp')
        expect(card.extra).toEqual(2)
        expect(card.id).toEqual(1)
        expect(newCard.type).toEqual('normal')
    })

    it('Create a card with with 2 atributes attack and shield', () => {
        const card: Card = { 
            attack: 2,
            shield: 1, 
            name: 'Puppet Therapy', 
            character: 'Dr Tentaculous', 
            id: 1
        }

        const newCard = createCard(card)

        expect(card.name).toBe('Puppet Therapy')
        expect(card.character).toBe('Dr Tentaculous')
        expect(card.attack).toEqual(2)
        expect(card.shield).toEqual(1)
        expect(card.id).toEqual(1)
        expect(newCard.type).toEqual('normal')
    })

    it('Create a card with with 2 atributes draw and heal', () => {
        const card: Card = { 
            draw: 2,
            heal: 1, 
            name: 'Cure Wounds', 
            character: 'Lia', 
            id: 1
        }

        const newCard = createCard(card)

        expect(card.name).toBe('Cure Wounds')
        expect(card.character).toBe('Lia')
        expect(card.draw).toEqual(2)
        expect(card.heal).toEqual(1)
        expect(card.id).toEqual(1)
        expect(newCard.type).toEqual('normal')
    })

    it('Create a card with with 3 atributes attack, extra move and heal', () => {
        const card: Card = { 
            extra: 1,
            heal: 1,
            attack: 1, 
            name: 'Tyranny of Beauty', 
            character: 'Delilah Deathray', 
            id: 1
        }

        const newCard = createCard(card)

        expect(card.name).toBe('Tyranny of Beauty')
        expect(card.character).toBe('Delilah Deathray')
        expect(card.extra).toEqual(1)
        expect(card.heal).toEqual(1)
        expect(card.attack).toEqual(1)
        expect(card.id).toEqual(1)
        expect(newCard.type).toEqual('normal')
    })
})