import React, { useState, useEffect, useContext } from 'react';
import './Pokemon.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import UserContext from '../../context/userContext';
import update from 'immutability-helper';
import { array } from 'prop-types';

import axios from 'axios';


function Pokemon(props) { // Have app.js pass in props of the jsons to here? Then render their names and pictures, and prepare if click
  const [isFav, setIsFav] = useState();
  var { userData, setUserData } = useContext(UserContext); // use userData.user.favPokemon to access the favorite pokemon
  const [error, setError] = useState();
  const [putArr, setPutArr] = useState([...userData.user.favPokemon]);
  // Can use userData.user.favPokemon.find(props.pokemon.name) to search for the pokemon. If found (i.e. not undefined)
  // then render it differently.

  useEffect(() => {
    console.log(userData);
    const found = (element) => element === props.pokemon.name;
    const isFound = (userData.user.favPokemon).some(found);
    setIsFav(isFound);
    if (isFound) {
      const index = userData.user.favPokemon.indexOf(props.pokemon.name);
      const removedFav = putArr;
      removedFav.splice(index, 1);

      setPutArr(removedFav); // array we will be PATCH'ing when we want to unfavorite a pokemon (array - current pokemon)
      // putArr.splice(index, 1); 
    }
    else {
      setPutArr(putArr.concat(props.pokemon.name)); // array we will be PATCH'ing when we want to favorite a pokemon (array + current pokemon)
      // putArr.push(props.pokemon.name) 
    }
  }, [])

  const id = userData.user.id;
  const favOrUnfav = async (e) => { // Patch method to favorite or unfavorite a pokemon
    e.preventDefault();
    try {
      console.log(putArr);
      const updateUser = {id, putArr};
      var userNewFavArr = update(userData, {
        user: {favPokemon: {$set: putArr}}
      });
      console.log(userNewFavArr);
      setUserData(userNewFavArr);
      console.log(userData);
      await axios.patch("https://minipokedexbackend.herokuapp.com/users/favorite", updateUser).then(() => setIsFav(!isFav));
    } catch(err) {
      err.response.data.msg && setError(err.response.data.msg)
    }
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
    isFav === true ? 
    <div className="Pokemon-card-fav">
      <Popup trigger={<div><img className="Pokemon-card-image" src={pokeFacts.imageUrl} alt="Picture of a pokemon"></img>
      {pokeFacts.name} <button className="favButton" onClick={(e) => {favOrUnfav(e); console.log(isFav)}}>UnFavorite</button></div>} modal>
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
      {pokeFacts.name} <button className="favButton" onClick={(e) => {favOrUnfav(e); console.log(isFav)}}>Favorite</button></div>} modal>
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