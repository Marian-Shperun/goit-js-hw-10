import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const inputEl = document.querySelector('input#search-box');
const contrylist = document.querySelector('.country-list');
const contryInfo = document.querySelector('.country-info');
const loader = document.querySelector('.loader');

const DEBOUNCE_DELAY = 300;

const filteredParameters = [
  'name',
  'capital',
  'population',
  'flags',
  'languages',
];

inputEl.addEventListener('input', debounce(startSearch, DEBOUNCE_DELAY));

function startSearch() {
  loaderOn();
  clearingMarkup();

  let velueInput = inputEl.value.trim();

  if (!velueInput) {
    loaderOff();
    return;
  }

  fetchCountries(velueInput, filteredParameters.join())
    .then(countries => {
      console.log(countries.length);

      if (countries.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      render(countries);
    })
    .catch(err => {
      console.log(err);

      Notify.failure('Oops, there is no country with that name');
    })
    .finally(() => {
      loaderOff();
    });
}

function render(countries) {
  if (countries.length >= 2 && countries.length <= 10) {
    return (contrylist.innerHTML = createMarkup(countries));
  }

  return (contryInfo.innerHTML = createMarkup(countries));
}

function createMarkup(countries) {
  return countries
    .map(country => {
      const { name, capital, population, flags, languages } = country;
      const listLang = Object.values(languages).join(', ');
      console.log(country);
      if (countries.length > 1) {
        return `
        <li>
          <img src="${flags.svg}" width="30" alt="${name.official}">
          <h3>${name.official}</h3>
        </li>
      `;
      }
      return `
        <img src="${flags.svg}" width="30" alt="${name.official}" />
          <h3>${name.official}</h3>
            <p>
              <b>Capital: ${capital}</b>
            </p>
            <p>
              <b>Population: ${population}</b>
            </p>
            <p>
              <b>Language: ${listLang}</b>
            </p>
      `;
    })
    .join('');
}

function clearingMarkup() {
  contrylist.innerHTML = '';
  contryInfo.innerHTML = '';
}

function loaderOn() {
  loader.classList.add('visible');
}
function loaderOff() {
  loader.classList.remove('visible');
}
