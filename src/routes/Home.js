import React from 'react';

const renderUser = (user, index) => {
  return <li key={user.mac || index}>{user.mac || '新用户'}</li>;
};

const Home = ({users, checked, onMonitor}) => {
  return (
    <div>
      <button onClick={() => onMonitor(users, checked)}>监控</button>
      <ol>{users.map(renderUser)}</ol>
    </div>
  );
};

export default Home;
