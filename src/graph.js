import React from 'react'
import { Group } from '@vx/group'
import { scaleTime, scaleLinear } from '@vx/scale'
import { LinePath } from '@vx/shape'
import { AxisLeft, AxisBottom } from '@vx/axis'
import {
  GradientDarkgreenGreen,
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue,
  LinearGradient,
} from '@vx/gradient'
import { extent, max } from 'd3-array'

import getData from './data'

const width = 450
const height = 200

// Bounds
const margin = {
  top: 20,
  bottom: 25,
  left: 70,
  right: 70,
}
const xMax = width - margin.left - margin.right
const yMax = height - margin.top - margin.bottom

class Graph extends React.Component {
  static defaultProps = {
    domain: {},
    x: d => new Date(d.x),
    y: d => d.y,
  }

  state = {
    data: [],
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps) {
    const { origin, metric } = this.props

    if (prevProps.origin !== origin || prevProps.metric !== metric) {
      this.getData(true)
    }
  }

  async getData() {
    const { reduce, reduceseconds, time, origin, metric } = this.props

    try {
      const t = time.getTime()

      const data = await getData({
        metric,
        origin,
        reduce,
        reduceseconds,
        start: t - 40000,
        stop: t,
      })
      this.setState({
        data,
      })
    } catch (e) {
      console.log(e.type, e.message)
    }
  }

  render() {
    const { title, x, y, domain, i } = this.props
    const { data } = this.state

    const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(data, x),
    })
    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: domain.y || [0, max(data, y)],
    })

    return (
      <div className="Graph">
        <svg width={width} height={height}>
          <GradientDarkgreenGreen id="gradient-0" />
          <GradientPurpleTeal id="gradient-1" />
          <GradientLightgreenGreen id="gradient-2" />
          <GradientOrangeRed id="gradient-3" />
          <GradientPinkBlue id="gradient-4" />
          <GradientPinkRed id="gradient-5" />
          <GradientPurpleOrange id="gradient-6" />
          <GradientTealBlue id="gradient-7" />
          <GradientSteelPurple id="gradient-8" />
          <LinearGradient from="#a18cd1" to="#fbc2eb" id="gradient-9" />

          <Group top={margin.top} left={margin.left}>
            <LinePath
              data={data}
              stroke={'url(#gradient-' + i + ')'}
              strokeWidth={3}
              x={x}
              xScale={xScale}
              y={y}
              yScale={yScale}
            />
            <LinePath
              data={data}
              stroke="url(#gradient)"
              strokeWidth={3}
              x={x}
              xScale={xScale}
              y={y}
              yScale={yScale}
            />
            <AxisLeft scale={yScale} top={0} left={0} label={title} />

            <AxisBottom numTicks={0} scale={xScale} top={yMax} />
          </Group>
        </svg>
      </div>
    )
  }
}

export default Graph
