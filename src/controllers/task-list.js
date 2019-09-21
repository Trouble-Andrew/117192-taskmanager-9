import {Mode as TaskControllerMode, CardController} from './card.js';
import {unrender} from './../utils.js';

export class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._tasks.forEach((task) => this._renderTask(task));
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
    this._tasks = this._tasks.concat(tasks);
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const defaultTask = {
      description: ``,
      dueDate: new Date(),
      tags: new Set(),
      color: `black`,
      repeatingDays: {},
      dateSwitch: true,
      isFavorite: false,
      isArchive: false,
    };

    this._creatingTask = new CardController(this._container, defaultTask, TaskControllerMode.ADDING, (...args) => {
      // console.log(this._creatingTask);
      this._creatingTask = null;
      this._onDataChange(...args);
    }, this._onChangeView);
  }

  _renderTask(task) {
    const taskController = new CardController(this._container, task, TaskControllerMode.DEFAULT, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    // this._subscriptions.forEach((it) => it());
    this._subscriptions.forEach((subscription) => subscription());

    if (this._container.children.length > this._showedTasksCount) {
      unrender(this._container.children[0]);
      this._creatingTask = null;
    }
  }

  // _onDataChange(newData, oldData) {
  //   const index = this._tasks.findIndex((task) => task === oldData);
  //
  //   if (newData === null) {
  //     this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
  //   } else if (oldData === null) {
  //     this._tasks = [newData, ...this._tasks];
  //   } else {
  //     this._tasks[index] = newData;
  //   }
  //
  //   this.setTasks(this._tasks);
  //
  //   this._onDataChangeMain(this._tasks);
  // }
  _onDataChange(actionType, update, onError) {
    this._creatingTask = null;
    this._onDataChangeMain(actionType, update, false, onError);
  }
}
