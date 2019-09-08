import {Card} from './../components/card.js';
import {CardEdit} from './../components/card-edit.js';
import {render, Position, removeElement} from './../utils.js';
import flatpickr from 'flatpickr';
import {DeleteButton} from './../components/delete-button.js';
import {SaveButton} from './../components/save-button.js';
import {EditButton} from './../components/edit-button.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

export class CardController {
  constructor(container, data, mode, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._cardView = new Card(data);
    this._cardEdit = new CardEdit(data);
    this._deleteBtn = new DeleteButton();
    this._saveBtn = new SaveButton();
    this._editBtn = new EditButton();
    this._mode = mode;
    this._currentView = this._cardEdit;

    this.create(mode);
  }

  create(mode) {
    let renderPosition = Position.BEFOREEND;
    this._currentView = this._cardView;

    if (mode === Mode.ADDING) {
      renderPosition = Position.AFTERBEGIN;
      this._currentView = this._cardEdit;
    }

    render(this._container, this._currentView.getElement(), renderPosition);
    render(this._cardEdit.getElement().querySelector(`.card__status-btns`), this._saveBtn.getElement(), Position.BEFOREEND);
    render(this._cardEdit.getElement().querySelector(`.card__status-btns`), this._deleteBtn.getElement(), Position.BEFOREEND);
    render(this._cardView.getElement().querySelector(`.card__control`), this._editBtn.getElement(), Position.AFTERBEGIN);

    if (this._data.dueDate !== null) {
      flatpickr(this._cardEdit.getElement().querySelector(`.card__date`), {
        altInput: true,
        allowInput: true,
        defaultDate: this._data.dueDate,
      });
    }

    this._editBtn.addEvent(`click`, this._openEditCard.bind(this));

    this._cardEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, this._onEscKeyDown.bind(this));
      });

    this._cardEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, this._onEscKeyDown.bind(this));
      });

    this._saveBtn.addEvent(`click`, this._saveEditCard.bind(this));

    this._deleteBtn.addEvent(`click`, this._removeEditCard.bind(this));
  }

  setDefaultView() {
    if (this._container.contains(this._cardEdit.getElement())) {
      this._container.replaceChild(this._cardView.getElement(), this._cardEdit.getElement());
    }
  }

  _removeEditCard() {
    removeElement(this._cardEdit.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._onDataChange(null, this._data);
  }

  _saveEditCard(evt) {
    evt.preventDefault();
    const formData = new FormData(this._cardEdit.getElement().querySelector(`.card__form`));
    let dateSwitch = this._cardEdit.getElement().querySelector(`.card__date-status`).innerHTML === `yes` ? true : false;
    let dateField = dateSwitch === true ? new Date(formData.get(`date`)) : null;
    const entry = {
      description: formData.get(`text`),
      color: formData.get(`color`),
      tags: new Set(formData.getAll(`hashtag`)),
      dateSwitch,
      dueDate: dateField,
      repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
        acc[it] = true;
        return acc;
      }, {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }),
    };
    this._onDataChange(entry, this._mode === Mode.DEFAULT ? this._data : null);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openEditCard(evt) {
    evt.preventDefault();
    this._onChangeView();
    this._container.replaceChild(this._cardEdit.getElement(), this._cardView.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown.bind(this));
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (this._mode === Mode.DEFAULT) {
        if (this._container.contains(this._cardEdit.getElement())) {
          this._container.replaceChild(this._cardView.getElement(), this._cardEdit.getElement());
        }
      } else if (this._mode === Mode.ADDING) {
        this._container.removeChild(this._currentView.getElement());
      }

      document.removeEventListener(`keydown`, this.onEscKeyDown);
    }
  }
}
