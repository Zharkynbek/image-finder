import axios from 'axios';

const BASE_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

export default function sendRequest(query, page) {
  return axios.get(
    `${BASE_URL}&q=${query}&page=${page}&per_page=12&key=15900106-2c235e732bb321ca7ec900d93`,
  );
}
