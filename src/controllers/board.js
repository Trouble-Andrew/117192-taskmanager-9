import {Board} from './../components/board.js';
import {CardList} from './../components/card-list.js';
import {Sort} from './../components/sort.js';
import {LoadButton} from './../components/load-button.js';
import {CardController} from './../controllers/card.js';
import {render, unrender, Position, removeElement} from './../utils.js';

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
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);

    for (let i = 0; i < this._CARD_COUNT; i++) {
      this._renderTask(this._tasks[i]);
    }

    this._sort.addEvent(`click`, this._onSortLinkClick.bind(this));

    this._loadBtn.addEvent(`click`, this._onloadMoreButtonClick.bind(this));
  }

  _renderBoard(tasks) {
    this._countVariable = 8;
    unrender(this._taskList.getElement());
    unrender(this._loadBtn.getElement());

    this._taskList.removeElement();
    if (this._tasks[this._countVariable + 1]) {
      render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
      for (let i = 0; i < this._CARD_COUNT; i++) {
        this._renderTask(tasks[i]);
      }
      render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);
      this._loadBtn.addEvent(`click`, this._onloadMoreButtonClick.bind(this));
    } else {
      this._tasks.forEach((task) => this._renderTask(task));
    }
  }

  _renderTask(task) {
    const taskController = new CardController(this._taskList, task, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    this._tasks[this._tasks.findIndex((it) => it === oldData)] = newData;
    this._renderBoard(this._tasks);
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
