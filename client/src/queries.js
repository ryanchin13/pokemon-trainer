import {gql} from '@apollo/client';

const pokemonList = gql`
  query pokemonList($pagenum: Int){
    pokemonList(pagenum: $pagenum) {
      id
      name
      sprites {
        front_default
        back_default
        front_shiny
        back_shiny
        official_artwork
      }
      abilities {
        name
        url
      }
      stats {
        base_stat
        name
        url
      }
      types {
        name
        url
      }
    }
  }
`;

const pokemon = gql`
  query pokemon($id: ID) {
    pokemon(id: $id) {
      id
      name
      sprites {
        front_default
        back_default
        front_shiny
        back_shiny
        official_artwork
      }
      abilities {
        name
        url
      }
      stats {
        base_stat
        name
        url
      }
      types {
        name
        url
      }
    }
  }
`;

let exported = {
  pokemonList,
  pokemon
};

export default exported;
