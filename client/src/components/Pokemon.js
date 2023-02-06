import React, {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {useParams, useNavigate} from 'react-router-dom';
import queries from '../queries.js';
import {useQuery, useMutation} from '@apollo/client';
import {
    VStack, 
    HStack,
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
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
    Progress,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux'
import { addToTeam, deleteFromTeam } from '../redux/actions/trainer';

const Pokemon = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const {trainers, selectedTrainer } = useSelector((state) => state.trainer);
    let getTrainer = '';
    let trainerParty = [];
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
    //   console.log(data)
    const colors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        grass: "#7AC74C",
        electric: "#F7D02C",
        ice: "#96D9D6",
        fighting: "#c84a46",
        poison: "#aa53a9", 
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#816aa1",
        dark: "#847165",
        dragon: "#7d52ff",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    }
    const statColors = {
        hp: "red",
        attack: "orange",
        defense: "yellow",
        "special-attack": "blue",
        "special-defense": "green",
        speed: "pink"
    }
    let imagesArr = [];
    for(const key in data?.pokemon.sprites) {
        if(key === "__typename" || key === 'official_artwork') continue;
        imagesArr.push(data.pokemon.sprites[key])             
    }
    const handleAddToTeam = () => { dispatch(addToTeam(id))}
    const handleDeleteFromTeam = () => { dispatch(deleteFromTeam(id))}
    if(trainers.length>0) {
        console.log(trainers)
        getTrainer = trainers.find(element => element.id === selectedTrainer);
        trainerParty = getTrainer.party;
    }
    return (
        <>
            {
                data?.pokemon &&
                <Center key={data?.pokemon.id} m={15}>
                    <VStack key={uuidv4()}>
                        <Heading size="2xl" key={uuidv4()}>{data?.pokemon.name}</Heading>
                        <Divider orientation='horizontal'/>
                        <Image src={data.pokemon.sprites.official_artwork} key={uuidv4()} alt='official art'/>
                        <Box key={uuidv4()}>
                            {data?.pokemon.types.map((type) => {
                                let colorType = colors[type.name]
                                return (
                                    <Box bg={colorType} m={2} p={4} borderWidth="1px" borderRadius={50} key={uuidv4()}>
                                        <Link href={type.url} color="black" isExternal key={uuidv4()}>{type.name}</Link>
                                    </Box>
                                )
                            })}
                        </Box>
                        <Box key={uuidv4()} borderWidth='2px' p={6} m={5} height="100%" width="100%">
                            <Heading>Other Art</Heading>
                            <HStack key={uuidv4()}>                            {
                                data?.pokemon.sprites &&
                                imagesArr.map((img) => {
                                    return (
                                    <Image src={img} key={uuidv4()} alt='alt images'/>
                                )})
                                }
                            </HStack>
                        </Box>
                        <Box borderWidth='2px' p={6} width='70%' key={uuidv4()}>
                            <Heading>Stats</Heading>
                            <Divider orientation='horizontal' height = '10px' key={uuidv4()}></Divider>
                            {
                                // console.log(data?.pokemon.stats) &&
                                data?.pokemon.stats && 
                                data?.pokemon.stats.map((stat) => {
                                return (
                                    <>
                                        {stat.name} ({stat.base_stat}):<Progress value={stat.base_stat} colorScheme={statColors[stat.name]} max='255' key={uuidv4()}></Progress>
                                    </>
                                )
                            })}
                        </Box>
                        <TableContainer>
                            <Table variant='simple' key={uuidv4()}>
                                <Thead>
                                    <Tr key={uuidv4()}>
                                        <Th key={uuidv4()}>Ability</Th>
                                        <Th key={uuidv4()}>Learn More</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                    data.pokemon.abilities &&
                                    data?.pokemon.abilities.map((ability) => {
                                        return (
                                            <Tr key={uuidv4()}>
                                                <Td key={uuidv4()}>{ability.name}</Td>
                                                <Td key={uuidv4()}><Link href={ability.url} isExternal>Learn More About {ability.name}</Link></Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
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
                </Center>
            }
        </>
        );
};

export default Pokemon;
