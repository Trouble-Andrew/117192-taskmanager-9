import {Card} from './../components/card.js';
import {CardEdit} from './../components/card-edit.js';
import {render, Position, removeElement} from './../utils.js';
import flatpickr from 'flatpickr';
import {DeleteButton} from './../components/delete-button.js';
import {SaveButton} from './../components/save-button.js';
import {EditButton} from './../components/edit-button.js';
import {unrender} from './../utils.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

const ON_DATA_CHANGE_DELAY = 2000;

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

    this._updatedBooleanData = this._buildNewData();

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

    this._cardEdit.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const entry = this._buildNewData();

        this.blockForm(`save`, true);
        setTimeout(this._onDataChange.bind(this,
            mode === Mode.DEFAULT ? `update` : `create`,
            entry,
            () => {
              this.onErrorDataChange();
            }),
        ON_DATA_CHANGE_DELAY);
        document.removeEventListener(`keydown`, this._onEscKeyDown.bind(this));
      });

    this._cardEdit.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, () => {

        this.blockForm(`delete`, true);

        if (mode === Mode.ADDING) {
          unrender(this._cardEdit.getElement());
          this._cardEdit.removeElement();
          this._onDataChange(null, null);

        } else if (mode === Mode.DEFAULT) {
          setTimeout(this._onDataChange.bind(this, `delete`, this._data), ON_DATA_CHANGE_DELAY);
        }
      });
  }

  blockForm(btnValue, isDisabled) {
    const buttonSave = this._cardEdit.getElement().querySelector(`.card__save`);
    const buttonDelete = this._cardEdit.getElement().querySelector(`.card__delete`);

    this._cardEdit.getElement().querySelector(`.card__text`).disabled = isDisabled;
    this._cardEdit.getElement().querySelector(`.card__hashtag-input`).disabled = isDisabled;
    this._cardEdit.getElement().querySelector(`.card__inner`).style.boxShadow = ``;
    this._cardEdit.getElement().querySelector(`.card__inner`).style.borderColor = `#000000`;
    buttonSave.disabled = isDisabled;
    buttonDelete.disabled = isDisabled;

    if (isDisabled) {
      if (btnValue === `save`) {
        buttonSave.textContent = `Saving...`;
      } else {
        buttonDelete.textContent = `Deleting...`;
      }
    } else {
      buttonSave.textContent = `Save`;
      buttonDelete.textContent = `Delete`;
    }
  }

  setDefaultView() {
    if (this._container.contains(this._cardEdit.getElement())) {
      this._container.replaceChild(this._cardView.getElement(), this._cardEdit.getElement());
    }
  }

  _removeEditCard() {
    removeElement(this._cardEdit.getElement());
    document.addEventListener(`click`, this._onEscKeyDown);
    this._onDataChange(null, this._data);
  }

  shakeTask() {
    const ANIMATION_TIMEOUT = 600;
    const taskEditElement = this._cardEdit.getElement();
    taskEditElement.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    taskEditElement.style.zIndex = `1`;

    setTimeout(() => {
      taskEditElement.style.animation = ``;
      taskEditElement.style.zIndex = ``;
    }, ANIMATION_TIMEOUT);
  }

  onErrorDataChange() {
    this.shakeTask();
    this.blockForm(null, false);
    this._cardEdit.getElement().querySelector(`.card__inner`).style.boxShadow = `0 0 10px 0 red`;
    this._cardEdit.getElement().querySelector(`.card__inner`).style.borderColor = `red`;
  }

  _buildNewData() {
    const taskId = this._cardView.id;
    // console.log(this._cardView);
    const formData = new FormData(this._cardEdit.getElement().querySelector(`.card__form`));
    const isFavorite = this._cardEdit.getElement().querySelector(`.card__btn--favorites`).classList.contains(`card__btn--disabled`) ? true : false;
    const isArchive = this._cardEdit.getElement().querySelector(`.card__btn--archive`).classList.contains(`card__btn--disabled`) ? true : false;

    const entry = {
      id: taskId,
      description: formData.get(`text`),
      color: formData.get(`color`),
      tags: new Set(formData.getAll(`hashtag`)),
      // dueDate: formData.get(`date`) === `` ? null : new Date(formData.get(`date`)),
      dateSwitch: this._cardEdit.getElement().querySelector(`.card__date-status`).innerHTML === `yes` ? true : false,
      dueDate: new Date(formData.get(`date`)),
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
      isFavorite,
      isArchive,
      toRAW() {
        return {
          'id': this.id + ``,
          'description': this.description,
          'due_date': this.dueDate,
          'tags': [...this.tags.values()],
          'repeating_days': this.repeatingDays,
          'color': this.color,
          'is_favorite': this.isFavorite,
          'is_archived': this.isArchive,
        };
      }
    };
    // console.log(entry);
    // console.log(entry.toRAW());
    return entry;
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
