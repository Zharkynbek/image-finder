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
