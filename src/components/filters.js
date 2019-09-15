import {AbstractComponent} from './abstract-component.js';
import * as _ from 'lodash';

const titleFilter = [`all`, `overdue`, `today`, `favotites`, `repeating`, `tags`, `archive`];

export class Filter extends AbstractComponent {
  constructor(tasks) {
    super(tasks);
    this._tasks = tasks;
    this.getValue = this.getValue;
  }

  getValue(tasks) {
    let tagsSet = new Set();
    let todayCount = 0;
    tasks.forEach(function (task) {
      for (let elem of task.tags) {
        tagsSet.add(elem);
      }
    });

    tasks.forEach(function (task) {
      let time = new Date(task.dueDate).toDateString();
      let today = new Date().toDateString();
      if (time === today) {
        todayCount++;
      }
    });

    this.getElement().querySelector(`.filter__all-count`).innerHTML = tasks.length;
    this.getElement().querySelector(`.filter__overdue-count`).innerHTML = _.filter(tasks, (o) => o.dueDate < Date.now()).length;
    this.getElement().querySelector(`.filter__favorites-count`).innerHTML = _.filter(tasks, (o) => o.isFavorite === true).length;
    this.getElement().querySelector(`.filter__repeating-count`).innerHTML = _.filter(tasks, (o) => o.repeatSwitch === true).length;
    this.getElement().querySelector(`.filter__tags-count`).innerHTML = Array.from(tagsSet).length;
    this.getElement().querySelector(`.filter__today-count`).innerHTML = todayCount;
    this.getElement().querySelector(`.filter__archive-count`).innerHTML = _.filter(tasks, (o) => o.isArchive === true).length;
  }

  // _getFilter() {
  //   title: titleFilter,
  //     setCount(value) {
  //       let count = 0;
  //       switch (value) {
  //         case `isFavorite`:
  //           tasks.forEach((task) => task[value] ? count++ : null);
  //           getFilter.count = count;
  //           return count;
  //         case `dueDate`:
  //           tasks.forEach((task) => task[value] < Date.now() ? count++ : null);
  //           getFilter.count = count;
  //           return count;
  //         case `repeatingDays`:
  //           tasks.forEach(function (task) {
  //             let taskArray = Object.keys(task.repeatingDays).map((i) => task.repeatingDays[i]);
  //             taskArray = Object.keys(taskArray).some((day) => taskArray[day]) ? count++ : null;
  //           });
  //           getFilter.count = count;
  //           return count;
  //         case `tags`:
  //           let tagsSet = new Set();
  //           tasks.forEach(function (task) {
  //             for (let elem of task.tags) {
  //               tagsSet.add(elem);
  //             }
  //           });
  //           getFilter.count = tagsSet.size;
  //           count = getFilter.count;
  //           return count;
  //         case `today`:
  //           tasks.forEach(function (task) {
  //             let time = new Date(task.dueDate).toDateString();
  //             let today = new Date().toDateString();
  //             if (time === today) {
  //               count++;
  //             }
  //           });
  //           getFilter.count = count;
  //           return count;
  //         case `all`:
  //           tasks.forEach((task) => task ? count++ : null);
  //           getFilter.count = count;
  //           return count;
  //         case `isArchive`:
  //           tasks.forEach((task) => task.isArchive ? count++ : null);
  //           getFilter.count = count;
  //           return count;
  //       }
  //       return count;
  //     }
  // }

  getTemplate() {
    return `<section class="main__filter filter container">
      <input
        type="radio"
        id="filter__all"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__all" class="filter__label">
        ${titleFilter[0]} <span class="filter__all-count"></span></label
      >
      <input
        type="radio"
        id="filter__overdue"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__overdue" class="filter__label"
        >${titleFilter[1]} <span class="filter__overdue-count"></span></label
      >
      <input
        type="radio"
        id="filter__today"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__today" class="filter__label"
        >${titleFilter[2]} <span class="filter__today-count"></span></label
      >
      <input
        type="radio"
        id="filter__favorites"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__favorites" class="filter__label"
        >${titleFilter[3]} <span class="filter__favorites-count"></span></label
      >
      <input
        type="radio"
        id="filter__repeating"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__repeating" class="filter__label"
        >${titleFilter[4]} <span class="filter__repeating-count"></span></label
      >
      <input
        type="radio"
        id="filter__tags"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__tags" class="filter__label"
        >${titleFilter[5]} <span class="filter__tags-count"></span></label
      >
      <input
        type="radio"
        id="filter__archive"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__archive" class="filter__label"
        >Archive <span class="filter__archive-count"></span></label
      >
    </section>`;
  }
}

