import { useEffect, useState } from 'react';
import './App.css';
import { getAllPokemon, getPokemon } from './utils/pokemon';
import { Card } from './components/Card/Card';
import Navber from './components/Navber/Navber';



function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const [loding, setLoding] = useState(true);
  const [pokemonData, setPokemonData] = useState([]); 
  const [nextURL, setNextURL] = useState(""); 
  const [prevURL, setPrevURL] = useState(""); 
  
  useEffect(() => {
    const fetchPokemonData = async () => {
      let res = await getAllPokemon(initialURL);
      loadpokemon(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
    }

    fetchPokemonData();
    setLoding(false);
  }, []);


  const loadpokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );

    setPokemonData(_pokemonData);
  }


  const handleNextPage = async () => {
    setLoding(true);
    let data = await getAllPokemon(nextURL);
    await loadpokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoding(false);
  }
  
  const handlePrevPage = async () => {
    if(!prevURL) return;
    setLoding(true);
    let data = await getAllPokemon(prevURL);
    await loadpokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoding(false);
  }

  return (
    <>
      <Navber />
      <div className="App">
        {loding ? (
          <h1>rodding・・</h1>
        ) : (
          <>
            <div className='pokemonCardContainer'>
              {
                pokemonData.map((pokemon, i) => {
                  return <Card key={i} pokemon={pokemon}></Card>
                })
              }
            </div>
          </>
        )}
      </div>
      <div className='btn'>
        <button onClick={handlePrevPage}>return</button>
        <button  onClick={handleNextPage}>next</button>
      </div>
    </>
  );
}

export default App;
