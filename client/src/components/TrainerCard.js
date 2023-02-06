import React, {useState} from 'react'
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
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { addTrainer, deleteTrainer, selectTrainer } from '../redux/actions/trainer';
import eCheck from '../errorCheck.js'
import PartyPokemon from './PartyCard';
import pokeball from '../img/pokeball.png'

const TrainerCard = ({id, name, party}) => {
    const dispatch = useDispatch();
    const selectedTrainer = useSelector((state) => state.trainer.selectedTrainer);
    const handleSelect = () => { dispatch(selectTrainer(id)) }
    const handleDelete = () => { dispatch(deleteTrainer(id)) }
    return (
        <Box borderWidth={3} borderColor='black'>
            <Grid templateRows='repeat(3, 1fr)' templateColumns='repeat(3, 1fr)' gap={4} p={6} height='100%' borderWidth={3} borderColor='black'>
                <GridItem rowSpan={1} colSpan={3} borderWidth={6} p={6} borderColor='red'>
                    <VStack>
                        <Center>
                        <Grid templateRows='repeat(3, 1fr)' templateColumns='repeat(3,1fr)' gap={4}>
                            <GridItem rowSpan={1} colSpan={3}><Heading size='4xl'>{name}'s Party</Heading></GridItem>
                            {
                                party?.length === 0 &&
                                <Center>
                                    <Heading>Go catch some Pokemon!</Heading>
                                </Center>
                            }
                            {
                                party?.map((pokemon) => {
                                    return (
                                        <Center>
                                            <GridItem rowSpan={1} colSpan={1} w='25%' h='25%'>
                                                <Image src={pokeball} alt='pokeballs'></Image>
                                            </GridItem>
                                        </Center>
                                    )
                                })
                            }
                           
                        </Grid>
                        </Center>
                    </VStack>
                </GridItem>
                {
                    party &&
                    party.map((pokemon) => {
                        return (
                            <GridItem rowSpan={1} colSpan={1} borderWidth={3} p={6} borderColor='black'>
                                <PartyPokemon id={pokemon} trainerId={id}></PartyPokemon>
                            </GridItem>
                        )
                    })
                }
            </Grid>
            {
                selectedTrainer === id &&
                <>
                    <Text>Selected</Text>
                </>
            }
            {
                selectedTrainer !== id &&
                <>
                    <Button onClick={handleSelect}>Select this trainer?</Button>
                    <Button onClick={handleDelete}>Delete this trainer?</Button>
                </>
                
            }
        </Box>
    )
}

export default TrainerCard;