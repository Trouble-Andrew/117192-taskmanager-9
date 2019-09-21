import {Search} from './components/search.js';
import {SiteMenu} from './components/menu.js';
import {API} from './components/api.js';
import {BoardController} from './controllers/board.js';
import {SearchController} from './controllers/search.js';
import {StatisticController} from './controllers/statistic.js';
import {createElement, render, Position, unrender} from './utils.js';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
// Values
export const CARD_COUNT = 9;
const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);
// let taskMocks = mockArray;
let boardController;
let statisticController;
const siteMenu = new SiteMenu();
const search = new Search();

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/task-manager`;
let taskMainData = null;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

const onDataChange = (actionType, update, isSearch = false, onError) => {
  if (actionType === null || update === null) {
    boardController.renderBoard();
    return;
  }

  switch (actionType) {
    case `update`:
      api.updateTask({
        id: update.id,
        data: update.toRAW()
      })
        .then(() => api.getTasks())
        .then((tasks) => {
          taskMainData = tasks;
          if (isSearch) {
            searchController.show(tasks);
          } else {
            boardController.show(tasks);
          }
        })
        .catch(() => {
          onError();
        });
      break;
    case `delete`:
      api.deleteTask({
        id: update.id
      })
        .then(() => api.getTasks())
        .then((tasks) => {
          taskMainData = tasks;
          if (isSearch) {
            searchController.show(tasks);
          } else {
            boardController.show(tasks);
          }
        })
        .catch(() => {
          onError();
        });
      break;
    case `create`:
      api.createTask({
        task: update.toRAW()
      })
        .then(() => api.getTasks())
        .then((tasks) => {
          taskMainData = tasks;
          boardController.show(tasks);
        })
        .catch(() => {
          onError();
        });
  }
};

const onSearchBackButtonClick = () => {
  statisticController.hide();
  searchController.hide();
  boardController.show(taskMainData);
};

// boardController = new BoardController(mainContainer, onDataChange);

// let tasksFromServer = api.getTasks().then(function (tasks) {
//   let mock = tasks;
//   console.log(mock);
//   return mock;
// });
// console.log(tasksFromServer);

// console.log(api.getTasks().then((tasks) => tasks));

render(menuContainer, siteMenu.getElement(), Position.BEFOREEND);
render(mainContainer, search.getElement(), Position.BEFOREEND);
boardController = new BoardController(mainContainer, onDataChange);
const searchController = new SearchController(mainContainer, search.getElement(), onSearchBackButtonClick, onDataChange);

// api.getTasks().then((tasks) => boardController.show(tasks));
api.getTasks()
  .then((tasks) => {
    taskMainData = tasks;
    boardController.show(taskMainData);
  })

  .then(() => {
    createElement(search.getElement().addEventListener(`click`, () => {
      if (statisticController) {
        statisticController.hide();
      }
      boardController.hide();
      searchController.show(taskMainData);
    }));
  });

// createElement(search.getElement().addEventListener(`click`, () => {
//   if (statisticController) {
//     statisticController.hide();
//   }
//   boardController.hide();
//   searchController.show(tasks);
// }));
// });

siteMenu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  const tasksId = `control__task`;
  const statisticId = `control__statistic`;
  const newTaskId = `control__new-task`;

  switch (evt.target.id) {
    case tasksId:
      statisticController.hide();
      searchController.hide();
      unrender(mainContainer.querySelector(`.statistic`));
      boardController.show(taskMainData);
      break;
    case statisticId:
      boardController.hide();
      searchController.hide();
      statisticController = new StatisticController(mainContainer, taskMainData);
      statisticController.show();
      break;
    case newTaskId:
      boardController.createTask();
      if (statisticController) {
        statisticController.hide();
      }
      unrender(mainContainer.querySelector(`.statistic`));
      boardController.show(taskMainData);
      siteMenu.getElement().querySelector(`#${tasksId}`).checked = true;
      break;
  }
});

// const onSearchBackButtonClick = () => {
//   statisticController.hide();
//   searchController.hide();
//   boardController.show(taskMocks);
// };
//
// const searchController = new SearchController(mainContainer, search.getElement(), onSearchBackButtonClick);
//
// // boardController.show(taskMocks);
// api.getTasks().then((tasks) => boardController.show(tasks));
//
// siteMenu.getElement().addEventListener(`change`, (evt) => {
//   evt.preventDefault();
//
//   if (evt.target.tagName !== `INPUT`) {
//     return;
//   }
//
//   const tasksId = `control__task`;
//   const statisticId = `control__statistic`;
//   const newTaskId = `control__new-task`;
//
//   switch (evt.target.id) {
//     case tasksId:
//       statisticController.hide();
//       searchController.hide();
//       unrender(mainContainer.querySelector(`.statistic`));
//       // boardController.show(taskMocks);
//       api.getTasks().then((tasks) => boardController.show(tasks));
//       break;
//     case statisticId:
//       boardController.hide();
//       searchController.hide();
//       // statisticController = new StatisticController(mainContainer, taskMocks);
//       // api.getTasks().then((tasks) => statisticController = new StatisticController(mainContainer, tasks));
//       api.getTasks().then(function (tasks) {
//         statisticController = new StatisticController(mainContainer, tasks);
//       });
//       statisticController.show();
//       break;
//     case newTaskId:
//       boardController.createTask();
//       if (statisticController) {
//         statisticController.hide();
//       }
//       unrender(mainContainer.querySelector(`.statistic`));
//       // boardController.show(taskMocks);
//       // api.getTasks().then((tasks) => boardController.show(tasks));
//       siteMenu.getElement().querySelector(`#${tasksId}`).checked = true;
//       break;
//   }
// });
//
// createElement(search.getElement().addEventListener(`click`, () => {
//   statisticController.hide();
//   boardController.hide();
//   // searchController.show(taskMocks);
//   api.getTasks().then((tasks) => searchController.show(tasks));
// }));
