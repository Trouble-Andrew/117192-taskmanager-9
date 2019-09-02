import {AbstractComponent} from './abstract-component.js';

export class CardComponent extends AbstractComponent {
  constructor({description, dueDate, tags, color, repeatingDays, dateSwitch, repeatSwitch}) {
    super();
    this._element = null;
    this._description = description;
    this._dueDate = dueDate !== null ? new Date(dueDate) : null;
    this._tags = tags;
    this._color = color;
    this._repeatingDays = repeatingDays;
    this._dateSwitch = dateSwitch;
    this._repeatSwitch = repeatSwitch;
  }
}
