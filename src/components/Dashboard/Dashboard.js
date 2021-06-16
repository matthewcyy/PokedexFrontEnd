import React, { useState, useEffect, useContext } from 'react';

import Pokemon from './Pokemon.js'
import Pagination from './Pagination.js'
import './Dashboard.css';
import './Pokemon.css';
import UserContext from '../../context/userContext';
import update from 'immutability-helper';


import axios from 'axios';


// import PokemonCard from './PokemonCard.js';

// Fetches a bunch of pokemon url's from the api to later be passed into the pokemon cards and rendered
// Next, need to implement PokemonCard class
// Also, may either use infinite scroll or next page, but must use setApiUrl and/or setOffset to update what we're getting
// If use infinite scroll, since you can scroll back up, just want to update the limit rather than the offset

function Dashboard() {
  const { userData, setUserData } = useContext(UserContext);

  const [endPoint1, setEndPoint1] = useState(0);
  const [endPoint2, setEndPoint2] = useState(30);
  const [multPokemons, setMultPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favPokemons, setFavPokemons] = useState([]);
  const [id, setId] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    setFavPokemons(userData?.user?.favPokemon);
    setId(userData.user.id);
  }, []);

  function isFav(pokemonName) {
    const found = (element) => element === pokemonName
    const isFound = (favPokemons).some(found);
    return isFound;
  }

  const updateFavs = async () => {
    try {
      var putArr = [...favPokemons];
      const updateUser = { id, putArr };
      var userNewFavArr = update(userData, {
        user: { favPokemon: { $set: putArr } }
      });
      setUserData(userNewFavArr);
      await axios.patch("https://minipokedexbackend.herokuapp.com/users/favorite", updateUser)
    } catch (err) {
      setError(err.message)
    }
  }
  useEffect(() => {
    updateFavs()
  }, [favPokemons])


  const baseApiUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=898";

  useEffect(() => {
    fetch(baseApiUrl)
      .then(response => response.json())
      .then(data => {
        const urls = data.results.slice(endPoint1, endPoint2).map((data) => data.url); // Fetching results array's indices
        Promise.all(
          urls.map((eachURL) => fetch(eachURL).then((res) => res.json()))
        ).then((res) => setMultPokemons(res));
      })
  }, [endPoint1, endPoint2])

  useEffect(() => {

    if (searchTerm === "favorites" || searchTerm === "favorite") { // Show all favorited pokemon
      fetch(baseApiUrl)
        .then(response => response.json())
        .then(data => {
          const containStr = data.results.filter((data) => favPokemons.includes(data.name)); // Check each pokemon to see if its name is in the fav pokemon list
          const urls = containStr.map((pokemonId) => pokemonId.url);
          Promise.all(
            urls.map((eachURL) => fetch(eachURL).then((res) => res.json()))
          ).then((res) => setMultPokemons(res));
        })
    }
    
    else if (searchTerm !== "") {
      fetch(baseApiUrl)
        .then(response => response.json())
        .then(data => {
          const containStr = data.results.filter((data) => data.name.includes(searchTerm));
          const urls = containStr.map((pokemonId) => pokemonId.url);
          Promise.all(
            urls.map((eachURL) => fetch(eachURL).then((res) => res.json()))
          ).then((res) => setMultPokemons(res));
        })
    }
    
    else {
      fetch(baseApiUrl)
        .then(response => response.json())
        .then(data => {
          const urls = data.results.slice(endPoint1, endPoint2).map((data) => data.url); // Fetching results array's indices
          Promise.all(
            urls.map((eachURL) => fetch(eachURL).then((res) => res.json()))
          ).then((res) => setMultPokemons(res));
        })
    }
  }, [searchTerm])

  function nextPage() {
    setEndPoint1(endPoint2);
    setEndPoint2(endPoint2 + 30);
  }

  function prevPage() {
    setEndPoint2(endPoint1);
    setEndPoint1(endPoint1 - 30);
  }

  function changePageView(pageIndex) {
    setEndPoint1((pageIndex - 1) * 30)
    setEndPoint2(pageIndex * 30)
  }

  return (
    <div className="Dashboard">
      <br />
      <input type="text" placeholder="Search" onChange={event => { setSearchTerm(event.target.value.toLowerCase()) }} />
      {/* Write this pagination below in a separate component to render */}
      { endPoint1 !== 0 && endPoint1 !== 870 ?
        <div>
          <button className="Dashboard-PrevButton" onClick={() => prevPage()}> Prev</button>
          <button className="Dashboard-NextButton" onClick={() => nextPage()}> Next</button>
        </div>
        :
        endPoint1 == 0 ?
          <div>
            <button className="Dashboard-NextButton" onClick={() => nextPage()}> Next</button>
          </div>
          :
          <div>
            <button className="Dashboard-NextButton" onClick={() => prevPage()}> Prev</button>
          </div>
      }

      {/* Place the code for liking and determining of something should be liked/rendered as liked here */}
      <div className="Dashboard-pokemoncontainer">
        {multPokemons.map((pokemon, i) => (
          <Pokemon key={i} pokemon={pokemon} isFav={isFav(pokemon.name)} setFav={setFavPokemons} favPokemon={favPokemons} />
        ))}
      </div>

      <div className="Dashboard-pageHandlers">
        <Pagination changePage={changePageView} pageLimit={5} />
      </div>

    </div>
  );
}

export default Dashboard;
