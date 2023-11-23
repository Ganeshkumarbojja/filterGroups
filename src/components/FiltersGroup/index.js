import {IoIosSearch} from 'react-icons/io'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    activeCategoryId,
    changeActiveCategory,
    changeTitleSearch,
    ratingsList,
    changeActiveRatingId,
    activeRatingId,
    clearAllFilters,
  } = props
  const onChangeTitleSearch = event => {
    if (event.key === 'Enter') {
      changeTitleSearch(event.target.value)
    }
  }
  const onClearFilters = () => {
    clearAllFilters()
  }
  return (
    <div className="filters-group-container">
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          onKeyDown={onChangeTitleSearch}
        />
        <IoIosSearch className="search-logo" />
      </div>
      <h1 className="filter-types-head">Category</h1>
      <ul className="filter-type-items">
        {categoryOptions.map(item => {
          const activeCategoryBtn =
            activeCategoryId === item.categoryId ? 'active-btn' : ''
          const onClickCategory = () => {
            changeActiveCategory(item.categoryId)
          }
          return (
            <li key={item.categoryId} className="category-item">
              <p
                className={`category-btn ${activeCategoryBtn}`}
                onClick={onClickCategory}
              >
                {item.name}
              </p>
            </li>
          )
        })}
      </ul>
      <h1 className="filter-types-head">Rating</h1>
      <ul className="filter-type-items">
        {ratingsList.map(item => {
          const onClickRating = () => {
            changeActiveRatingId(item.ratingId)
          }
          const activeRatingBtn =
            item.ratingId === activeRatingId ? 'active-btn' : ''
          return (
            <li key={item.ratingId} className="rating-item">
              <img
                src={item.imageUrl}
                className="rating-images"
                alt={` rating ${item.ratingId}`}
              />
              <button
                type="button"
                className={`up-btn ${activeRatingBtn}`}
                onClick={onClickRating}
              >
                &up
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className="clear-filters-btn"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
