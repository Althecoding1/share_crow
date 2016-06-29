import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getUser, postUser, putUser, deleteUser } from '../actions/userActions.js';
import { getListing, postListing, putListing, deleteListing } from '../actions/listingActions.js';
import { getMessage, postMessage, putMessage, deleteMessage } from '../actions/messageActions.js';
import { getSession, isLoggedIn } from '../actions/sessionActions.js';
import NavBar from './NavBar.js';
import Footer from './Footer.js';
import ProfileCard from './ProfileCard.js';
import ProductList from './ProductList.js';
// import MessageInbox from './MessageInbox.js';
import LoadingBar from './LoadingBar.js';

require('../assets/styles/app.scss');


class Profile extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.products = [];
    this.profile = props.session;
    this.id = this.profile.id;
    this.methods = props.methods;
    this.methods.isLoggedIn();
    // this.inbox = [];
    // this.outbox = [];
  }

  componentDidMount() {
    console.log('profile mount: ', this.props);
    if (this.props.isAuth.status) {
      // this.methods.getListing(`name=${this.props.isAuth.username}`);
      // this.methods.getUser(`username=${this.props.isAuth.username}`);
      // this.methods.getUser(`username=${this.props.isAuth.username}`);
      // this.methods.getMessage('recipientId=10');
      // this.methods.getMessage('senderId=10');
      this.methods.getListing('owner_id=4');
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('profile nextProps', nextProps);
    if (!nextProps.isAuth.status) {
      nextProps.history.push('/');
    }

    this.profile = nextProps.session;
    this.products = nextProps.listing;
    // re-render with new props
  }

  render() {
    return (
      !this.props.isAuth.status ?
        <LoadingBar /> :
        <div id="profile">
          <NavBar
            isLoggedIn={this.props.isAuth.status}
            username={this.props.isAuth.username}
          />
          <div className="row">
            <div className="col-xs-6 col-md-4">
              <ProfileCard profile={this.profile} />
            </div>
            <div id="profile-items">
              <h3>My Items</h3>
              <ProductList products={this.products} />
            </div>
          </div>
          <Footer />
        </div>
    );
  }
}


Profile.propTypes = {
  user: PropTypes.object.isRequired,
  listing: PropTypes.array.isRequired,
  session: PropTypes.object.isRequired,
  methods: PropTypes.object.isRequired,
  isAuth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { user, listing, message, session, isAuth } = state;

  return {
    user,
    listing,
    message,
    session,
    isAuth,
  };
}

const mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    methods: {
      getUser: (id) => {
        dispatch(getUser(id));
      },
      postUser: (data) => {
        dispatch(postUser(data));
      },
      putUser: (data) => {
        dispatch(putUser(data));
      },
      deleteUser: (data) => {
        dispatch(deleteUser(data));
      },
      getListing: (id) => {
        dispatch(getListing(id));
      },
      postListing: (data) => {
        dispatch(postListing(data));
      },
      putListing: (data) => {
        dispatch(putListing(data));
      },
      deleteListing: (data) => {
        dispatch(deleteListing(data));
      },
      getMessage: (id) => {
        dispatch(getMessage(id));
      },
      postMessage: (data) => {
        dispatch(postMessage(data));
      },
      putMessage: (data) => {
        dispatch(putMessage(data));
      },
      deleteMessage: (data) => {
        dispatch(deleteMessage(data));
      },
      getSession: (data) => {
        dispatch(getSession(data));
      },
      isLoggedIn: () => {
        dispatch(isLoggedIn());
      },
    },
  };
};

// Profile.willTransitionTo = () => {
//   console.log('STUFF HAPPENED');
//   router.getCurrentPath();
// };
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
