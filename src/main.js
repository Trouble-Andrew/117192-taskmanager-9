import {getMenuMarkup} from './components/menu.js';
import {getSearchMarkup} from './components/search.js';
import {getFiltersMarkup, getFilter} from './components/filters.js';
import {Board} from './components/board.js';
import {CardList} from './components/card-list.js';
import {BoardController} from './controllers/board.js';
import {createElement, render, Position} from './utils.js';
import mockArray from './data.js';

// Values
export const CARD_COUNT = 9;
export const tasks = mockArray;
const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const boardContainer = new Board();
const cardList = new CardList();
const cardListContainer = document.querySelector(`.main`);
const taskMocks = mockArray;
let tasksContainer = document.querySelector(`.board__tasks`);
let boardController = new BoardController(tasksContainer, taskMocks);

// Render function

const renderFilters = (container) => {
  container.insertAdjacentHTML(`beforeend`, new Array(1)
    .fill(``)
    .map(getFilter)
    .map(getFiltersMarkup)
    .join(``));
};

render(menuContainer, createElement(getMenuMarkup()), Position.BEFOREEND);
render(mainContainer, createElement(getSearchMarkup()), Position.BEFOREEND);
renderFilters(mainContainer);
render(mainContainer, boardContainer.getElement(), Position.BEFOREEND);
render(cardListContainer, cardList.getElement(), Position.BEFOREEND);

tasksContainer = document.querySelector(`.board__tasks`);
boardController = new BoardController(tasksContainer, taskMocks);
boardController.init();
