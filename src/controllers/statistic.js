import {Statistics} from './../components/statistics.js';
import {render, unrender, Position} from './../utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from 'flatpickr';
import moment from 'moment';
import * as _ from 'lodash';

const firstDateForChart = Number.parseInt(moment(new Date()).add(-3, `days`).unix() + `000`, 0);
const secondDateForChart = Number.parseInt(moment(new Date()).add(3, `days`).unix() + `000`, 0);

export class StatisticController {
  constructor(container, tasks) {
    this._container = container;
    this._statistics = new Statistics();
    this._tasks = tasks;
    this._days = this._getDatesBetween(firstDateForChart, secondDateForChart);
    this._tags = this._getTags(this._getTasks(this._tasks, this._days));
    this._colors = this._getColors(this._getTasks(this._tasks, this._days));
    this._statPlaceholder = `01 Feb - 08 Feb`;
    this._daysChart = null;
    this._tagsChart = null;
    this._colorsChart = null;

    this.init();
  }

  init() {
    unrender(this._statistics.getElement());
    this._statistics = new Statistics();
    render(this._container, this._statistics.getElement(), Position.BEFOREEND);
    this._renderCharts();

    this._statistics.getElement().querySelector(`.statistic__period-input`)
      .addEventListener(`change`, (evt) => {
        if (evt.target.value.indexOf(`t`) > 0) {
          let dates = evt.target.value.split(` `);
          dates.splice(1, 1);
          dates = dates.map((i) => Number.parseInt(i, 0));
          dates[0] = Number.parseInt(dates[0] + `000`, 0);
          dates[1] = Number.parseInt(dates[1] + `000`, 0);
          this._days = this._getDatesBetween(dates[0], dates[1]);
          this._statPlaceholder = `${moment(dates[0]).format(`DD MMM`)} - ${moment(dates[1]).format(`DD MMM`)}`;
          this._statistics.getElement().querySelector(`.statistic__period-input`).placeholder = this._statPlaceholder;
          this.init();
        }
      });

    this._statistics.getElement().querySelector(`.statistic__period-input`).placeholder = this._statPlaceholder;

    flatpickr(this._statistics.getElement().querySelector(`.statistic__period-input`), {
      altInput: true,
      allowInput: true,
      dateFormat: `U`,
      mode: `range`,
    });
  }

  _getTasksDays(tasks, days) {
    let allDays = [];
    days.forEach(function (day) {
      let count = 0;
      tasks.forEach(function (task) {
        if (moment(task.dueDate).format(`DD MMM`) === day) {
          count += 1;
        }
      });
      allDays.push(count);
    });
    return allDays;
  }

  _getTasks(tasks, days) {
    let filteredTasks = [];
    let all = tasks;
    days.forEach(function (day) {
      filteredTasks.push(_.filter(all, function (item) {
        return moment(item.dueDate).format(`DD MMM`) === day;
      }));
    });
    return _.flattenDeep(filteredTasks);
  }

  _getTags(array) {
    let tags = new Set([]);
    array.forEach(function (item) {
      if (item.tags.length > 0) {
        item.tags.map(function (tag) {
          tags.add(tag);
        });
      }
    });
    return Array.from(tags);
  }

  _getColors(array) {
    let colors = new Set([]);
    array.forEach((item) => colors.add(item.color));
    return Array.from(colors);
  }

  _getTasksColors(tasks, colors) {
    let allColors = [];
    colors.forEach(function (item) {
      let count = 0;
      tasks.forEach(function (task) {
        if (task.color === item) {
          count += 1;
        }
      });
      allColors.push(count);
    });
    return allColors;
  }

  _getTasksTags(tasks, tags) {
    let allTags = [];
    tags.forEach(function (tag) {
      let count = 0;
      tasks.forEach(function (task) {
        if (task.tags.length > 0) {
          if (task.tags.indexOf(tag) >= 0) {
            count += 1;
          }
        }
      });
      allTags.push(count);
    });
    return allTags;
  }

  _getDatesBetween(start, end) {
    let dates = [];

    start = new Date(start);
    end = new Date(end);

    let currDate = moment(start).startOf(`day`);
    let lastDate = moment(end).startOf(`day`);

    dates.push(moment(currDate.toDate()).format(`DD MMM`));


    while (currDate.add(1, `days`).diff(lastDate) < 0) {
      dates.push(moment(currDate.clone().toDate()).format(`DD MMM`));
    }
    dates.push(moment(lastDate.toDate()).format(`DD MMM`));

    return dates;
  }

  _renderCharts() {
    const statObject = this;
    const daysCtx = document.querySelector(`.statistic__days`);
    const tagsCtx = document.querySelector(`.statistic__tags`);
    const colorsCtx = document.querySelector(`.statistic__colors`);

    statObject._daysChart = new Chart(daysCtx, {
      plugins: [ChartDataLabels],
      type: `line`,
      data: {
        labels: this._days,
        datasets: [{
          data: this._getTasksDays(this._getTasks(this._tasks, this._days), this._days),
          backgroundColor: `transparent`,
          borderColor: `#000000`,
          borderWidth: 1,
          lineTension: 0,
          pointRadius: 8,
          pointHoverRadius: 8,
          pointBackgroundColor: `#000000`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 8
            },
            color: `#ffffff`
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 10
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });

    statObject._tagsChart = new Chart(tagsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: this._tags,
        datasets: [{
          data: this._getTasksTags(this._getTasks(this._tasks, this._days), this._tags),
          backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });

    statObject._colorsChart = new Chart(colorsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: this._colors,
        datasets: [{
          data: this._getTasksColors(this._getTasks(this._tasks, this._days), this._colors),
          backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`],
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: COLORS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
  }

  hide() {
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._statistics.getElement().classList.remove(`visually-hidden`);
  }
}
