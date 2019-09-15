import {Board} from './../components/board.js';
import {Filter} from './../components/filters.js';
import {CardList} from './../components/card-list.js';
import {Sort} from './../components/sort.js';
import {LoadButton} from './../components/load-button.js';
import {TaskListController} from './task-list.js';
import {render, unrender, Position} from './../utils.js';
import * as _ from 'lodash';

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
    this._onFilterLinkClick = this._onFilterLinkClick.bind(this);
    this._onloadMoreButtonClick = this._onloadMoreButtonClick.bind(this);

    this.filter = new Filter();

    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange.bind(this));

    this.init();
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this.filter.getElement(), Position.BEFORE);
    render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._loadBtn.getElement(), Position.BEFOREEND);

    this.filter.getValue(this._tasks);

    this._sort.addEvent(`click`, this._onSortLinkClick);

    this.filter.addEvent(`click`, this._onFilterLinkClick);

    this._loadBtn.addEvent(`click`, this._onloadMoreButtonClick);
  }

  createTask() {
    this._taskListController.createTask();
  }

  _renderBoard() {
    this.filter.getValue(this._tasks);
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

  _onFilterLinkClick(evt) {
    evt.preventDefault();
    switch (evt.target.control.id) {
      case `filter__all`:
        this._taskListController.setTasks(this._tasks);
        break;
      case `filter__overdue`:
        const filteredOverdue = _.filter(this._tasks, (o) => o.dueDate < Date.now());
        this._taskListController.setTasks(filteredOverdue);
        break;
      case `filter__today`:
        let todayCount = [];
        this._tasks.forEach(function (task) {
          let time = new Date(task.dueDate).toDateString();
          let today = new Date().toDateString();
          if (time === today) {
            todayCount.push(task);
          }
        });
        this._taskListController.setTasks(todayCount);
        break;
      case `filter__repeating`:
        let repeatingTasks = [];
        this._tasks.forEach(function (task) {
          let taskArray = Object.keys(task.repeatingDays).map((i) => task.repeatingDays[i]);
          taskArray = Object.keys(taskArray).some((day) => taskArray[day]) ? repeatingTasks.push(task) : null;
        });
        this._taskListController.setTasks(repeatingTasks);
        break;
      case `filter__tags`:
        let tagsTasks = [];
        this._tasks.forEach(function (task) {
          if (task.tags.length > 0) {
            tagsTasks.push(task);
          }
        });
        this._taskListController.setTasks(tagsTasks);
        break;
      case `filter__archive`:
        const filteredArchive = _.filter(this._tasks, (o) => o.isArchive === true);
        this._taskListController.setTasks(filteredArchive);
        break;
      case `filter__favorites`:
        const filteredFavorites = _.filter(this._tasks, (o) => o.isFavorite === true);
        this._taskListController.setTasks(filteredFavorites);
        break;
    }
    evt.target.control.checked = true;
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
