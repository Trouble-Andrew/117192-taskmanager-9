import moment from 'moment';

export class ModelTask {
  constructor(data) {
    this.id = data[`id`];
    this.description = data[`description`] || ``;
    this.dueDate = Number.parseInt(moment(new Date(data[`due_date`])).unix() + `000`, 0);
    this.tags = Array.from(new Set(data[`tags`] || []));
    this.repeatingDays = data[`repeating_days`];
    this.color = data[`color`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.isArchive = Boolean(data[`is_archive`]);
    this.dateSwitch = true;
    this.repeatSwitch = Object.values(this.repeatingDays).some((it) => it === true) ? true : false;
  }

  static parseTask(data) {
    return new ModelTask(data);
  }

  static parseTasks(data) {
    return data.map(ModelTask.parseTask);
  }

  toRAW() {
    return {
      'id': this.id,
      'description': this.description,
      'due_date': this.dueDate,
      'tags': [...this.tags.values()],
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_archive': this.isArchive,
    };
  }
}
