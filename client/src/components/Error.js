import React from 'react';
import {
  Box, 
  Image,
  Text
} from '@chakra-ui/react';
import {useLocation} from 'react-router-dom';
import '../App.css';
import giniError from '../img/squirtle_squad.jpg';

const Error = () => {
    const location = useLocation();
    // console.log(location.state.errorMessage)
    return (
        <Box>
            <Text>Ummm...well this is awkward...you made a bad request silly goose!</Text>
            {/* Should put here the actual error that is passed in */}
            <Text>{location?.state?.errorMessage ? location?.state?.errorMessage : '404 bad request'}</Text>
            <Image src={giniError} w='100%' alt='squirtle squad'></Image>
            <Text>You've made the Squirtle Squad mad with that bad request...</Text>
        </Box>
    );
  };
  export default Error;
  