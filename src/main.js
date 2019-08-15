import {getMenuMarkup} from './components/menu.js';
import {getSearchMarkup} from './components/search.js';
import {getFiltersMarkup} from './components/filters.js';
import {getBoardMarkup} from './components/board.js';
import {getCardMarkup} from './components/card.js';
import {getCardEditMarkup} from './components/card-edit.js';
import {getLoadButtonMarkup} from './components/load-button.js';
import {getCard, getFilter} from './data.js';

// Values
const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
const CARD_COUNT = 3;

let tasks = []; // Массив с объектами тасков

// Render function
const renderComponent = (markup, container, repeat = 1, callback = () => null) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(`beforeend`, markup);
  }
  callback();
};

const renderCards = (container, count) => {
  container.insertAdjacentHTML(`beforeend`, new Array(count)
    .fill(``)
    // .map(getCard)
    .map(function (card) {
      card = getCard();
      tasks.push(card);
      return card;
    })
    .map(getCardMarkup)
    .join(``));
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
// renderComponent(getFiltersMarkup(), mainContainer);

renderFilters(mainContainer);

renderComponent(getBoardMarkup(), mainContainer, 1, () => {
  const boardContainer = document.querySelector(`.board`);
  const taskListContainer = document.querySelector(`.board__tasks`);

  renderComponent(getCardEditMarkup(), taskListContainer);
  // renderComponent(getCardMarkup(), taskListContainer, CARD_COUNT);

  renderCards(taskListContainer, CARD_COUNT);

  renderComponent(getLoadButtonMarkup(), boardContainer);
});

// console.log(tasks[0].dueDate);

const filter = (value) => {
  switch (value) {
    case `isFavorite`:
      let count = 0;
      tasks.forEach((task) => task[value] ? count++ : null);
      console.log(count);
      break;
  }
};

// console.log(filter(`isFavorite`));
