import * as React from 'react';
import Header from './Header';
import Progress from './Progress';
import Messages from './Messages';

export default class App extends React.Component {

  render() {
    const {
      title,
      isOfficeInitialized,
    } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo='assets/logo-filled.png'
          message='Please sideload your addin to see app body.'
        />
      );
    }

    return (
      <div className='ms-welcome'>
        <Header title={this.props.title} message='Email Helper' />
        <p className='ms-font-l p-1'>This is how we supercharge our email client for our valued employees.</p>
        <Messages/>
      </div>
    );
  }
}
