import React from 'react';
import './App.css';
import {NavLink, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Pokemon from './components/Pokemon';
import PokemonList from './components/PokemonList';
import Trainers from './components/Trainers'
import Error from './components/Error'
import logo from './img/pokemon-influence.jpg';

function App() {
  return (
      <Router>
        <div className='App'>
          <header className='App-header'>
            {/* <img src={logo} padding='10px' width='70%' height='10%' alt='logo' /> */}
            
          </header>
          <br></br>
          <h1 className='App-title'>
              Welcome to the World of Pokemon!
          </h1>
          <br></br>
          <nav>
              <NavLink className='navlink' to='/'>
                Home
              </NavLink>
              <NavLink className='navlink' to='/pokemon/page/0'>
                All Pokemon
              </NavLink>
              <NavLink className='navlink' to='/trainers'>
                Trainers
              </NavLink>
            </nav>
          <div className='App-body'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/pokemon/page/:pagenum' element={<PokemonList />} />
              <Route path='/pokemon/:id' element={<Pokemon />}/>
              <Route path='/trainers' element={<Trainers />}/>
              <Route path='*' element={<Error />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
