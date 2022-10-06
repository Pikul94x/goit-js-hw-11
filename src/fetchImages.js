import axios from 'axios';

export async function getImg(searchValue, page) {
  const params = new URLSearchParams({
    key: '28287622-9fc0cf20b0788b19abfc6bde1',
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });

  try {
    const response = await axios.get(`https://pixabay.com/api/?${params}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
