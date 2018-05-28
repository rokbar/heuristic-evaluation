import {every, reduce} from 'lodash';

const MAX_IMAGES_SIZE = 2 * 1024 * 1024;

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

export const imageFile = files => {
  const imagesExtensions = /\.(jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG)$/;
  return every(files, ({name, path}) => (name && name.match(imagesExtensions)) || (path && path.match(imagesExtensions)))
    ? undefined
    : 'Ne visi pasirinkti failai yra nuotraukos tipo';
};

export const imagesSize = files => MAX_IMAGES_SIZE < reduce(files, (sum, {removed, size}) => sum += (!removed && size) || 0, 0)
  ? 'Bendras visų nuotraukų dydis negali viršyti 2MB'
  : undefined;
