import {shuffle} from './utils.js';

const mockArray = [];
const description = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];
const tags = new Set([`homework`, `theory`, `practice`, `intensive`, `keks`]);
const repeatingDays = () => ({
  'mo': false,
  'tu': false,
  'we': Boolean(Math.round(Math.random())),
  'th': false,
  'fr': false,
  'sa': false,
  'su': false,
});
const color = new Set([`black`, `yellow`, `blue`, `green`, `pink`]);

// const getCard = () => ({
//   description: description[Math.floor(Math.random() * 3)],
//   dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
//   tags: shuffle(Array.from(tags)).slice(1, 4),
//   repeatingDays: repeatingDays(),
//   color: Array.from(color)[Math.floor(Math.random() * 5)],
//   isFavorite: Boolean(Math.round(Math.random())),
//   isArchive: Boolean(Math.round(Math.random())),
//   dateSwitch: Boolean(Math.round(Math.random())),
//   repeatSwitch: Boolean(Math.round(Math.random())),
// });

const getCard = function () {
  let repeat = Boolean(Math.round(Math.random()));
  let randomDate = Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000;
  console.log(repeat);
  return {
    description: description[Math.floor(Math.random() * 3)],
    dueDate: repeat === true ? randomDate : null,
    tags: shuffle(Array.from(tags)).slice(1, 4),
    repeatingDays: repeatingDays(),
    color: Array.from(color)[Math.floor(Math.random() * 5)],
    isFavorite: Boolean(Math.round(Math.random())),
    isArchive: Boolean(Math.round(Math.random())),
    dateSwitch: Boolean(Math.round(Math.random())),
    repeatSwitch: repeat,
  };
};

const addObjToArray = (count) => {
  for (let i = 0; i < count; i++) {
    mockArray.push(getCard());
  }
};

addObjToArray(10);
export default mockArray;
