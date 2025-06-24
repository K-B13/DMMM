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

// The players post setup phase
export const allGameplayPlayers = () => `gameState/players`
// Specific player post setup phase
export const gameplayPlayerPath = (uid: string) => `gameState/players/${uid}`