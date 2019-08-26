import {Board} from './../components/board.js';
import {CardList} from './../components/card-list.js';
import {Card} from './../components/card.js';
import {CardEdit} from './../components/card-edit.js';
import {Sort} from './../components/sort.js';
import {LoadButton} from './../components/load-button.js';
import {render, Position, removeElement} from './../utils.js';

export class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._sort = new Sort();
    this._taskList = new CardList();
    this._countVariable = 8;
    this._CARD_COUNT = 8;
    this._loadBtn = new LoadButton();
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);

    for (let i = 0; i < this._CARD_COUNT; i++) {
      this._renderTask(this._tasks[i]);
    }

    this._sort.getElement()
    .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    this._loadBtn.getElement().addEventListener(`click`, () => this._onloadMoreButtonClick());
  }

  _renderTask(task) {
    const taskComponent = new Card(task);
    const taskEditComponent = new CardEdit(task);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._taskList.getElement().replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._taskList.getElement().replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, () => {
        this._taskList.getElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._taskList.getElement(), taskComponent.getElement(), Position.BEFOREEND);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._taskList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        sortedByDateUpTasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        sortedByDateDownTasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
      case `default`:
        this._tasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
    }
  }

  _onloadMoreButtonClick() {
    for (let i = 0; i < this._CARD_COUNT; i++) {
      if (this._tasks[this._countVariable + 1]) {
        this._renderTask(this._tasks[this._countVariable + 1]);
        this._countVariable += 1;
      } else {
        removeElement(this._loadBtn.getElement());
        this._loadBtn.removeElement();
      }
    }
  }
}
