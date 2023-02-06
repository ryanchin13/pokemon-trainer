// npm install @apollo/server express graphql cors body-parser
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
// const port = 4000;
const cors = require('cors');
const { json } = require('body-parser');
// const { typeDefs, resolvers } = require('./schema');
const axios = require('axios');
// const { connect } from 'http2';
// const { start } from 'repl';
const eCheck = require('./errorCheck');
const configRoutes = require('./routes');
const { client, connect } = require('./redis');
const base = 'https://pokeapi.co/api/v2/pokemon/'
const urlExt = '?limit=75&offset=';

const typeDefs = `#graphql
  type Query {
    pokemonList(pagenum: Int): [Pokemon]
    pokemon(id: ID): Pokemon
  }

  type Pokemon {
    id: ID!
    name: String!
    sprites: Sprites
    abilities: [Abilities]
    stats: [Stats]
    types: [Types]
  }

  type Sprites {
    front_default: String
    back_default: String
    front_shiny: String
    back_shiny: String
    official_artwork: String
  } 

  type Abilities {
    name: String
    url: String
  }

  type Types {
    name: String
    url: String
  }

  type Stats {
    base_stat: Int
    name: String
    url: String
  }

`;

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

const resolvers = {
  Query: {
    pokemonList: async (_, args) => {
        let offset = (args.pagenum * 75);
        const link = `${base}${urlExt}${offset}`;
        const hasPage = await client.hExists('PokemonPages', args.pagenum.toString())
        const getPokemonPage = await client.hGet('PokemonPages', args.pagenum.toString())
        if(hasPage) return JSON.parse(getPokemonPage);
        const { data } = await axios.get(link);
		// await client.hSet('bin', args.pageNum, JSON.stringify(unSplashedpokemons));
        const pokemonListed = await Promise.all(data?.results.map(async (pokemon) => {
            // console.log(pokemon)
            const pokemonAxios = await axios.get(pokemon.url)
            const pokemonData = await pokemonAxios.data

            // console.log(pokemon, pokemonData)
            // const official_artwork = Object.values(data).sprites.other['official-artwork'][0];
            // console.log(official_artwork)
            const sprites = {
                front_default: pokemonData.sprites.front_default,
                back_default: pokemonData.sprites.back_default,
                front_shiny: pokemonData.sprites.front_shiny,
                back_shiny: pokemonData.sprites.back_shiny,
                official_artwork: pokemonData.sprites.other['official-artwork'].front_default
            }
            let abilitiesArr = [];
            pokemonData.abilities.map((ability) => {
                let tempAbility = {
                    name: ability.ability.name,
                    url: ability.ability.url
                }
                return(abilitiesArr.push(tempAbility))
            })
            let statsArr = [];
            pokemonData.stats.map((stat) => {
                let tempStat = {
                    base_stat: stat.base_stat,
                    name: stat.stat.name,
                    url: stat.stat.url
                }
                return(statsArr.push(tempStat))
            })
            let typesArr = [];
            pokemonData.types.map((type) => {
                let tempType = {
                    name: type.type.name,
                    url: type.type.url
                }
                return(typesArr.push(tempType))
            })
            const singlePokemon = {
                id: pokemonData.id,
                name: pokemonData.name,
                sprites: sprites,
                abilities: abilitiesArr, 
                stats: statsArr, 
                types: typesArr
            }
            await client.hSet('Pokemon', pokemonData.id, JSON.stringify(singlePokemon))
            return singlePokemon;
        }))
        await client.hSet('PokemonPages', args.pagenum, JSON.stringify(pokemonListed));
        return pokemonListed;
    },
    pokemon: async (_, args) => {
        const link = `${base}${args.id}`;
        const getPokemon = await client.hGet('Pokemon', args.id.toString())
        if(await client.hExists('Pokemon', args.id.toString())) return JSON.parse(getPokemon);
        const { data } = await axios.get(link);
        const sprites = {
            front_default: data.sprites.front_default,
            back_default: data.sprites.back_default,
            front_shiny: data.sprites.front_shiny,
            back_shiny: data.sprites.back_shiny,
            official_artwork: data.sprites.other['official-artwork'].front_default
        }
        let abilitiesArr = [];
        data.abilities.map((ability) => {
            let tempAbility = {
                name: ability.ability.name,
                url: ability.ability.url
            }
            return(abilitiesArr.push(tempAbility))
        })
        let statsArr = [];
        data.stats.map((stat) => {
            let tempStat = {
                base_stat: stat.base_stat,
                name: stat.stat.name,
                url: stat.stat.url
            }
            return(statsArr.push(tempStat))
        })
        let typesArr = [];
        data.types.map((type) => {
            let tempType = {
                name: type.type.name,
                url: type.type.url
            }
            return(typesArr.push(tempType))
        })
        const pokemon = {
            id: data.id,
            name: data.name,
            sprites: sprites,
            abilities: abilitiesArr,
            stats: statsArr,
            types: typesArr
        }
        await client.hSet('Pokemon', args.id, JSON.stringify(pokemon))
        return pokemon;
    },
  }
};

async function startApolloServer() {
    const app = express();
    await connect();
    app.use(cors({options: 'http://localhost:3000'}));
    
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    app.use(
        '/graphql',
        json(),
        expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
        }),
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/', async(req, res, next) => {
        next();
    })
    app.use('/pokemon/page/:pagenum', async(req, res, next) => {
        try {
            try {
                // console.log(req.params.pagenum)
                eCheck.checkPage(req.params.pagenum);
            }catch(e) {
                res.status(400).json({error: e});
                return;
            }
            const exists = await client.hExists('PokemonPages', req.params.pagenum);
            if(exists) {
                const get = await client.hGet('PokemonPages', req.params.pagenum.toString());
                const reformed = JSON.parse(get);
                res.status(200).json(reformed);
                return;
            } 
            return next();
        }catch(e) {
            res.status(404).json({error: e});
            return;
        }
    })
    app.use('/pokemon/:id', async(req, res, next) => {
        try {
            if(req.params.id === 'page') return next();
            try {
                eCheck.checkId(req.params.id);
            }catch(e) {
                res.status(400).json({error: e});
                return;
            }
        }catch(e) {
            res.status(404).json({error: e});
            return;
        }
        const exists = await client.hExists('Pokemon', req.params.id);
		if(exists) {
			const get = await client.hGet('Pokemon', req.params.id.toString());
			const reformed = JSON.parse(get);
			// await client.lPush("History", get); 
			res.status(200).json(reformed);
			return;
		} 
		return next();
    })
    app.use('/trainers', async(req, res, next) => {
        next();
    })
    
    configRoutes(app);

    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}
startApolloServer();
