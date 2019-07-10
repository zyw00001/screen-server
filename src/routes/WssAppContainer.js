import {connect} from 'react-redux';
import WssApp from './WssApp';
import {Action} from '../action-reducer/action';

const action = new Action(['home']);

const getUsers = (state) => {
  return state.home.users;
};

const onAddUser = (users, ws) => {
  if (!users.find(user => user.ws === ws)) {
    return action.add({ws}, 'users', 0);
  } else {
    return () => void 0;
  }
};

const onSetUser = (users, ws, {mac='获取mac失败', width, height}) => {
  const index = users.findIndex(user => user.ws === ws);
  if (index > -1) {
    return action.update({mac, width, height}, 'users', index);
  } else {
    return () => void 0;
  }
};

const onRemoveUser = (users, ws) => {
  const newUsers = users.filter(user => user.ws !== ws);
  if (newUsers.length !== users.length) {
    return action.assign({users});
  } else {
    return () => void 0;
  }
};

const mapStateToProps = (state) => {
  return {users: getUsers(state)};
};

const creators = {
  onAddUser,
  onSetUser,
  onRemoveUser
};

export default connect(mapStateToProps, creators)(WssApp);