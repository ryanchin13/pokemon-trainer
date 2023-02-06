import React from 'react'
import {v4 as uuidv4} from 'uuid'
import { Link as RouterLink, userParams, useNavigate } from 'react-router-dom';
import {
    VStack, 
    HStack,
    Divider, 
    Center, 
    Heading, 
    Text,
    Box, 
    Image,
    Button, 
    ButtonGroup,
    Link
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteFromTeam } from '../redux/actions/trainer';
import eCheck from '../errorCheck.js'
import queries from '../queries.js';
import {useQuery, useMutation} from '@apollo/client';

const PartyPokemon = ({id, trainerId}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {trainers, selectedTrainer } = useSelector((state) => state.trainer);
    let {loading, error, data, fetchMore } = useQuery(queries.pokemon, {
        onError: (e) => {
          console.log(e)
          navigate('/error', {state: {errorMessage: e.message}})
        },
        // fetchPolicy: 'cache-and-network',
        // pollInterval: 250,
        variables: {
            id: id
        }
      });
    
    const removeFromParty = () => { dispatch(deleteFromTeam(id)) }

    return (
        <VStack>
            <Heading>{data?.pokemon.name}</Heading>
            <Link as={RouterLink} to={`/pokemon/${data?.pokemon.id}`}>
                <Image src={data?.pokemon.sprites.official_artwork} alt='pokemon official art'></Image>
            </Link>
            {
                selectedTrainer === trainerId &&
                <Button onClick={removeFromParty}>Remove {data?.pokemon.name} from the team?</Button>
            }
        </VStack>
    );
}

export default PartyPokemon;
