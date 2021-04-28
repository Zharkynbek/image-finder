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
  gallery: document.querySelector('.gallery'),
  load: document.querySelector('.load'),
  clear: document.querySelector('.clear'),
  input: document.querySelector('.input'),
  toStart: document.querySelector('.toStart'),
};

const requestParams = {
  query: '',
  page: 1,
};

function findImage(e) {
  e.preventDefault();
  const query = e.target[0].value.trim();
  requestParams.query = query;
  refs.gallery.innerHTML = '';
  requestParams.page = 1;
  if (query) {
    getImage(requestParams.query, requestParams.page).then(data => {
      console.log(requestParams.query);
      refs.load.classList.add('is-open');
      refs.clear.classList.add('is-open');
      refs.toStart.classList.add('is-open');
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data));
      if (data.length < 1) {
        refs.load.classList.remove('is-open');
        refs.clear.classList.remove('is-open');
        refs.toStart.classList.remove('is-open');
        error({
          text: 'sorry bro, this page not exist',
          delay: 1000,
        });
      }
      if (requestParams.query === '') {
        error({
          text: 'error',
          delay: 1000,
        });
      }
    });
  }
}

function openModal(e) {
  if (e.target.nodeName === 'IMG') {
    basicLightbox
      .create(
        `
    <img src="${e.target.dataset.source}" width="800" height="600">`,
      )
      .show();
  }
}

function loadMoreImage(e) {
  e.preventDefault();
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

function clearAll(e) {
  e.preventDefault();
  refs.input.value = '';
  refs.load.classList.remove('is-open');
  refs.clear.classList.remove('is-open');
  refs.toStart.classList.remove('is-open');
  refs.gallery.innerHTML = '';
}

function toTop() {
  window.scrollTo({
    top: -100,
    left: 100,
    behavior: 'smooth',
  });
}

refs.toStart.addEventListener('click', toTop);
refs.clear.addEventListener('click', clearAll);
refs.load.addEventListener('click', loadMoreImage);
refs.gallery.addEventListener('click', openModal);
refs.form.addEventListener('submit', findImage);
