import './css/styles.css';
import './css/basiclightbox.min.css';
import getImage from './service/apiService';
import createMarkup from './templates/images.hbs';
import * as basicLightbox from 'basiclightbox';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  clear: document.querySelector('.clear'),
  load: document.querySelector('.load'),
  toStart: document.querySelector('.toStart'),
};

const requestParams = {
  query: '',
  page: 1,
};

function findImage(e) {
  e.preventDefault();
  const query = e.target[0].value;
  requestParams.query = query;
  requestParams.page = 1;
  getImage(requestParams.query, requestParams.page).then(data => {
    refs.gallery.innerHTML = '';
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    refs.clear.classList.add('is-open');
    refs.load.classList.add('is-open');
    refs.toStart.classList.add('is-open');
    if (data < 1) {
      refs.clear.classList.remove('is-open');
      refs.load.classList.remove('is-open');
      error({
        text: 'not found. try again',
        delay: 1000,
      });
    }
    if (requestParams.query === '') {
      refs.gallery.innerHTML = '';
      refs.clear.classList.remove('is-open');
      refs.load.classList.remove('is-open');
      error({
        text: 'enter something',
        delay: 1000,
      });
    }
  });
}

function clearAll(e) {
  e.preventDefault();
  refs.clear.classList.remove('is-open');
  refs.load.classList.remove('is-open');
  refs.toStart.classList.remove('is-open');
  refs.gallery.innerHTML = '';
  requestParams.query = '';
}

function loadMoreImage() {
  getImage(requestParams.query, requestParams.page).then(data => {
    requestParams.page += 1;
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    const totalScrollHeight = refs.gallery.clientHeight;
    window.scrollTo({
      top: totalScrollHeight,
      behavior: 'smooth',
    });
  });
}

function toTop() {
  window.scrollTo({
    top: -100,
    left: 100,
    behavior: 'smooth',
  });
}

refs.toStart.addEventListener('click', toTop);
refs.load.addEventListener('click', loadMoreImage);
refs.clear.addEventListener('click', clearAll);
refs.form.addEventListener('submit', findImage);
