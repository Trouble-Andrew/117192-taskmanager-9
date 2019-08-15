export const getFiltersMarkup = ({title, setCount}) => `
  <section class="main__filter filter container">
    <input
      type="radio"
      id="filter__all"
      class="filter__input visually-hidden"
      name="filter"
      checked
    />
    <label for="filter__all" class="filter__label">
      ${title[0]} <span class="filter__all-count">1</span></label
    >
    <input
      type="radio"
      id="filter__overdue"
      class="filter__input visually-hidden"
      name="filter"
      disabled
    />
    <label for="filter__overdue" class="filter__label"
      >${title[1]} <span class="filter__overdue-count">${setCount(`dueDate`)}</span></label
    >
    <input
      type="radio"
      id="filter__today"
      class="filter__input visually-hidden"
      name="filter"
      disabled
    />
    <label for="filter__today" class="filter__label"
      >${title[2]} <span class="filter__today-count">${setCount(`today`)}</span></label
    >
    <input
      type="radio"
      id="filter__favorites"
      class="filter__input visually-hidden"
      name="filter"
      disabled
    />
    <label for="filter__favorites" class="filter__label"
      >${title[3]} <span class="filter__favorites-count">${setCount(`isFavorite`)}</span></label
    >
    <input
      type="radio"
      id="filter__repeating"
      class="filter__input visually-hidden"
      name="filter"
      disabled
    />
    <label for="filter__repeating" class="filter__label"
      >${title[4]} <span class="filter__repeating-count">${setCount(`repeatingDays`)}</span></label
    >
    <input
      type="radio"
      id="filter__tags"
      class="filter__input visually-hidden"
      name="filter"
      disabled
    />
    <label for="filter__tags" class="filter__label"
      >${title[5]} <span class="filter__tags-count">${setCount(`tags`)}</span></label
    >
    <input
      type="radio"
      id="filter__archive"
      class="filter__input visually-hidden"
      name="filter"
    />
    <label for="filter__archive" class="filter__label"
      >Archive <span class="filter__archive-count">115</span></label
    >
  </section>
`;
