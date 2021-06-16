import React, { useState, useEffect, useContext } from 'react';
import './Pokemon.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import UserContext from '../../context/userContext';
import update from 'immutability-helper';
import { array } from 'prop-types';

import axios from 'axios';


function Pokemon(props) { // Have app.js pass in props of the jsons to here? Then render their names and pictures, and prepare if click
  // const [isFav, setIsFav] = useState(props.isFav);

  function favOrUnfav()  { // Patch method to favorite or unfavorite a pokemon
    if (props.isFav) { //isFav
      const index = props.favPokemon.indexOf(props.pokemon.name);
      var removedFav = [...props.favPokemon];
      removedFav.splice(index, 1);
      console.log(removedFav);
      
      props.setFav(removedFav); // array we will be PATCH'ing when we want to unfavorite a pokemon (array - current pokemon)
    }
    else {
      props.setFav(props.favPokemon.concat(props.pokemon.name)); // array we will be PATCH'ing when we want to favorite a pokemon (array + current pokemon)
    }
    // setIsFav(!isFav);
  };
    
  const pokeFacts = {
    imageUrl: props.pokemon.sprites.front_default,
    name: props.pokemon.name,
    ability: props.pokemon.abilities[0].ability.name,
    numberMoves: props.pokemon.moves.length,
    type: props.pokemon.types,
    stats: props.pokemon.stats
  }

  return (
    props.isFav === true ? 
    <div className="Pokemon-card-fav">
      <Popup trigger={<div><img className="Pokemon-card-image" src={pokeFacts.imageUrl} alt="Picture of a pokemon"></img>
      {pokeFacts.name} <button className="favButton" onClick={() => {favOrUnfav()}}>UnFavorite</button></div>} modal>
        <div>
          <p><b>Name</b>: {pokeFacts.name}</p>
          <p><b>Ability</b>: {pokeFacts.ability}</p>
          <p><b>Number of Possible Moves</b>: {pokeFacts.numberMoves}</p>
          <p><b>Type</b>: {pokeFacts.type.map((index) => (index.type.name) + " ")}</p>
          <p><b>Base Stats</b>: {pokeFacts.stats.map((index) => (index.stat.name) + ": " + (index.base_stat) + " ")}</p>
        </div>
      </Popup>
    </div>
    :
    <div className="Pokemon-card">
      <Popup trigger={<div><img className="Pokemon-card-image" src={pokeFacts.imageUrl} alt="Picture of a pokemon"></img>
      {pokeFacts.name} <button className="favButton" onClick={() => {favOrUnfav()}}>Favorite</button></div>} modal>
        <div>
          <p><b>Name</b>: {pokeFacts.name}</p>
          <p><b>Ability</b>: {pokeFacts.ability}</p>
          <p><b>Number of Possible Moves</b>: {pokeFacts.numberMoves}</p>
          <p><b>Type</b>: {pokeFacts.type.map((index) => (index.type.name) + " ")}</p>
          <p><b>Base Stats</b>: {pokeFacts.stats.map((index) => (index.stat.name) + ": " + (index.base_stat) + " ")}</p>
        </div>
      </Popup>
    </div>
  );
}

export default Pokemon;
