// All players in the setup phase
export const allPlayersPath = () => `setup/players`
// Specific player in the setup phase
export const playerPath = (uid: string) => `setup/players/${uid}`
// The ready key for a specific player
export const playerReadyPath = (uid: string) => `setup/players/${uid}/ready`
// The character key for a specific player
export const playerCharacterPath = (uid: string) => `setup/players/${uid}/character`
// Which player is going first based on index
export const firstPlayer = () => `setup/firstPlayer`
// Countdown for game start
export const countdownStart = () => `setup/countdownStart`
// Door to enter game screen
export const startDoor = () => `setup/startDoor`

// The entire gameState
export const gameStatePath = () => `gameState/`
// The players post setup phase
export const allGameplayPlayers = () => `gameState/players`
// Specific player post setup phase
export const gameplayPlayerPath = (uid: string) => `gameState/players/${uid}`
// Players hand
export const gameplayPlayerHand = (uid: string) => `gameState/players/${uid}/hand`
// Players discard pile
export const gameplayPlayerDiscardPile = (uid: string) => `gameState/players/${uid}/deck/discardPile`
// Player hitpoints
export const gameplayPlayerHitpoints = (uid: string) => `gameState/players/${uid}/hitpoints`
// Player active
export const gameplayPlayerActive = (uid: string) => `gameState/players/${uid}/active`
// Player Moves
export const gameplayPlayerMoves = (uid: string) => `gameState/players/${uid}/moves`
// Player Decks
export const gameplayPlayerDeck = (uid: string) => `gameState/players/${uid}/deck`
// Player Shields
export const gameplayPlayerActiveShields = (uid: string) => `gameState/players/${uid}/activeShields`
// The turnIndex path
export const turnIndexPath = () => `gameState/turnIndex`
// Current Card Path
export const currentCardPath = () => `gameState/currentCard`
// card attack notification
export const cardAttackNotificationPath = () => `gameState/attackCardMessage`
// Winner
export const winnerPath = () => `gameState/winner`
