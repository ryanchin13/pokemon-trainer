const axios = require('axios');
const express = require('express');
const router = express.Router();
const { client, connect } = require('../redis');
const eCheck = require('../errorCheck');
const { createClient } = require('redis');
const base = 'https://pokeapi.co/api/v2/pokemon/'
const urlExt = '?limit=75&offset=';

// router.use('/', async(req, res) => {

// })
router.use('/page/:pagenum', async(req, res) => {
    try{
        const pagenum = req.params.pagenum;
        const offset = (Number(pagenum)*75);
        const link = `${base}${urlExt}${offset}`
        const { data } = await axios.get(link);
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
        await client.hSet('PokemonPages', pagenum, JSON.stringify(pokemonListed));
        return res.status(200).json(pokemonListed);
    }catch(e) {
        res.status(404).json(e);
        return;
    }
})
router.use('/:id', async(req, res) => {
    try {
        try {
            eCheck.checkId(req.params.id);
        }catch(e) {
            res.status(400).json({error: e});
            return;
        }
        let url = `${base}${req.params.id}`;
        const { data } = await axios.get(url);
        const sprites = {
            front_default: data.sprites.front_default,
            back_default: data.sprites.back_default,
            front_shiny: data.sprites.front_default,
            back_shiny: data.sprites.front_default,
            official_artwork: data.sprites.other['official-artwork'].front_default
        }
        const pokemon = {
            id: data.id,
            name: data.name,
            sprites: sprites
        }
        await client.hSet('Pokemon', req.params.id, JSON.stringify(pokemon));
        res.status(200).json(pokemon);
    }catch(e) {
        res.status(404).json({error: e});
    }
})
// router.use('/trainers', async(req, res) => {

// })

module.exports = router;
