import axios from 'axios';

const BASE_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

const API_KEY = '21071450-3da83358c5a7b15d6eb41d150';

export default async function sendRequest(query, page) {
  return axios
    .get(`${BASE_URL}&q=${query}&page=${page}&per_page=10&key=${API_KEY}`)
    .then(resp => resp.data.hits)
    .catch(error => console.log(error));
}
