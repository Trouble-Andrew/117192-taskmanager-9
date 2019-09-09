import {Search} from './components/search.js';
import {getFiltersMarkup, getFilter} from './components/filters.js';
import {SiteMenu} from './components/menu.js';
import {Statistics} from './components/statistics.js';
import {BoardController} from './controllers/board.js';
import {SearchController} from './controllers/search.js';
import {createElement, render, Position} from './utils.js';
import mockArray from './data.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

// Values
export const CARD_COUNT = 9;
const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
let taskMocks = mockArray;
let boardController;
const siteMenu = new SiteMenu();
const statistics = new Statistics();
const search = new Search();
const onDataChange = (tasks) => {
  taskMocks = tasks;
  console.log(taskMocks);
};
console.log(taskMocks);
// Render function

const renderFilters = (container) => {
  container.insertAdjacentHTML(`beforeend`, new Array(1)
    .fill(``)
    .map(getFilter)
    .map(getFiltersMarkup)
    .join(``));
};

render(menuContainer, siteMenu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
renderFilters(mainContainer);
boardController = new BoardController(mainContainer, onDataChange);

const onSearchBackButtonClick = () => {
  statistics.getElement().classList.add(`visually-hidden`);
  searchController.hide();
  boardController.show(taskMocks);
};
const searchController = new SearchController(mainContainer, search.getElement(), onSearchBackButtonClick);

boardController.show(taskMocks);

siteMenu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  const tasksId = `control__task`;
  const statisticId = `control__statistic`;
  const newTaskId = `control__new-task`;

  switch (evt.target.id) {
    case tasksId:
      statistics.getElement().classList.add(`visually-hidden`);
      searchController.hide();
      boardController.show(taskMocks);
      break;
    case statisticId:
      boardController.hide();
      searchController.hide();
      statistics.getElement().classList.remove(`visually-hidden`);
      break;
    case newTaskId:
      boardController.createTask();
      boardController.show(taskMocks);
      siteMenu.getElement().querySelector(`#${tasksId}`).checked = true;
      break;
  }
});

createElement(search.getElement().addEventListener(`click`, () => {
  statistics.getElement().classList.add(`visually-hidden`);
  boardController.hide();
  searchController.show(taskMocks);
}));
