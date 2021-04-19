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
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      data.map(el => createMarkup(el)),
    );
  });
  refs.load.classList.add('is-open');
  refs.clear.classList.add('is-open');
  refs.toStart.classList.add('is-open');
}

function modalOpen(e) {
  if (e.target.nodeName === 'IMG') {
    const instance = basicLightbox.create(`
    <img src=${e.target.dataset.source} width="800" height="600">
`);

    instance.show();
  }
}

function loadMore() {
  requestParams.page += 1;
  sendRequest(requestParams.query, requestParams.page).then(data => {
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      data.map(el => createMarkup(el)),
    );
    const totalScrollHeight = refs.gallery.clientHeight;
    window.scrollTo({
      top: totalScrollHeight,
      behavior: 'smooth',
    });
  });
}

function clearAll(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.load.classList.remove('is-open');
  refs.clear.classList.remove('is-open');
  refs.toStart.classList.remove('is-open');
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
refs.load.addEventListener('click', loadMore);
refs.gallery.addEventListener('click', modalOpen);
refs.form.addEventListener('submit', createImage);