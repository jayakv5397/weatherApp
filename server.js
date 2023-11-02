import express from 'express';
import bodyParser from "body-parser";
import axios from 'axios';

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const baseURL='https://api.openweathermap.org/data/2.5/weather?appid=145f5de071e552fcf321dd0bd0d2b44a&units=metric';

async function weatherInfo(country) {

    let res = await axios.get(baseURL+"&q="+country);
  
    let data = res.data;
    console.log(data.main.temp);
    return data.main.temp+"C"
  }

  let cities=[{"paris":"13.27C"},{"tirupati":"25.57C"},{"bangalore":"25.8C"}];

app.get('/', (req, res) => {

    res.render('index.ejs');
})

app.post('/getWeather',async (req,res)=>{
    //splitting countries with , delimter and generating array
    const countries = req.body.country.split(',');
    console.log(countries)
    let data = await Promise.all(countries.map(async (country)=>{
            let out = await weatherInfo(country);
            // data.push(out);
            let obj = {};
            obj[country] = out;
            // console.log(obj);
            // data.push(obj);
            console.log(obj);
            return JSON.stringify(obj);
    }));

    // const data = weatherInfo(req.body.country)
    console.log(typeof(data));
    console.log(data)
    res.render('response.ejs',{
        cities: data
    });})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})