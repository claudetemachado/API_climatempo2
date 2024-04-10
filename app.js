// Importação dos módulos necessários
const express = require('express'); // Express para criação do servidor
const axios = require('axios'); // Axios para fazer requisições HTTP
const path = require('path'); // Path para manipulação de caminhos de arquivos
const cors = require('cors'); // Cors para permitir solicitações de diferentes origens
const config = require('./config.json'); // Importa as configurações do arquivo config.json
const apikey = config.apikey; // Extrai a chave de API do arquivo de configuração

const app = express(); // Criação de uma instância do servidor Express
app.listen(3000); // O servidor é configurado para escutar na porta 3000

app.use(cors()); // Middleware para habilitar o CORS
app.use(express.json()); // Middleware para analisar dados JSON das solicitações
app.use(express.static(path.join(__dirname, 'public'))); // Middleware para servir arquivos estáticos do diretório 'public'

// Mapeamento de traduções de condições climáticas
const traducaoClima = {
    // Mapeamento das condições climáticas para tradução em português
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

};

// Rota para obter dados meteorológicos com base na cidade fornecida
app.get('/climatempo/:cidade', async (req, res) => {
    const city = req.params.cidade; // Obtém o nome da cidade a partir dos parâmetros da URL

    try {
        // Faz uma requisição à API do OpenWeatherMap para obter dados meteorológicos da cidade fornecida
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);

        if (response.status === 200) {
            // Se a solicitação for bem-sucedida, prepara os dados meteorológicos para resposta
            const clima = traducaoClima[response.data.weather[0].description] || response.data.weather[0].description;
            const weatherData = {
                Local: response.data.name,
                Temperatura: response.data.main.temp,
                Umidade: response.data.main.humidity,
                VelocidadeDoVento: response.data.wind.speed,
                Clima: clima
            };
            res.send(weatherData); // Retorna os dados meteorológicos para o cliente
        } else {
            // Se a solicitação falhar, retorna um erro
            res.status(response.status).send({ erro: "Erro ao obter dados meteorológicos" });
        }

    } catch (error) {
        // Se ocorrer um erro durante o processamento, retorna um erro interno do servidor
        res.status(500).send({ erro: "Erro ao obter dados metereológicos", error });
    }
});
