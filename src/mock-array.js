import {getCard} from './data.js';

export const mockArray = [];

const addObjToArray = () => {
  for (let i = 0; i < 22; i++) {
    mockArray.push(getCard());
  }
};

addObjToArray();
