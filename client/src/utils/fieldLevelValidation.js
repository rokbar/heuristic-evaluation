import {every} from 'lodash';

export const required = value => value ? undefined : 'Privalomas laukas';

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
    'Neteisingas el. paštas' : undefined;

export const maxLength = (max) => value =>
  value && value.length > max ? `Lauko simbolių skaičius negali viršyti ${max}` : undefined;

export const minLength = (min) => value =>
  value && value.length < min ? `Lauko simbolių skaičius turi būti nemažesnis nei ${min}` : undefined;

export const minLength10 = minLength(10);
export const maxLength50 = maxLength(50);
export const maxLength60 = maxLength(60);
export const maxLength150 = maxLength(150);
export const maxLength100 = maxLength(100);
export const maxLength255 = maxLength(255);
export const maxLengthTEXT = maxLength(16380);

export const imageFile = files => every(files, image => image.name && image.name.match(/\.(jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG)$/))
  ? undefined
  : 'Ne visi pasirinkti failai yra nuotraukos tipo';
