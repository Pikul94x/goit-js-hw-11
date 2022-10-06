import { getImg } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-btn');

let page;
let displayedImages;

form.addEventListener('submit', newSearch);
loadMoreBtn.addEventListener('click', loadMoreImg);

function newSearch(e) {
  e.preventDefault();
  loadMoreBtn.style.display = 'none';
  page = 1;
  gallery.innerHTML = '';
  fetchImg();
}

function loadMoreImg() {
  page++;
  fetchImg();
}

function fetchImg() {
  getImg(input.value.trim(), page)
    .then(res => renderImg(res))
    .catch(error => error);
}

function renderImg({ hits, totalHits }) {
  console.log(hits);
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
  <a href="${largeImageURL}"><img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a');

  displayedImages = totalHits - page * 40;
  checkingLeftImages();

  if (displayedImages <= 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (displayedImages > 0 && displayedImages === totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else if (displayedImages > 0 && page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

function checkingLeftImages() {
  if (page === 0) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
}
