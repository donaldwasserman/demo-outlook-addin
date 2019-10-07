import * as React from 'react';
import { List } from 'office-ui-fabric-react/lib/List';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { IconButton, PrimaryButton } from 'office-ui-fabric-react';


export default class Messages extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: null,
      email: null,
      isLoaded: false,
      data: []
    };
  }



  componentDidMount() {
   this.updateFromRemote();
  }

  updateFromRemote() {
    Office.context.mailbox.item.to.getAsync(results => {
      if (results.value.length) {
        const email = results.value[0].emailAddress;
        const name = results.value[0].displayName;
        fetch(`https://djw.ngrok.io/emails?email=${email}`)
          .then(res => res.json())
          .then((result) => {
            this.setState({
              ...this.state,
              email,
              name,
              isLoaded: true,
              data: result
            });
          })
      } else {
        this.setState({
            ...this.state,
            isLoaded: true
          })
      }
    });
  }

  handleClick = msg => {
    Office.context.mailbox.item.body.setSelectedDataAsync(msg);
  }

  onRenderSuggestions(item, index) {
    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm8">
            <p>{item.title}</p>
          </div>
          <div className="ms-Grid-col ms-sm4">
            <IconButton iconProps={{iconName: "AddTo"}} onClick={() => this.handleClick(item.message)}/>
          </div>
        </div>
      </div>
    )
  }

  onRenderOrder(item) {
    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm8">
            <h3>Oroder {item.number}: {item.product}</h3>
            <p>${item.amount}</p>
          </div>
          <div className="ms-Grid-col ms-sm4">
            <IconButton iconProps={{iconName: "AddTo"}} onClick={() => this.handleClick(item.message)}/>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { data, isLoaded, email} = this.state;

    if (!isLoaded) {
      return (<div> ...Loading</div>)
    }

    if (!email) {
      return (
        <div className="p-1">
          <h3>No Email Data Found!</h3>
          <PrimaryButton onClick={() => this.updateFromRemote().bind(this)}>
            Update
          </PrimaryButton>
        </div>
      )
    }


    return (
      <div>
        <div className="p-1">
          <h3>Compose Messsage</h3>
          <p><b>{this.state.name}</b>: <span className="ms-textColor-gray10">[{this.state.email}]</span></p>
        </div>
        <div className="p-1">
          <h3>Suggested Introductions</h3>
          <FocusZone direction="vertical">
            <List items={data.data} onRenderCell={this.onRenderSuggestions.bind(this)}/>
          </FocusZone>
        </div>
        <div className="p-1">
          <h3>Order History</h3>
          <FocusZone direction="vertical">
            <List items={data.orders} onRenderCell={this.onRenderOrder.bind(this)}/>
          </FocusZone>
        </div>
      </div>
    )
  }
}