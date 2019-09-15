import {Search} from './components/search.js';
import {SiteMenu} from './components/menu.js';
import {BoardController} from './controllers/board.js';
import {SearchController} from './controllers/search.js';
import {StatisticController} from './controllers/statistic.js';
import {createElement, render, Position, unrender} from './utils.js';
import mockArray from './data.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

// Values
export const CARD_COUNT = 9;
const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
let taskMocks = mockArray;
let boardController;
let statisticController;
const siteMenu = new SiteMenu();
const search = new Search();
const onDataChange = (tasks) => {
  taskMocks = tasks;
};
// Render function

render(menuContainer, siteMenu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
boardController = new BoardController(mainContainer, onDataChange);

const onSearchBackButtonClick = () => {
  statisticController.hide();
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
      statisticController.hide();
      searchController.hide();
      unrender(mainContainer.querySelector(`.statistic`));
      boardController.show(taskMocks);
      break;
    case statisticId:
      boardController.hide();
      searchController.hide();
      statisticController = new StatisticController(mainContainer, taskMocks);
      statisticController.show();
      break;
    case newTaskId:
      boardController.createTask();
      if (statisticController) {
        statisticController.hide();
      }
      unrender(mainContainer.querySelector(`.statistic`));
      boardController.show(taskMocks);
      siteMenu.getElement().querySelector(`#${tasksId}`).checked = true;
      break;
  }
});

createElement(search.getElement().addEventListener(`click`, () => {
  statisticController.hide();
  boardController.hide();
  searchController.show(taskMocks);
}));
