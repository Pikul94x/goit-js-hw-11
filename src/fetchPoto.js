import axios from 'axios';
import Notiflix from 'notiflix';
const loadMoreBtn = document.querySelector('.load-more');

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchPhoto(searchQuery, page, perPage) {
  try {
    const { data } = await axios.get(
      `?key=28287622-9fc0cf20b0788b19abfc6bde1&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    console.log(data);
    if (data.hits.length === 0 || searchQuery === '') {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        { timeout: 1000 }
      );
    } else {
      return data;
    }
  } catch (error) {
    error => console.log(error);
  }
}
