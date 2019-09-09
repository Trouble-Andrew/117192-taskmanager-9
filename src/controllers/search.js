import {render, unrender, Position} from './../utils.js';
import {SearchResult} from './../components/search-result.js';
import {SearchResultGroup} from './../components/search-result-group.js';
import {SearchResultInfo} from './../components/search-result-info.js';
import {TaskListController} from './task-list.js';

export class SearchController {
  constructor(container, search, onBackButtonClick) {
    this._container = container;
    this._search = search;
    this._onBackButtonClick = onBackButtonClick;

    this._tasks = [];

    this._searchResult = new SearchResult();
    this._searchResultInfo = new SearchResultInfo({});
    this._searchResultGroup = new SearchResultGroup({});
    this._taskListController = new TaskListController(
        this._searchResultGroup.getElement().querySelector(`.result__cards`),
        this._onDataChange.bind(this)
    );

    this._init();
  }

  _init() {
    this.hide();

    render(this._container, this._searchResult.getElement(), Position.BEFOREEND);
    render(this._searchResult.getElement(), this._searchResultGroup.getElement(), Position.BEFOREEND);
    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), Position.AFTERBEGIN);

    this._searchResult.getElement().querySelector(`.result__back`)
      .addEventListener(`click`, () => {
        this._search.querySelector(`input`).value = ``;
        this._onBackButtonClick();
      });
    this._search.querySelector(`input`)
      .addEventListener(`keyup`, (evt) => {
        const {value} = evt.target;
        const tasks = this._tasks.filter((task) => {
          let result;
          if (task.description.includes(value)) {
            result = task.description.includes(value);
          } else if (new Date(task.dueDate).toLocaleString().indexOf(value) >= 0) {
            result = new Date(task.dueDate).toLocaleString();
          } else if (`#` + value) {
            result = task.tags.includes(value.replace(`#`, ``));
          }
          return result;
        });

        this._showSearchResult(value, tasks);
      });
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
  }

  show(tasks) {
    this._tasks = tasks;

    if (this._searchResult.getElement().classList.contains(`visually-hidden`)) {
      this._showSearchResult(``, this._tasks);
      this._searchResult.getElement().classList.remove(`visually-hidden`);
    }
  }

  _showSearchResult(text, tasks) {
    if (this._searchResultInfo) {
      unrender(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({title: text, count: tasks.length});

    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), Position.AFTERBEGIN);

    this._taskListController.setTasks(tasks);
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
  }
}
