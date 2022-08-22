const URL = 'https://restcountries.com/v3.1/name';

export function fetchCountries(name, params) {
  return fetch(`${URL}/${name}?fields=${params}`)
    .then(data => {
    if (!data.ok) {
      throw new Error(data.status);
    }
    return data.json();
  });
}
