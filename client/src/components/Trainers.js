import React, {useState} from 'react';
import {
    Text,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    FormErrorMessage,
    VStack,
    Center,
    Button,
    Box,
    Divider
  } from '@chakra-ui/react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { addTrainer, deleteTrainer, selectTrainer } from '../redux/actions/trainer';
import eCheck from '../errorCheck.js'
import TrainerCard from './TrainerCard';

function Form() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const trainers = useSelector((state) => state.trainer.trainers)
    const [ trainerName, setTrainerName ] = useState('')

    const handleTrainerName = e => {
        const name = e.target.value
        console.log(name)
        setTrainerName(name)
    }

    // const { trainerNames } = useSelector(({trainer}) => trainer)
    // action -> dispatching to store 
    // -> reducer from store interprets based on type 
    // -> reducer does logic to change store

    const createTrainer = event => {
        // checked it works - valid string
        event.preventDefault()
        try{
            eCheck.checkName(trainerName);
            dispatch(addTrainer(trainerName))
            setTrainerName('')
        } catch(e) {
            console.log(e)
            navigate('/error', {state: {errorMessage: e.message}})
        }
    }

    const resetForm = () => {
        const formId = document.getElementById('form-id');
        formId.reset();
    }

    return (
        /*
            Have form accept:
            - url (required)
            - description 
            - posterName
            Auto set binned to false, userPosted to true, and id to some uuid
            On submit run function that calls graphql mutation for uploadImage with those params
        */
        <VStack height='100%' m={20}>
            <Center>
                <VStack>
                    <form onSubmit={createTrainer} id='form-id'>
                        {/* sorry my shade of red is bad :( */}
                        <FormControl>
                            <FormLabel id='trainerName' htmlFor='trainerNameInput'>Enter Your Name!</FormLabel>
                            <Input id='trainerNameInput' type='text' value={trainerName} onChange={handleTrainerName}/>
                            <Button variant='outline' width="full" mt={4} type="submit" onClick={resetForm}>
                                Submit
                            </Button>
                        </FormControl>
                    </form>
                </VStack>
            </Center>
            <br></br>
            {
                trainers &&
                trainers.map((trainer) => {
                    return (
                        <Box borderWidth='3px' borderRadius={3} key={uuidv4()}>
                            <TrainerCard {...trainer} key={uuidv4()}></TrainerCard>
                        </Box>
                )})
            }
        </VStack>
    )
  }

  export default Form;