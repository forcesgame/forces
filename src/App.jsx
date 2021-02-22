class Parent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Heading/>
      </React.Fragment>
    );
  }
}

function Heading() {
  return (
    <h1>forces</h1>
  );
}

const element = <Parent/>
ReactDOM.render(element, document.getElementById('content'));