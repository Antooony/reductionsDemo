import React from "react";
import { Group } from "@vx/group";
import { scaleTime, scaleLinear } from "@vx/scale";
import { LinePath } from "@vx/shape";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { GradientOrangeRed } from "@vx/gradient";
import { extent, max } from "d3-array";

import getData from "./data";

const width = 450;
const height = 200;

// Bounds
const margin = {
  top: 20,
  bottom: 25,
  left: 70,
  right: 70
};
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

class Graph extends React.Component {
  static defaultProps = {
    x: d => new Date(d.x),
    y: d => d.y
  };

  state = {
    data: []
  };

  // https://reactjs.org/docs/state-and-lifecycle.html
  async componentDidMount() {
    const data = await getData({
      start: this.props.time.getTime() - 40000,
      stop: this.props.time.getTime(),
      reduceseconds: this.props.reduceseconds,
      reduce: this.props.reduce
    });

    this.setState({
      data
    });
  }
  render() {
    const { x, y } = this.props;
    const { data } = this.state;

    const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(data, x)
    });
    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: [0, max(data, y)]
    });

    const title = this.props.title;
    return (
      <div className="Graph">
        <svg width={width} height={height}>
          <GradientOrangeRed id="gradient" />

          <Group top={margin.top} left={margin.left}>
            <LinePath
              data={data}
              xScale={xScale}
              yScale={yScale}
              x={x}
              y={y}
              stroke="url(#gradient)"
              strokeWidth={3}
            />

            <AxisLeft scale={yScale} top={0} left={0} label={title} />

            <AxisBottom scale={xScale} top={yMax} />
          </Group>
        </svg>
      </div>
    );
  }
}

export default Graph;
