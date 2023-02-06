import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
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
    Link,
    Button, 
    ButtonGroup,
    Spinner
} from '@chakra-ui/react';
import '../App.css';
import PokeListCard from './PokeListCard'

const Pokemon = () => {
    // const navigate = useNavigate();
    const { pagenum } = useParams();
    const navigate = useNavigate();
    // const [pagenum, setPagenum] = useState(0);
    const [nextPageViable, setNextPageViable] = useState(1); // 0 indicates there is another page available, 1 indicates there is no data for next page
    useEffect(() => {
        // console.log('firing pagination useeffect');
        async function fetchData() {
            try{
              const { data } = await axios.get(`http://localhost:4000/pokemon/page/${Number(pagenum)+1}`);
              console.log(pagenum, data)
              // data.error ? setNextPageViable(1) : setNextPageViable(0);
              if(data?.length > 0) setNextPageViable(0)
              else setNextPageViable(1)
            }catch(e) {
              navigate('/error', {state: {errorMessage: e.message}})
            }
        }
        fetchData();
      }, [pagenum]);
    let {loading, error, data, fetchMore } = useQuery(queries.pokemonList, {
        onCompleted: (data) => {
          if(data.pokemonList.length <= 0) navigate('/error', {state: {errorMessage: '404 page does not exist'}})
        },
        onError: (e) => {
          navigate('/error', {state: {errorMessage: e.message}})
        },
        // fetchPolicy: 'cache-and-network',
        // pollInterval: 250,
        variables: {
          pagenum: Number(pagenum)
        }
      });
      
    //   console.log(data?.pokemonList)

    return (
        <div>
          <br></br>
            <Box>
            {
                Number(pagenum)>0 &&
                <Link as={RouterLink} className='nextprevlink' to={`/pokemon/page/${Number(pagenum)-1}`}>Previous Page</Link> 
            }
            {/* <Divider orientation='horizontal'/> */}
            {
                nextPageViable===0 &&
                <Link as={RouterLink} className='nextprevlink' to={`/pokemon/page/${Number(pagenum)+1}`}>Next Page</Link> 
            }
            </Box>
            {
                loading &&
                <Box>
                    <Text>Loading...</Text>
                    <Spinner 
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='white'
                    color='red'
                    size='xl'/>
                </Box>
            }
            <Grid templateColumns='repeat(3, 1fr)' gap={6}>
                {
                    data?.pokemonList.map((pokemon) => {
                        // console.log(pokemon)
                        return (
                            <GridItem key={uuidv4()}>
                                <PokeListCard {...pokemon}></PokeListCard>
                            </GridItem>
                        )
                    })
                }
            </Grid>
            <br></br>
            <Box>
            {
                Number(pagenum)>0 &&
                <Link as={RouterLink} className='nextprevlink' to={`/pokemon/page/${Number(pagenum)-1}`}>Previous Page</Link> 
            }
            {/* <Divider orientation='horizontal'/> */}
            {
                nextPageViable===0 &&
                <Link as={RouterLink} className='nextprevlink' to={`/pokemon/page/${Number(pagenum)+1}`}>Next Page</Link> 
            }
            </Box>
        </div>
        );
};

export default Pokemon;
