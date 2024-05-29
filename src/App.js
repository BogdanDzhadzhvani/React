import './App.css';
import results from './Results';
import data from './data';


const PopulationDataItem = ({ year, population }) => (
  <div>
    <p>Year: {year}</p>
    <p>Population: {population}</p>
  </div>
);



const ResultsItem = ({name, hair_color, eye_color, gender}) => {
  return (
    <div className='results-item'>
      <h2>{name}</h2>
      {hair_color !== "n/a" && hair_color.toLowerCase() !== "none" && <p>Hair color: {hair_color}</p> }
      <p>Eye Color: {eye_color !== "n/a" && <span style={{ color: eye_color }}>{eye_color}</span>}</p>
      {gender && <p>Gender: {gender}</p>}
    </div>
  )
}

const Character = ({ name }) => {
  return (
      <div>
          <p>Name: { name }</p>
      </div>
  )
}

const Episode = ({ name,airDate,characters }) => {
  return (
      <div>
          <h2>{name}</h2>
          <p>airDate: {airDate}</p>
          <h3>Characters</h3>
          <ul>
          {characters.map((character, index) => (
  <li key={index}>
    <Character name={character.name} />
  </li>
))}
          </ul>
      </div>
  )
}

const Episodes = ({ episodes }) => {
  return (
    <div>
      <h1>Episodes</h1>
      {episodes.map((episode, index) => (
  <Episode
    key={index} 
    name={episode.name}
    airDate={episode.air_date}
    characters={episode.characters}
  />
))}
    </div>
  );
};


const App = () => {
  return (
    <div>
      <h1>Population Data</h1>
      {data.map((item) => (
        <PopulationDataItem
          key={item['ID Year']}
          year={item['Year']}
          population={item['Population']}
        />
      ))}
      
      <h1>Star Wars Characters</h1>
      {results.map((item, index) => (
        <ResultsItem
          key={index}
          name={item.name}
          hair_color={item.hair_color}
          eye_color={item.eye_color}
          gender={item.gender}
        />
      ))}
    </div>
  );
}

export default App;