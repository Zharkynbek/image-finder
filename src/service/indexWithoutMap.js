import './css/styles.css';
import './css/basiclightbox.min.css';
import getImage from './service/apiService';
import createMarkup from './templates/images.hbs';
import * as basicLightbox from 'basiclightbox';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
// import { alert, defaultModules } from '@pnotify/core';
// import * as PNotifyMobile from '@pnotify/mobile';
// import { template } from 'handlebars';

const refs = {
  form: document.querySelector('.search-form'),
  btn: document.querySelector('.btn'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load'),
  clear: document.querySelector('.clear'),
  input: document.querySelector('.input'),
  toStart: document.querySelector('.toStart'),
  obs: document.querySelector('.list-observer'),
};

const requestParams = {
  query: '',
  page: 1,
};

function imageFinder(e) {
  e.preventDefault();
  const query = e.target[0].value;
  requestParams.query = query;
  refs.gallery.innerHTML = '';
  requestParams.page = 1;
  getImage(requestParams.query, requestParams.page).then(resp => {
    if (resp.data.hits < 1) {
      error({
        text: 'not found',
        delay: 1000,
      });
      refs.clear.classList.remove('is-open');
      refs.loadMore.classList.remove('is-open');
      refs.toStart.classList.remove('is-open');
    }
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(resp.data.hits));
    if (requestParams.query === '') {
      refs.gallery.innerHTML = '';
      error({
        text: 'enter something',
        delay: 1000,
      });
      refs.loadMore.classList.remove('is-open');
      refs.clear.classList.remove('is-open');
      refs.toStart.classList.remove('is-open');
    }
  });
  refs.loadMore.classList.add('is-open');
  refs.clear.classList.add('is-open');
  refs.toStart.classList.add('is-open');
}

function modalOpen(e) {
  if (e.target.nodeName === 'IMG') {
    basicLightbox
      .create(`<img src=${e.target.dataset.source} width="800" height="600">`)
      .show();
  }
}

function loadMoreImage() {
  requestParams.page += 1;
  getImage(requestParams.query, requestParams.page).then(resp => {
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(resp.data.hits));
  });
}

const totalScrollHeight = refs.gallery.clientHeight;
window.scrollTo({
  top: totalScrollHeight,
  behavior: 'smooth',
});

function clearAll(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.loadMore.classList.remove('is-open');
  refs.clear.classList.remove('is-open');
  refs.toStart.classList.remove('is-open');
  refs.input.value = '';
}

function toTop() {
  window.scrollTo({
    top: 100,
    left: 100,
    behavior: 'smooth',
  });
}

refs.toStart.addEventListener('click', toTop);
refs.clear.addEventListener('click', clearAll);
refs.loadMore.addEventListener('click', loadMoreImage);
refs.gallery.addEventListener('click', modalOpen);
refs.form.addEventListener('submit', imageFinder);

const observer = new IntersectionObserver(loadMoreImage, {
  root: null,
  rootMargin: '0px',
  threshold: 0,
});

observer.observe(refs.loadMore);
