import 'dotenv/config';
import express from 'express';
import bodyParser from "body-parser";
import axios from 'axios';
import morgan from 'morgan';


const app = express()
const port = 3000

app.use(morgan('short'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const baseURL='https://api.openweathermap.org/data/2.5/weather?appid='+process.env.API_KEY+'&units=metric';

async function weatherInfo(country) {

    // let res = await axios.get(baseURL+"&q="+country);

    let data = await axios.get(baseURL+"&q="+country)
    .then(function ({data}) {
      let obj = {};
      obj.cod=data.cod;
      obj.message=data.main.temp+"C";
      console.log(obj);
      return obj.message;
    })
    .catch(function (error) {
     let data = error.response.data;
     let obj = {};
      obj.cod=data.cod;
      obj.message=data.message;
      console.log(obj);
      return obj.message
    });
  
    // let data = res.data;
    // console.log(data.main.temp);
    // let output = data.main.temp+"C"
    return data;

  }

app.get('/', (req, res) => {

    res.render('index.ejs');
});

app.get('/getWeather', (req, res) => {

  res.render('index.ejs');
});

app.post('/getWeather',async (req,res)=>{
    //splitting countries with , delimter and generating array
    const allCountries = req.body.country.split(',');
    const countries = allCountries.filter((str) => str.trim() !== '');
    console.log(countries)
    let data = await Promise.all(countries.map(async (country)=>{
            console.log(country.length);
            let out = await weatherInfo(country);
            let obj = {};
            obj[country] = out;
            console.log(obj);
            return JSON.stringify(obj);
    }));

    console.log(typeof(data));
    console.log(data)
    res.render('response.ejs',{
        cities: data
    });
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});