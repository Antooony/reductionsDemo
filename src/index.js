import React from 'react'
import ReactDOM from 'react-dom'

import Graph from './graph'

import './index.css'

const CHARTS = [
  [
    {
      title: 'classic',
    },
    {
      title: 'median',
      reduce: 1,
    },
    {
      title: 'average',
      reduce: 2,
    },
  ],
  [
    {
      title: 'min',
      reduce: 3,
    },
    {
      title: 'max',
      reduce: 4,
    },
    {
      title: '1st percentile',
      reduce: 5,
    },
  ],
  [
    {
      title: '10th percentile',
      reduce: 6,
    },
    {
      title: '90th percentile',
      reduce: 7,
    },
    {
      title: '99th percentile',
      reduce: 8,
    },
  ],
  [
    {
      title: '25%+75%',
      reduce: 9,
    },
    {
      title: 'linear regression',
      reduce: 10,
    },
  ],
]
const [CHART_1, CHART_2, CHART_3, CHART_4] = CHARTS
const TIME = new Date()

const ChartContainer = ({ origin, metric, charts }) => {
  const p = {
    metric,
    origin,
    time: TIME,
    reduceseconds: 10,
  }
  return (
    <div className="GraphContainer">
      {charts.map((chart, i) => <Graph key={i} {...p} {...chart} />)}
    </div>
  )
}

const DEFAULT_ORIGIN = '000001000013'
const DEFAULT_METRIC = '001000000000ec'

class Items extends React.Component {
  state = {
    inputValue: {
      origin: DEFAULT_ORIGIN,
      metric: DEFAULT_METRIC,
    },
    metric: DEFAULT_METRIC,
    origin: DEFAULT_ORIGIN,
  }

  handleChangeInput = type => e => {
    const { target } = e
    this.setState(prev => ({
      inputValue: {
        ...prev.inputValue,
        [type]: target.value,
      },
    }))
  }

  handleSubmit = e => {
    e.preventDefault()

    this.setState(prev => ({
      metric: prev.inputValue.metric,
      origin: prev.inputValue.origin,
    }))
  }

  render() {
    const { inputValue, origin, metric } = this.state

    const p = {
      origin,
      metric,
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              type="text"
              value={inputValue.origin}
              onChange={this.handleChangeInput('origin')}
            />
          </div>
          <div>
            <input
              type="text"
              value={inputValue.metric}
              onChange={this.handleChangeInput('metric')}
            />
          </div>
          <div>
            <button type="submit">Ok!</button>
          </div>
        </form>
        <ChartContainer {...p} charts={CHART_1} />
        <ChartContainer {...p} charts={CHART_2} />
        <ChartContainer {...p} charts={CHART_3} />
        <ChartContainer {...p} charts={CHART_4} />
      </div>
    )
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
    )
  }
}

// ========================================

ReactDOM.render(<Main />, document.getElementById('root'))
