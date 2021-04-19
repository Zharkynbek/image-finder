export default function sendRequest(query, page) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=6&key=21071450-3da83358c5a7b15d6eb41d150`,
  )
    .then(resp => resp.json())
    .then(data => {
      return data.hits;
    })
    .catch(error => console.log(error));
}

// import axios from 'axios';

// const BASE_URL =
//   'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

// export default function sendRequest(query, page) {
//   return axios.get(
//     `${BASE_URL}&q=${query}&page=${page}&per_page=12&key=21071450-3da83358c5a7b15d6eb41d150`,
//   );
// }
