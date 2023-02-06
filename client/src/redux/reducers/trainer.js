// state.trainer.trainerNames
import { v4 as uuidv4 } from 'uuid'
import { deleteTrainer } from '../actions/trainer'
const INITIAL_STATE = {
    /*
        trainers: [trainer]
        trainer: {
            id,
            name,
            party: [] // max length of 6
        }
    */
    trainers: [],
    selectedTrainer: ''
}

const trainer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action
    switch (type) {
        case 'SELECT_TRAINER':
            return {
                ...state,
                selectedTrainer: payload
            }
        case 'ADD_TRAINER':
            // DONT DO THIS... BAF
            // trainerNames.push(payload)
            // INITIAL_STATE.trainerNames = [daiowjdoaiwkd]
            const trainer = {
                id: uuidv4(),
                name: payload,
                party: [] 
            }
            return {
                ...state,
                trainers: [...state.trainers, trainer],
                selectedTrainer: trainer.id
            }
        case 'DELETE_TRAINER':
            function deletedTrainers(trainer) {
                return trainer.id !== payload;
            }
            return {
                ...state,
                trainers: state.trainers.filter(deletedTrainers)
            }
        case 'ADD_TO_TEAM':
            return {
                ...state,
                trainers: state.trainers.map((trainer) => {
                    if(trainer.id === state.selectedTrainer) {
                        return {
                            ...trainer,
                            party: [...trainer.party, payload]
                        }
                    }
                    else return trainer
                })
            }
        case 'DELETE_FROM_TEAM':
            function deletedPokemon(pokemon) {
                return pokemon !== payload;
            }
            return {
                ...state,
                trainers: state.trainers.map((trainer) => {
                    if(trainer.id === state.selectedTrainer) {
                        return {
                            ...trainer,
                            party: trainer.party.filter(deletedPokemon)
                        }
                    }
                    else return trainer
                })
            }
        default:
            return state
    }
}

export default trainer;