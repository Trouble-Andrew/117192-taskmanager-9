import {getMenuMarkup} from './components/menu.js';
import {getSearchMarkup} from './components/search.js';
import {getFiltersMarkup, getFilter} from './components/filters.js';
import {getBoardMarkup} from './components/board.js';
import {getCardMarkup} from './components/card.js';
import {getCardEditMarkup} from './components/card-edit.js';
import {getLoadButtonMarkup} from './components/load-button.js';
import mockArray from './data.js';

// Values
const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
export const CARD_COUNT = 9;
export const tasks = mockArray;
let tasksForLoad = mockArray;

// Render function
const renderComponent = (markup, container, repeat = 1, callback = () => null) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(`beforeend`, markup);
  }
  callback();
};

const renderCardEdit = (container) => {
  let {description, dueDate, repeatingDays, tags, color} = tasksForLoad[0];
  container.insertAdjacentHTML(`beforeend`, getCardEditMarkup({description, dueDate, repeatingDays, tags, color}));
  tasksForLoad = tasksForLoad.slice(1);
};

const renderCards = (container, count) => {
  count = count <= tasksForLoad.length ? count : tasksForLoad.length;
  for (let i = 0; i < count; i++) {
    let {description, dueDate, repeatingDays, tags, color} = tasksForLoad[i];
    container.insertAdjacentHTML(`beforeend`, getCardMarkup({description, dueDate, repeatingDays, tags, color}));
  }
  tasksForLoad = tasksForLoad.slice(count);
};

const renderFilters = (container) => {
  container.insertAdjacentHTML(`beforeend`, new Array(1)
    .fill(``)
    .map(getFilter)
    .map(getFiltersMarkup)
    .join(``));
};

//
renderComponent(getMenuMarkup(), menuContainer);
renderComponent(getSearchMarkup(), mainContainer);
renderFilters(mainContainer);
renderComponent(getBoardMarkup(), mainContainer, 1, () => {
  const boardContainer = document.querySelector(`.board`);
  const taskListContainer = document.querySelector(`.board__tasks`);

  renderCardEdit(taskListContainer);
  renderCards(taskListContainer, CARD_COUNT);

  renderComponent(getLoadButtonMarkup(), boardContainer);
  const loadMoreButton = document.querySelector(`.load-more`);

  const loadMoreButtonHandler = () => {
    renderCards(taskListContainer, CARD_COUNT);
    if (tasksForLoad.length === 0) {
      loadMoreButton.removeEventListener(`click`, loadMoreButtonHandler);
      loadMoreButton.remove();
    }
  };
  loadMoreButton.addEventListener(`click`, loadMoreButtonHandler);
});
