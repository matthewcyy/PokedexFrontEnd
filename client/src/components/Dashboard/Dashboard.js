import React, { useState, useEffect } from 'react';

import Pokemon from './Pokemon.js'
import Pagination from './Pagination.js'
import './Dashboard.css';
import './Pokemon.css';

// import PokemonCard from './PokemonCard.js';

// Fetches a bunch of pokemon url's from the api to later be passed into the pokemon cards and rendered
// Next, need to implement PokemonCard class
// Also, may either use infinite scroll or next page, but must use setApiUrl and/or setOffset to update what we're getting
// If use infinite scroll, since you can scroll back up, just want to update the limit rather than the offset

function Dashboard() {
  const [endPoint1, setEndPoint1] = useState(0);
  const [endPoint2, setEndPoint2] = useState(30);
  const [multPokemons, setMultPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    if (searchTerm !== "") {
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
    setEndPoint1((pageIndex-1)*30)
    setEndPoint2(pageIndex*30)
    console.log(endPoint1);
  }

  return (
    <div className="Dashboard">
      <br/>
        <input type="text" placeholder="Search" onChange={event => {setSearchTerm(event.target.value.toLowerCase())}}/>
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
      
      <div className="Dashboard-pokemoncontainer">
        {multPokemons.map((pokemon, i) => (
          <Pokemon key={i} pokemon={pokemon} />
        ))}
      </div>

      <div className="Dashboard-pageHandlers">
          <Pagination changePage = {changePageView} pageLimit = {5}/>
      </div>

    </div>
  );
}

export default Dashboard;