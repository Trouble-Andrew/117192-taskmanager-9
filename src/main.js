import {getMenuMarkup} from './components/menu.js';
import {getSearchMarkup} from './components/search.js';
import {getFiltersMarkup, getFilter} from './components/filters.js';
import {getBoardMarkup} from './components/board.js';
import {Card} from './components/card.js';
import {CardEdit} from './components/card-edit.js';
import {render, Position, removeElement} from './utils.js';
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
  const taskEdit = new CardEdit(taskMock);
  const tasksContainer = document.querySelector(`.board__tasks`);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.renderElement(tasksContainer);

  // task.getElement()
  //   .querySelector(`.card__btn--edit`)
  //   .addEventListener(`click`, () => {
  //     tasksContainer.replaceChild(taskEdit.getElement(), task.getElement());
  //     document.addEventListener(`keydown`, onEscKeyDown);
  //   });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__save`)
    .addEventListener(`click`, () => {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__delete`)
    .addEventListener(`click`, () => {
      removeElement(taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
      taskEdit.removeElement();
    });


};


taskMocks.forEach((taskMock) => renderCard(taskMock));
