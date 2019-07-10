import {connect} from 'react-redux';
import Home from './Home';

const onMonitor = (users) => () => {
  if (users.length) {
    window.location.hash = '/screens';
  }
};

const mapStateToProps = (state) => {
  return state.home;
};

const creators = {
  onMonitor
};

export default connect(mapStateToProps, creators)(Home);
