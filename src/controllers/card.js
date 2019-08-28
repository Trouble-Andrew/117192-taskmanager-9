import {Card} from './../components/card.js';
import {CardEdit} from './../components/card-edit.js';
import {render, Position, removeElement} from './../utils.js';
import flatpickr from 'flatpickr';


export class CardController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._cardView = new Card(data);
    this._cardEdit = new CardEdit(data);

    this.create();
  }

  create() {
    flatpickr(this._cardEdit.getElement().querySelector(`.card__date`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dueDate,
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.getElement().replaceChild(this._cardView.getElement(), this._cardEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._cardView.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onChangeView();
        this._container.getElement().replaceChild(this._cardEdit.getElement(), this._cardView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._cardEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._cardEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._cardEdit.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const formData = new FormData(this._cardEdit.getElement().querySelector(`.card__form`));
        const entry = {
          description: formData.get(`text`),
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
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
        };
        this._onDataChange(entry, this._data);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._cardEdit.getElement()
      .querySelector(`.card__delete`)
      .addEventListener(`click`, () => {
        removeElement(this._cardEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
        this._cardEdit.removeElement();
      });
    render(this._container.getElement(), this._cardView.getElement(), Position.BEFOREEND);
  }
  setDefaultView() {
    if (this._container.getElement().contains(this._cardEdit.getElement())) {
      this._container.getElement().replaceChild(this._cardView.getElement(), this._cardEdit.getElement());
    }
  }
}
