import './css/styles.css';
import './css/basiclightbox.min.css';
import sendRequest from './service/apiService';
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
  gallery: document.querySelector('.gallery'),
  load: document.querySelector('.load'),
  clear: document.querySelector('.clear'),
  toStart: document.querySelector('.toStart'),
};

const requestParams = {
  query: '',
  page: 1,
};

function createImage(e) {
  e.preventDefault();
  const query = e.target.children[0].value;
  requestParams.query = query;
  sendRequest(requestParams.query, requestParams.page).then(data => {
    const markup = data.map(el => createMarkup(el));
    refs.gallery.innerHTML = markup;
  });
}

function modalOpen(e) {
  const instance = basicLightbox.create(`
    <img src=${e.target.dataset.source} width="800" height="600">
`);

  instance.show();
}

refs.gallery.addEventListener('click', modalOpen);

refs.form.addEventListener('submit', createImage);
