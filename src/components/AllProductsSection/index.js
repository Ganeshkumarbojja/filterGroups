import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noProducts: 'NO_PRODUCTS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    titleSearch: '',
    activeRatingId: '',
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {
      activeOptionId,
      activeCategoryId,
      titleSearch,
      activeRatingId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${titleSearch}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiConstants.success,
      })
      if (updatedData.length === 0) {
        this.setState({apiStatus: apiConstants.noProducts})
      }
    } else {
      this.setState({
        apiStatus: apiConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderNoProductsView = () => (
    <div className="no-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-products-image"
      />
      <h1 className="no-products-found">No Products Found</h1>
      <p className="no-products-description">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  changeActiveCategory = categoryId => {
    this.setState({activeCategoryId: categoryId}, this.getProducts)
  }

  changeTitleSearch = titleSearch => {
    this.setState({titleSearch}, this.getProducts)
  }

  changeActiveRatingId = ratingId => {
    this.setState({activeRatingId: ratingId}, this.getProducts)
  }

  clearAllFilters = () => {
    this.setState(
      {activeCategoryId: '', titleSearch: '', activeRatingId: ''},
      this.getProducts,
    )
  }

  renderViewBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderProductsList()
      case apiConstants.noProducts:
        return this.renderNoProductsView()
      default:
        return null
    }
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-image"
      />
      <h1 className="products-failure-head">Oops! Something Went Wrong</h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please again.
      </p>
    </div>
  )

  render() {
    const {activeCategoryId, activeRatingId} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          activeCategoryId={activeCategoryId}
          changeActiveCategory={this.changeActiveCategory}
          changeTitleSearch={this.changeTitleSearch}
          ratingsList={ratingsList}
          changeActiveRatingId={this.changeActiveRatingId}
          activeRatingId={activeRatingId}
          clearAllFilters={this.clearAllFilters}
        />
        {this.renderViewBasedOnApiStatus()}
      </div>
    )
  }
}

export default AllProductsSection
