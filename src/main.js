import {getMenuMarkup} from './components/menu.js';
import {getSearchMarkup} from './components/search.js';
import {getFiltersMarkup} from './components/filters.js';
import {getBoardMarkup} from './components/board.js';
import {getCardMarkup} from './components/card.js';
import {getCardEditMarkup} from './components/card-edit.js';
import {getLoadButtonMarkup} from './components/load-button.js';

// Values
const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const CARD_COUNT = 3;

// Render function
const renderComponent = (markup, container, repeat = 1, callback = () => undefined) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(`beforeend`, markup);
  }
  callback();
};

//
renderComponent(getMenuMarkup(), menuContainer);
renderComponent(getSearchMarkup(), mainContainer);
renderComponent(getFiltersMarkup(), mainContainer);
renderComponent(getBoardMarkup(), mainContainer, 1, () => {
  const boardContainer = document.querySelector(`.board`);
  const taskListContainer = document.querySelector(`.board__tasks`);

  renderComponent(getCardEditMarkup(), taskListContainer);
  renderComponent(getCardMarkup(), taskListContainer, CARD_COUNT);
  renderComponent(getLoadButtonMarkup(), boardContainer);
});
