import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { getListing, postListing } from '../../actions/listingActions';
import { putImage } from '../../actions/imageActions';
import { getCategory } from '../../actions/categoryActions';
import { refreshComponent } from '../../actions/sessionActions';
import ImageUploader from './../Shared/ImageUploader';

class PostAnItemModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.isAuth.userInfo.username,
      ownerId: props.isAuth.userInfo.id,
      open: false,
      listing: '',
      maxFee: '',
      rentalFee: '',
      category: '1',
      subcategory: '',
      uploadListing: '',
      uploadID: '',
      authOpen: true,
      token: null,
    };
    this.categories = [];
    this.subcategories = [];
    this.methods = props.methods;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemListing = this.handleItemListing.bind(this);
    this.handleMaxFee = this.handleMaxFee.bind(this);
    this.handleRentalFee = this.handleRentalFee.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleSubcategory = this.handleSubcategory.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
    this.closeOAuth = this.closeOAuth.bind(this);
  }

  componentDidMount() {
    fetch(`/main/profile?id=${this.state.ownerId}`)
    .then(res => res.json())
    .then(json => {
      this.setState({
        token: json.stripeToken,
      });
    });
    this.methods.getCategory();
  }


  componentWillReceiveProps(nextProps) {
    this.categories = nextProps.category.filter(category =>
      category.CategoryId === null
    );
    this.subcategories = nextProps.category.filter(subcategory =>
      String(subcategory.CategoryId) === this.state.category
    );
  }

  checkAuth() {
    this.openModal();
    if (this.state.token === null) {
      this.setState({
        authOpen: true,
      });
    } else {
      this.setState({
        authOpen: false,
      });
    }
  }

  closeOAuth() {
    this.closeModal();
    this.closeOAuth();
  }

  handleSubmit() {
    const listingData = {
      item: this.state.listing,
      max_fee: this.state.maxFee,
      rental_fee: this.state.rentalFee,
      owner_id: this.state.ownerId,
      category: this.state.subcategory !== '' ? this.state.subcategory : this.state.category,
    };
    this.methods.postListing(listingData, responseData => {
      this.methods.putImage({
        id: this.state.uploadID,
        listingId: responseData.id,
      }, () => {
        this.methods.refreshComponent(true);
      });
    });

    this.closeModal();
  }

  handleUpload(listing, id) {
    this.setState({
      uploadListing: listing,
      uploadID: id,
    });
    console.log(`image upload stored at id: ${listing}`);
  }

  handleItemListing(value) { this.setState({ listing: value.target.value }); }
  handleMaxFee(value) { this.setState({ maxFee: value.target.value }); }
  handleRentalFee(value) { this.setState({ rentalFee: value.target.value }); }
  handleCategory(value) {
    this.setState({ category: value.target.value });
    this.subcategories = this.props.category.filter(subcategory =>
      String(subcategory.CategoryId) === value.target.value
    );
  }
  handleSubcategory(value) { this.setState({ subcategory: value.target.value }); }
  openModal() { this.setState({ open: true }); }
  closeModal() { this.setState({ open: false }); }
  openAuthModal() { this.setState({ authOpen: true }); }
  closeAuthModal() { this.setState({ authOpen: false }); }

  render() {
    return (
      <div className="post-item-wrapper">
        <div
          className="post-item-modal"
          onClick={this.checkAuth}
        >
          Post an Item
        </div>
        <Modal
          style={{ content: { height: '600px' } }}
          isOpen={this.state.open}
          onRequestClose={this.closeModal}
        ><Modal
          style={{ content: { height: '15em', width: '40em',
          backgroundColor: 'rgba(143,27,15,0.8)',
          top: '35%',
          } }}
          isOpen={this.state.authOpen}
          onRequestClose={this.closeAuthModal}
        >
          <form action="/authorize" method="GET" className="authorizePopUp">
            <h3>To become a merchant on Sharecrow please authenticate
            yourself through Stripe</h3>
            <button className="stripeConnect">Authorize</button>
          </form>
          <button
            className="marketplace-button authExit"
            onClick={this.closeOAuth}
          >x</button>
        </Modal>
          <input
            className="close-button"
            type="submit"
            value="x"
            onClick={this.closeModal}
          />
          <h1 className="modal-header">Post Item</h1>
          <div>Item Listing Title</div>
          <input
            value={this.state.listing}
            onChange={this.handleItemListing}
            type="text"
          />
          <div>Max Fee - Cost set in case of lost or damaged item</div>
          <input
            value={this.state.maxFee}
            onChange={this.handleMaxFee}
            type="text"
          />
          <div>Rental Fee - Cost per day</div>
          <input
            value={this.state.rentalFee}
            onChange={this.handleRentalFee}
            type="text"
          />
          <div>
            <label htmlFor="post-modal-categories">Category: </label>
            <select
              id="post-modal-categories"
              value={this.state.category}
              onChange={this.handleCategory}
              style={{ width: `${200}px` }}
            >
              {
                this.categories.map(category =>
                  <option
                    id={category.id}
                    value={category.id}
                  >{category.categoryName}</option>
                )
              }
            </select>
          </div>
          <div>
            <label htmlFor="post-modal-subcategories">Subcategory: </label>
            <select
              id="post-modal-subcategories"
              value={this.state.subcategory}
              onChange={this.handleSubcategory}
              style={{ width: `${200}px` }}
            >
              <option value={""}>None</option>
              {
                this.subcategories.map(subcategory =>
                  <option
                    key={subcategory.id}
                    value={subcategory.id}
                  >{subcategory.categoryName}</option>
                )
              }
            </select>
          </div>
          <ImageUploader
            handleUpload={this.handleUpload}
          />
          <input
            className="modal-post-item-button button"
            type="submit"
            value="Post Item"
            onClick={this.handleSubmit}
          />
        </Modal>
      </div>
    );
  }
}

PostAnItemModal.propTypes = {
  isAuth: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
  category: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { listing, category, isAuth, user } = state;

  return {
    user,
    listing,
    category,
    isAuth,
  };
}

const mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    methods: {
      getListing: (query, cb) => {
        dispatch(getListing(query, cb));
      },
      postListing: (data, cb) => {
        dispatch(postListing(data, cb));
      },
      getCategory: () => {
        dispatch(getCategory());
      },
      putImage: (data, cb) => {
        dispatch(putImage(data, cb));
      },
      refreshComponent: (bool) => {
        dispatch(refreshComponent(bool));
      },
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostAnItemModal);
