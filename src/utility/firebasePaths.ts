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