import React, {useState, useEffect} from 'react';
import {
  Box, 
  Flex,
  Spacer,
  Text,
  Spinner,
  Button,
  VStack,
  Link,
  Image,
  Divider,
  Center
} from '@chakra-ui/react';
import '../App.css';
import { v4 as uuidv4 } from 'uuid';
import pokeBg from '../img/pokemon-group.jpg'

const Home = () => {  
    return (
      <Box key={uuidv4()} m={2} p={4} width='100%' height='100%' borderRadius={6} display='flex'>
        <Center>
          <Box m={2} p='70px' height='100%' width='100%' border='3px solid black' borderWidth={5} borderRadius={6} alignContent='center' bgGradient={"linear(#FCD7D3, #F37A6E, #AD1303)"}>
            <Text fontSize='30px'>
                Welcome to the wonderful world of Pokemon!
                Use this site as your personal Pokedex exploring the many different 
                Pokemon throughout the generations!
                As a trainer you will be able to select up to 6 Pokemon to join you on your quest
                to becoming a Pokemon Master! You assign these teams to specific trainers while
                learning about the vast collection of Pokemon that roam the World!
            </Text>
          </Box>
        {/* <Link to={`/trainers`}>Select Trainers</Link> */}
        <Image src={pokeBg} alt='fun pokemon'></Image>
        </Center>
      </Box>
  );
};

export default Home;
