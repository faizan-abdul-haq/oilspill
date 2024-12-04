import React ,{useState,useEffect} from 'react'
import countries from '../countries'


function CountrySelector ({selectedCountry,handleChange}){
    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
      // Load the countries from the JSON file
      setCountryList(countries);
    }, []);
  
    return (
      <select value={selectedCountry} onChange={handleChange}>
        <option value="" disabled>Select your country</option>
        {countryList.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>
    );
  };
  
  export default CountrySelector;