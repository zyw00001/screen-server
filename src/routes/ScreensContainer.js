import {connect} from 'react-redux';
import Screens from './Screens';
import {Action} from '../action-reducer/action';

const action = new Action(['screens']);

const getSelfState = (state) => {
  return state.screens;
};

const createMonitorUsers = (users, maxCount) => {
  const screens = new Array(maxCount).fill(null);
  let index = 0;
  for (const user of users) {
    if (user) {
      screens[index] = user;
      index++;
      if (index >= maxCount) {
        break;
      }
    }
  }
  return screens;
};

const onInit = () => (dispatch, getState) => {
  const {users} = getState().home;
  const payload = {};
  payload.hCount = 4;
  payload.vCount = 4;
  payload.count = payload.hCount * payload.vCount;
  payload.canvasWidth = window.innerWidth / payload.hCount;
  payload.canvasHeight = window.innerHeight / payload.vCount;
  payload.monitorUsers = createMonitorUsers(users, payload.count);
  dispatch(action.create(payload));
};

const onDestroy = () => {
  return action.create({});
};

const onSizeChange = (props) => {
  const canvasWidth = window.innerWidth / props.hCount;
  const canvasHeight = window.innerHeight / props.vCount;
  return action.assign({canvasWidth, canvasHeight});
};

const onSetStatus = (index, status) => {
  if (status !== 'stop') {
    return action.update({status}, 'monitorUsers', index);
  } else {
    return action.replace(null, 'monitorUsers', index);
  }
};

const mapStateToProps = (state) => {
  return getSelfState(state);
};

const creators = {
  onInit,
  onDestroy,
  onSizeChange,
  onSetStatus
};

export default connect(mapStateToProps, creators)(Screens);