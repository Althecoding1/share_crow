import React, { PropTypes } from 'react';
import Search from '../Marketplace/Search';
import SignUpModal from '../Navigation/SignUpModal';
import SplashCarousel from './SplashCarousel';

const Landing = (props) => (
  <div id="landing">
    <SplashCarousel />
    <div id="slogan-with-search" className="wrap">
      <div className="landing-search">
        <div id="slogan">
          <h2
            id="slogan-phrase"
            data-shadow="Make Some Money. Start Sharing."
            className="basic white"
          >
            Make Some Money. Start Sharing.
          </h2>
        </div>
        <Search />
        <div className="start-sharing">
          <section className="buttons">
            <div className="sharing-button-container">
              <a className="btn btn-1">
                <SignUpModal
                  origin
                  signup={props.signup}
                />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
);

Landing.propTypes = {
  signup: PropTypes.func,
};

export default Landing;
