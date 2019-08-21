import {getMenuMarkup} from './components/menu.js';
import {getSearchMarkup} from './components/search.js';
import {getFiltersMarkup, getFilter} from './components/filters.js';
import {getBoardMarkup} from './components/board.js';
import {Card} from './components/card.js';
import mockArray from './data.js';

// Values
const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const taskMocks = mockArray;
export const CARD_COUNT = 9;
export const tasks = mockArray;

// Render function
const renderComponent = (markup, container, repeat = 1, callback = () => null) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(`beforeend`, markup);
  }
  callback();
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
});

const renderCard = (taskMock) => {
  const task = new Card(taskMock);
  const tasksContainer = document.querySelector(`.board__tasks`);
  task.renderElement(tasksContainer);
};

taskMocks.forEach((taskMock) => renderCard(taskMock));
