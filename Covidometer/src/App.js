import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 24, lng: 54 });
  const [mapZoom, setMapZoom] = useState(2);
  const [vaccine,setvaccine]=useState(0);
  const [vaccinedata,setvaccinedata]=useState({});


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
      fetch("https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1")
      .then((response) => response.json())
      .then((data) => {
        var date = new Date();
        date.setDate(date.getDate()-1);
        const yesterday=(date.getMonth()+1) + '/' + date.getDate() + '/' + (date.getFullYear()-2000)
        const myvaccine = data.map((country) => ({
          name: country.country,
          number: country.timeline[yesterday],
        }));
        let totalPrice = myvaccine.reduce(function (accumulator, item) {
          return accumulator + item.number;
        }, 0);
        myvaccine.push({name:"worldwide",
        number:totalPrice
      });
      const dict={};
      for(var i=0;i<myvaccine.length;i++){
          dict[myvaccine[i].name]=myvaccine[i].number
      }
      setvaccinedata(dict);
      setvaccine(dict["worldwide"])
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        if((countryCode === "worldwide")){
        setMapCenter([24, 54])
        setMapZoom(2)
        }
        else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
        }
        console.log("TTTTTTTTTTTTTT",countryCode)
        console.log("vaccinated",vaccinedata[countryCode])
        setvaccine(vaccinedata[countryCode])
      })
  };

  return (
    <div className="app" style={{background:"#993366"}}>
      <div className="app__left">
        <div className="app__header">
          <h1 style={{color: "white",textDecoration: "underline"}}>COVID-o-meter</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide" countryname="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.name}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
          <InfoBox 
          onClick={(e) => setCasesType("vaccinated")}
          title="Vaccinated" 
          active={casesType === "vaccinated"}
          cases={prettyPrintStat(vaccine)} 
          total={countryInfo['vaccine']}>

          </InfoBox>
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          vaccine={vaccinedata}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={(casesType==="vaccinated")?"vaccinated":casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
