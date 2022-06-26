import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

import { fetchPhoto } from './fetchPoto';

const button = document.querySelector('button');
const search = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const perPage = 40;
let page = 1;
let searchQuery;
loadMoreBtn.classList.add('is-hidden');

const handleSubmit = event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  searchQuery = event.currentTarget.searchQuery.value.trim();
  fetchPhoto(searchQuery, page, perPage)
    .then(photos => {
      if (photos.totalHits < perPage) {
        Notiflix.Notify.success(`We found ${photos.totalHits} results`, {
          timeout: 1000,
        });
        drawPhotos(photos);
        setTimeout(warning, 1500);
      } else {
        proceed(photos);
      }
    })
    .catch(error);
};

function onEntry(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      fetchPhoto(searchQuery, page, perPage).then(photos => {
        let totalPages = photos.totalHits / perPage;
        if (page >= totalPages) {
          warning();
        }
        drawPhotos(photos);
      });
      page += 1;
    }
  });
}

search.addEventListener('submit', handleSubmit);

const observer = new IntersectionObserver(onEntry, {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
});
observer.observe(loadMoreBtn);

function proceed(photos) {
  drawPhotos(photos);
  page += 1;
  loadMoreBtn.classList.remove('is-hidden');
  Notiflix.Notify.success(`We found ${photos.totalHits} results`, {
    timeout: 1000,
  });
}

function warning() {
  loadMoreBtn.classList.add('is-hidden');
  Notiflix.Notify.warning(
    "Were sorry, but you've reached the end of search results.",
    { timeout: 1000 }
  );
}

function drawPhotos(photos) {
  const markup = photos.hits
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
    <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
  <div class="info">
      <p class="info-item">
          <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
          <b>Views</b> ${views}
      </p>
      <p class="info-item">
          <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
          <b>Downloads</b> ${downloads}
      </p>
  </div>
</div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lghtbx();
}

function error(error) {
  loadMoreBtn.classList.add('is-hidden');
}

function lghtbx() {
  const lightbox = new SimpleLightbox('.photo-card a');
  lightbox.on('show.simplelightbox');
  lightbox.refresh();
}
