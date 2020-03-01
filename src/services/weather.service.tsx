import axios from "axios";

export class WeatherService {
    static async getWeatherInfoByCity(city: string) {
        let url = process.env.REACT_APP_OWM_API_URL;
        url = `${url}/weather?q=${city}&appid=${process.env.REACT_APP_OWM_API_KEY}`;
        return await axios.get(url);
    }
}