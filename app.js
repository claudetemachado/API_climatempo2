const express = require('express');
const axios =  require('axios');
const path = require('path');
const cors = require('cors');
const config = require('./config.json');
const apikey = config.apikey;

const app = express()
app.listen(3000);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const traducaoClima = {
    "few clouds": "Poucas nuvens",
    "scattered clouds": "Nuvens dispersas",
    "overcast clouds": "Nublado",
    "broken clouds": "Nuvens quebradas",
    "light rain": "Chuva leve",
    "clear sky": "Céu limpo",
    "moderate rain": "Chuva moderada",
    "light snow": "Pouca neve",
    "very heavy rain": "chuva muito forte",
    "thunderstorm with heavy rain": "Trovoada com chuva forte",
    "heavy intensity rain": "chuva de forte intensidade",
    "": ""
}

app.get('/climatempo/:cidade', async(req,res) => {
    const city = req.params.cidade;
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
        if(response.status === 200){
            
            const clima = traducaoClima[response.data.weather[0].description] || response.data.weather[0].description;
            const weatherData = {
                Local: response.data.name,
                Temperatura: response.data.main.temp,
                Umidade: response.data.main.humidity,
                VelocidadeDoVento: response.data.wind.speed,
                Clima: clima
            };
            res.send(weatherData);
        } else{
            res.status(response.status).send({erro: "Erro ao obter dados meteorológicos"});
        }

    }catch(error){
        res.status(500).send({erro: "Erro ao obter dados metereológicos", error});
    }
});