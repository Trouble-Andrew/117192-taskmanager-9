import {AbstractComponent} from './abstract-component.js';

export class CardComponent extends AbstractComponent {
  constructor({description, dueDate, tags, color, repeatingDays, dateSwitch, repeatSwitch}) {
    super();
    this._element = null;
    this._description = description;
    // this._dueDate = new Date(dueDate);
    this._tags = tags;
    this._color = color;
    this._repeatingDays = repeatingDays;
    this._dateSwitch = dateSwitch;
    this._repeatSwitch = repeatSwitch;
    this._dueDate = dateSwitch === true ? new Date(dueDate) : null;
  }
}
