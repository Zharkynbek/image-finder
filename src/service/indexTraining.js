import './css/styles.css';
import './css/basiclightbox.min.css';
import sendRequest from './service/apiService';
import createMarkup from './templates/images.hbs';
import * as basicLightbox from 'basiclightbox';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, defaultModules } from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile';
import { template } from 'handlebars';

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  load: document.querySelector('.load'),
  toStart: document.querySelector('.toStart'),
  clear: document.querySelector('.clear'),
};

const requestParams = {
  query: '',
  page: 1,
};
defaultModules.set(PNotifyMobile, {});

function createImage(e) {
  e.preventDefault();
  requestParams.page = 1;
  refs.gallery.innerHTML = '';
  const query = e.target.children[0].value;
  requestParams.query = query;
  if (requestParams.query === '') {
    error({
      text: 'enter somesthing',
      delay: 1000,
    });
    return;
  }
  refs.load.classList.add('is-open');
  refs.toStart.classList.add('is-open');
  refs.clear.classList.add('is-open');
  sendRequest(requestParams.query, requestParams.page).then(data => {
    if (data.length === 0) {
      error({
        text: 'not found',
        delay: 1000,
      });
      refs.load.classList.remove('is-open');
      refs.toStart.classList.remove('is-open');
      refs.clear.classList.remove('is-open');
    }
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      data.map(el => createMarkup(el)).join(''),
    );
  });
}

function modalOpen(e) {
  const instance = basicLightbox.create(`
    <img src=${e.target.dataset.source} width="800" height="600">
`);

  instance.show();
}
// window.scrollTo(0, 1000);
function loadPage() {
  requestParams.page += 1;
  sendRequest(requestParams.query, requestParams.page).then(data => {
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      data.map(el => createMarkup(el)).join(''),
    );
    const totalScrollHeight = refs.gallery.clientHeight;
    window.scrollTo({
      top: totalScrollHeight,
      behavior: 'smooth',
    });
  });
}

function toTop() {
  window.scrollTo({
    top: 100,
    left: 100,
    behavior: 'smooth',
  });
}

function clearAll(e) {
  e.preventDefault();
  refs.load.classList.remove('is-open');
  refs.toStart.classList.remove('is-open');
  refs.clear.classList.remove('is-open');
  refs.gallery.innerHTML = '';
}

refs.clear.addEventListener('click', clearAll);
refs.toStart.addEventListener('click', toTop);
refs.gallery.addEventListener('click', modalOpen);
refs.load.addEventListener('click', loadPage);
refs.form.addEventListener('submit', createImage);
