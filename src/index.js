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
  refs.load.classList.add('is-open');
  refs.clear.classList.add('is-open');
  refs.toStart.classList.add('is-open');
  const query = e.target.children[0].value.trim();
  requestParams.page = 1;
  requestParams.query = query;
  if (requestParams.query === '') {
    error({
      text: 'enter something',
      delay: 1000,
    });
    refs.gallery.innerHTML = '';
    refs.load.classList.remove('is-open');
    refs.clear.classList.remove('is-open');
    refs.toStart.classList.remove('is-open');
    return;
  }
  if (query) {
    sendRequest(requestParams.query, requestParams.page).then(data => {
      if (data.length === 0) {
        error({
          text: 'not found',
          delay: 1000,
        });
        refs.gallery.innerHTML = '';
        refs.load.classList.remove('is-open');
        refs.clear.classList.remove('is-open');
        refs.toStart.classList.remove('is-open');
        return;
      }
      const markup = data.map(el => createMarkup(el)).join('');
      refs.gallery.innerHTML = markup;
    });
  }
}

function modalOpen(e) {
  const instance = basicLightbox.create(`
    <img src=${e.target.dataset.source} width="800" height="600">
`);

  instance.show();
}

function goToTop() {
  window.scrollTo({
    top: 100,
    left: 100,
    behavior: 'smooth',
  });
}

function loadMore() {
  sendRequest(requestParams.query, requestParams.page).then(data => {
    requestParams.page += 1;
    const markup = data.map(el => createMarkup(el)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  });
}

function clearAll(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.load.classList.remove('is-open');
  refs.clear.classList.remove('is-open');
  refs.toStart.classList.remove('is-open');
  requestParams.query = '';
}

const observer = new IntersectionObserver(loadMore, {
  root: null,
  rootMargin: '0px',
  threshold: 0,
});

observer.observe(refs.load);

refs.clear.addEventListener('click', clearAll);
refs.load.addEventListener('click', loadMore);
refs.gallery.addEventListener('click', modalOpen);
refs.toStart.addEventListener('click', goToTop);
refs.form.addEventListener('submit', createImage);
