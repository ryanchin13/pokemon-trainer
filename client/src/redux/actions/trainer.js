export const selectTrainer = trainerId => ({
    type: 'SELECT_TRAINER',
    payload: trainerId
})

export const addTrainer = trainerName => ({
    type: 'ADD_TRAINER',
    payload: trainerName
})

export const deleteTrainer = trainerId => ({
    type: 'DELETE_TRAINER',
    payload: trainerId
})

export const addToTeam = pokemonId => ({
    type: 'ADD_TO_TEAM',
    payload: pokemonId
})

export const deleteFromTeam = pokemonId => ({
    type: 'DELETE_FROM_TEAM',
    payload: pokemonId
})