// import mockArray from './../data.js';
//
// const titleFilter = [`all`, `overdue`, `today`, `favotites`, `repeating`, `tags`, `archive`];
// const tasks = mockArray;
//
// export const getFiltersMarkup = ({title, setCount}) => `
//   <section class="main__filter filter container">
//     <input
//       type="radio"
//       id="filter__all"
//       class="filter__input visually-hidden"
//       name="filter"
//       checked
//     />
//     <label for="filter__all" class="filter__label">
//       ${title[0]} <span class="filter__all-count">${setCount(`all`)}</span></label
//     >
//     <input
//       type="radio"
//       id="filter__overdue"
//       class="filter__input visually-hidden"
//       name="filter"
//       disabled
//     />
//     <label for="filter__overdue" class="filter__label"
//       >${title[1]} <span class="filter__overdue-count">${setCount(`dueDate`)}</span></label
//     >
//     <input
//       type="radio"
//       id="filter__today"
//       class="filter__input visually-hidden"
//       name="filter"
//       disabled
//     />
//     <label for="filter__today" class="filter__label"
//       >${title[2]} <span class="filter__today-count">${setCount(`today`)}</span></label
//     >
//     <input
//       type="radio"
//       id="filter__favorites"
//       class="filter__input visually-hidden"
//       name="filter"
//       disabled
//     />
//     <label for="filter__favorites" class="filter__label"
//       >${title[3]} <span class="filter__favorites-count">${setCount(`isFavorite`)}</span></label
//     >
//     <input
//       type="radio"
//       id="filter__repeating"
//       class="filter__input visually-hidden"
//       name="filter"
//       disabled
//     />
//     <label for="filter__repeating" class="filter__label"
//       >${title[4]} <span class="filter__repeating-count">${setCount(`repeatingDays`)}</span></label
//     >
//     <input
//       type="radio"
//       id="filter__tags"
//       class="filter__input visually-hidden"
//       name="filter"
//       disabled
//     />
//     <label for="filter__tags" class="filter__label"
//       >${title[5]} <span class="filter__tags-count">${setCount(`tags`)}</span></label
//     >
//     <input
//       type="radio"
//       id="filter__archive"
//       class="filter__input visually-hidden"
//       name="filter"
//     />
//     <label for="filter__archive" class="filter__label"
//       >Archive <span class="filter__archive-count">${setCount(`isArchive`)}</span></label
//     >
//   </section>
// `;
//
// export const getFilter = () => ({
//   title: titleFilter,
//   setCount(value) {
//     let count = 0;
//     switch (value) {
//       case `isFavorite`:
//         tasks.forEach((task) => task[value] ? count++ : null);
//         getFilter.count = count;
//         return count;
//       case `dueDate`:
//         tasks.forEach((task) => task[value] < Date.now() ? count++ : null);
//         getFilter.count = count;
//         return count;
//       case `repeatingDays`:
//         tasks.forEach(function (task) {
//           let taskArray = Object.keys(task.repeatingDays).map((i) => task.repeatingDays[i]);
//           taskArray = Object.keys(taskArray).some((day) => taskArray[day]) ? count++ : null;
//         });
//         getFilter.count = count;
//         return count;
//       case `tags`:
//         let tagsSet = new Set();
//         tasks.forEach(function (task) {
//           for (let elem of task.tags) {
//             tagsSet.add(elem);
//           }
//         });
//         getFilter.count = tagsSet.size;
//         count = getFilter.count;
//         return count;
//       case `today`:
//         tasks.forEach(function (task) {
//           let time = new Date(task.dueDate).toDateString();
//           let today = new Date().toDateString();
//           if (time === today) {
//             count++;
//           }
//         });
//         getFilter.count = count;
//         return count;
//       case `all`:
//         tasks.forEach((task) => task ? count++ : null);
//         getFilter.count = count;
//         return count;
//       case `isArchive`:
//         tasks.forEach((task) => task.isArchive ? count++ : null);
//         getFilter.count = count;
//         return count;
//     }
//     return count;
//   }
// });
