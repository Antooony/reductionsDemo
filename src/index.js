import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Graph from "./graph";

class Items extends React.Component {
  renderGraph(params) {
    return <Graph {...params} />;
  }
  render() {
    let time = new Date();
    return (
      <div>
        <div className="GraphContainer">
          {this.renderGraph({ time: time, title: "classic" })}
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 1,
            title: "median"
          })}
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 2,
            title: "average"
          })}
        </div>
        <div className="GraphContainer">
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 3,
            title: "min"
          })}
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 4,
            title: "max"
          })}
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 5,
            title: "1st percentile"
          })}
        </div>
        <div className="GraphContainer">
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 6,
            title: "10th percentile"
          })}
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 7,
            title: "90th percentile"
          })}
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 8,
            title: "99th percentile"
          })}
        </div>
        <div className="GraphContainer">
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 9,
            title: "25%+75%"
          })}
          {this.renderGraph({
            time: time,
            reduceseconds: 10,
            reduce: 10,
            title: "linear regression"
          })}
        </div>
      </div>
    );
  }
}

class Main extends React.Component {
  render() {
    return (
      <div className="main">
        <div className="Items">
          <Items />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Main />, document.getElementById("root"));
