import {tasks} from './main.js';
import {shuffle} from './utils.js';

export const getCard = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`,
  ][Math.floor(Math.random() * 3)],
  dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  tags: new Set(shuffle([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`,
  ]).slice(1, 4)),
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': Boolean(Math.round(Math.random())),
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`,
  ][Math.floor(Math.random() * 5)],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random())),
});

export const getFilter = () => ({
  title: [
    `all`,
    `overdue`,
    `today`,
    `favotites`,
    `repeating`,
    `tags`,
    `archive`,
  ],
  setCount(value) {

    let count = 0;
    switch (value) {
      case `isFavorite`:
        tasks.forEach((task) => task[value] ? count++ : null);
        getFilter.count = count;
        return count;
      case `dueDate`:
        tasks.forEach((task) => task[value] < Date.now() ? count++ : null);
        getFilter.count = count;
        return count;
      case `repeatingDays`:
        tasks.forEach(function (task) {
          let taskArray = Object.keys(task.repeatingDays).map((i) => task.repeatingDays[i]);
          taskArray = Object.keys(taskArray).some((day) => taskArray[day]) ? count++ : null;
        });
        getFilter.count = count;
        return count;
      case `tags`:
        let tagsSet = new Set();
        tasks.forEach(function (task) {
          for (let elem of task.tags) {
            tagsSet.add(elem);
          }
        });
        getFilter.count = tagsSet.size;
        count = getFilter.count;
        return count;
      case `today`:
        tasks.forEach(function (task) {
          let time = new Date(task.dueDate).toDateString();
          let today = new Date().toDateString();
          if (time === today) {
            count++;
          }
        });
        getFilter.count = count;
        return count;
      case `all`:
        tasks.forEach((task) => task ? count++ : null);
        getFilter.count = count;
        return count;
      case `isArchive`:
        tasks.forEach((task) => task.isArchive ? count++ : null);
        getFilter.count = count;
        return count;
    }
    return count;
  }
});
