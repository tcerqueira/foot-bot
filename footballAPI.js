import fetch from 'node-fetch';

class API {
    constructor(url) {
        this.url = url;
        this.options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        }
    }

    searchTeam(teamName) {
        return fetch(`${this.url}/teams?search=${teamName}`, this.options);
    }

    searchLeague(leagueName) {
        return fetch(`${this.url}/leagues?search=${leagueName}`, this.options);
    }

    teamFixturesInInterval(teamId, from, to) {
        return fetch(`${this.url}/fixtures?season=2022&team=${teamId}&from=${from}&to=${to}`, this.options);
    }
}

const footballAPI = new API('https://api-football-v1.p.rapidapi.com/v3');
export default footballAPI;
