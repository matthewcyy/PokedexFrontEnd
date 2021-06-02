import React, { useState, useEffect } from 'react';
import './Pokemon.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


function Pokemon(props) { // Have app.js pass in props of the jsons to here? Then render their names and pictures, and prepare if click
  const [isFav, setIsFav] = useState(props.favs);
  const pokeFacts = {
    imageUrl: props.pokemon.sprites.front_default,
    name: props.pokemon.name,
    ability: props.pokemon.abilities[0].ability.name,
    numberMoves: props.pokemon.moves.length,
    type: props.pokemon.types,
    stats: props.pokemon.stats
  }

  return (
    <div className="Pokemon-card">
      <Popup trigger={<div><img className="Pokemon-card-image" src={pokeFacts.imageUrl} alt="Picture of a pokemon"></img>
      {pokeFacts.name} <button className="favButton" onClick="location.href='https://teachla.uclaacm.com/'">Favorite</button></div>} modal>
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