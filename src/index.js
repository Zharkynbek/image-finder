import './css/styles.css';
import './css/basiclightbox.min.css';
import getData from './service/apiService';
import createMarkup from './templates/images.hbs';
import * as basicLightbox from 'basiclightbox';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  load: document.querySelector('.load'),
};

const requestParams = {
  query: '',
  page: 1,
};

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  if (requestParams.query !== e.target.children[0].value) {
    refs.gallery.innerHTML = '';
  }
  requestParams.query = e.target.children[0].value;
  getData(requestParams.query, requestParams.page).then(({ data }) => {
    if (data.hits < 1) {
      error({
        text: 'Sorry, image not found',
        delay: 2000,
      });
    }
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
  });
});

refs.gallery.addEventListener('click', e => {
  console.log(e.target.dataset.source);
  if (e.target.nodeName === 'IMG') {
    basicLightbox
      .create(`<img src=${e.target.dataset.source} width="800" height="600">`)
      .show();
  }
});

refs.load.addEventListener('click', e => {
  requestParams.page += 1;
  getData(requestParams.query, requestParams.page).then(({ data }) => {
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    const totalScrollHeight = refs.gallery.clientHeight + 80;
    setTimeout(() => {
      window.scrollTo({
        top: totalScrollHeight,
        behavior: 'smooth',
      });
    }, 500);
  });
});
