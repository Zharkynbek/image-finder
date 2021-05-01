import './css/styles.css';
import './css/basiclightbox.min.css';
import getImage from './service/apiService';
import createMarkup from './templates/images.hbs';
import * as basicLightbox from 'basiclightbox';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import pagination from 'paginationjs';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  load: document.querySelector('.load'),
  toStart: document.querySelector('.toStart'),
  clear: document.querySelector('.clear'),
  input: document.querySelector('.input'),
};

const requestParams = {
  query: '',
  page: 1,
};
function findImage(e) {
  e.preventDefault();
  const observer = new IntersectionObserver(loadMore, {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  });
  observer.observe(refs.load);

  const query = e.target[0].value;
  requestParams.query = query;
  requestParams.page = 1;
  getImage(requestParams.query, requestParams.page).then(data => {
    refs.gallery.innerHTML = '';
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    if (requestParams.query === '') {
      refs.load.classList.remove('is-open');
      refs.toStart.classList.remove('is-open');
      refs.clear.classList.remove('is-open');
      error({
        text: 'enter something',
        delay: 1000,
      });
      refs.gallery.innerHTML = '';
    }
    if (data.length < 1) {
      refs.load.classList.remove('is-open');
      refs.toStart.classList.remove('is-open');
      refs.clear.classList.remove('is-open');
      error({
        text: 'not found',
        delay: 1000,
      });
      refs.gallery.innerHTML = '';
    }
  });
  refs.load.classList.add('is-open');
  refs.toStart.classList.add('is-open');
  refs.clear.classList.add('is-open');
}

// ================= loadMore
function loadMore() {
  // e.preventDefault();
  requestParams.page += 1;
  getImage(requestParams.query, requestParams.page).then(data => {
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    const totalScrollHeight = refs.gallery.clientHeight;
    // window.scrollTo({
    //   top: totalScrollHeight,
    //   behavior: 'smooth',
    // });
  });
}
//================= toTop

function toTop() {
  window.scrollTo({
    top: -100,
    left: 100,
    behavior: 'smooth',
  });
}

//==================== clearAll

function clearAll(e) {
  e.preventDefault();
  refs.input.value = '';
  refs.load.classList.remove('is-open');
  refs.toStart.classList.remove('is-open');
  refs.clear.classList.remove('is-open');
  refs.gallery.innerHTML = '';
}

function modalOpen(e) {
  basicLightbox
    .create(`<img src=${e.target.dataset.source} width="800" height="600">`)
    .show();
}

refs.gallery.addEventListener('click', modalOpen);
refs.clear.addEventListener('click', clearAll);
refs.toStart.addEventListener('click', toTop);
refs.load.addEventListener('click', loadMore);
refs.form.addEventListener('submit', findImage);

// pagination

// $('#pagination-container').pagination({
//   dataSource: function (done) {
//     $.ajax({
//       type: 'GET',
//       url: getImage(requestParams.query, requestParams.page),
//       success: function (data) {
//         done(data.hits);
//       },
//     });
//   },
//   pageSize: 10,
//   autoHidePrevious: true,
//   autoHideNext: true,
//   callback: function (data, pagination) {
//     // template method of yourself
//     const html = createMarkup(data);
//     $('#data-container').html(html);
//   },
// });
