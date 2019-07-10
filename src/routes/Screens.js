import React from 'react';
import Screen from './Screen';

class Screens extends React.Component {
  constructor(props) {
    super(props);
    this.renderScreen = this.renderScreen.bind(this);
    this.onWindowSizeChange = this.onWindowSizeChange.bind(this);
  }

  componentWillMount() {
    this.props.onInit();
    window.addEventListener('resize', this.onWindowSizeChange);
  }

  componentWillUnmount() {
    this.props.onDestroy();
    window.removeEventListener('resize', this.onWindowSizeChange);
  }

  onWindowSizeChange() {
    this.props.onSizeChange(this.props);
  };

  renderScreen(user, index) {
    const props = {
      user,
      index,
      history: this.props.history,
      canvasWidth: this.props.canvasWidth,
      canvasHeight: this.props.canvasHeight,
      onSetStatus: this.props.onSetStatus
    };
    return <div key={index}><Screen {...props}/></div>;
  }

  render() {
    return (
      <div className='screen-render-multi'>
        {this.props.monitorUsers && this.props.monitorUsers.map(this.renderScreen)}
      </div>
    );
  }
}

export default Screens;