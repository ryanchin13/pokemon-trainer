import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
import {
    VStack, 
    Divider, 
    Center, 
    Heading, 
    Text,
    Grid,
    GridItem,
    Box, 
    Image,
    Button, 
    ButtonGroup,
    StackDivider,
    Spacer,
    Link,
} from '@chakra-ui/react';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux'
import { addToTeam, deleteFromTeam } from '../redux/actions/trainer';

const Pokemon = ({id, name, sprites, abilities, stats, types}) => {
    // const navigate = useNavigate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {trainers, selectedTrainer } = useSelector((state) => state.trainer);
    let getTrainer = '';
    let trainerParty = [];
    const colors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        grass: "#7AC74C",
        electric: "#F7D02C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1", 
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dark: "#705746",
        dragon: "#6F35FC",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    }
    const gradient = {
        normal: "linear(#E0DDDD, #908B8B, #535150)",
        fire: "linear(#F2AAA7, #F3B94E, #CB3606)",
        water: "linear(#C6E6F5, #7DCFF6, #0B92D3)",
        grass: "linear(#D0F1C6, #71D456, #259107)",
        electric: "linear(#F5DB89, #E7BE3D, #D7A506)",
        ice: "linear(#CEF3F3, #78EAE9, #0FDBDA)",
        fighting: "linear(#F6D4BD, #F6A974, #EA6E18)",
        poison: "linear(#BB9FE8, #A573F6, #641BDA)",
        ground: "linear(#A69980, #7F683E, #5A3E0B)",
        flying: "linear(#D8B8F6, #A98FF3, #9D48EC)",
        psychic: "linear(#E8B6EF, #CE6FDC, #A51CBA)",
        bug: "linear(#DAF19F, #BDEB49, #91C60B)",
        rock: "linear(#CEBB9E, #8D724B, #3A280E)",
        ghost: "linear(#D2D0CE, #898786, #63457A)",
        dark: "linear(#B0A992, #705746, #36352F)",
        dragon: "linear(#CAB3EF, #6F35FC, #7149B2)",
        steel: "linear(#CECCD0, #9F9DA2, #79787B)",
        fairy: "linear(#F6DDF7, #F2B4F6, #F697FC)",
    }
    // console.log(types)

    const handleAddToTeam = () => { dispatch(addToTeam(id))}
    const handleDeleteFromTeam = () => { dispatch(deleteFromTeam(id))}
    if(trainers.length>0) {
        getTrainer = trainers.find(element => element.id === selectedTrainer);
        trainerParty = getTrainer.party;
    }
    return (
        <VStack>
            <Link as={RouterLink} to={`/pokemon/${id}`}>
            <Center key={id}>
                <Box m={3} p={6} display='flex' width='100%' borderWidth='1px' borderRadius='lg' bgGradient={gradient[types[0].name]}>
                    <Heading fontFamily='Perpetua'>{name}</Heading>
                    {
                        sprites.official_artwork &&
                        <Image src={sprites.official_artwork} height='75%' width='50%' alt='official art'/>
                    }
                </Box>
            </Center>
            </Link>
            {
                (getTrainer && trainerParty.length < 6 && !trainerParty.includes(id) ) &&
                <>
                    <Button onClick={handleAddToTeam}>Add to team?</Button>
                </>
            }
            {
                (selectedTrainer === getTrainer.id && trainerParty.includes(id) ) &&
                <>
                    <Button onClick={handleDeleteFromTeam}>Delete from team?</Button>
                </>
            }
        </VStack>
        );
};

export default Pokemon;
