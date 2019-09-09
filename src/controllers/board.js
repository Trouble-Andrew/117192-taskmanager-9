import {Board} from './../components/board.js';
import {CardList} from './../components/card-list.js';
import {Sort} from './../components/sort.js';
import {LoadButton} from './../components/load-button.js';
import {TaskListController} from './task-list.js';
import {render, unrender, Position} from './../utils.js';

const TASKS_IN_ROW = 8;

export class BoardController {
  constructor(container, onDataChange) {
    this._container = container;
    this._tasks = [];
    this._onDataChangeMain = onDataChange;
    this._board = new Board();
    this._sort = new Sort();
    this._taskList = new CardList();
    this._CARD_COUNT = 8;
    this._showedTasks = this._CARD_COUNT;
    this._loadBtn = new LoadButton();
    this._onSortLinkClick = this._onSortLinkClick.bind(this);
    this._onloadMoreButtonClick = this._onloadMoreButtonClick.bind(this);

    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange.bind(this));

    this.init();
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);

    this._sort.addEvent(`click`, this._onSortLinkClick);

    this._loadBtn.addEvent(`click`, this._onloadMoreButtonClick);
  }

  createTask() {
    this._taskListController.createTask();
  }

  _renderBoard() {
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);

    unrender(this._loadBtn.getElement());
    this._loadBtn.removeElement();
    if (this._showedTasks < this._tasks.length) {
      render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);
    }

    this._taskListController.setTasks(this._tasks.slice(0, this._showedTasks));
    this._loadBtn.addEvent(`click`, this._onloadMoreButtonClick);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
    this._onDataChangeMain(this._tasks);

    this._renderBoard();
  }

  _setTasks(tasks) {
    this._tasks = tasks;
    this._showedTasks = TASKS_IN_ROW;

    this._renderBoard();
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
        this._taskListController.setTasks(sortedByDateUpTasks);
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._taskListController.setTasks(sortedByDateDownTasks);
        break;
      case `default`:
        this._taskListController.setTasks(this._tasks);
        break;
    }
  }

  _onloadMoreButtonClick() {
    this._taskListController.addTasks(this._tasks.slice(this._showedTasks, this._showedTasks + TASKS_IN_ROW));

    this._showedTasks += TASKS_IN_ROW;

    if (this._showedTasks >= this._tasks.length) {
      unrender(this._loadBtn.getElement());
      this._loadBtn.removeElement();
    }
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  show(tasks) {
    if (tasks !== this._tasks) {
      this._setTasks(tasks);
    }

    this._board.getElement().classList.remove(`visually-hidden`);
  }
}
