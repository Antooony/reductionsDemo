import React from 'react'
import ReactDOM from 'react-dom'

import Graph from './graph'
import GraphFull from './allInOne'
import getHostList from './api/HostList'
import getMetricsList from './api/MetricList'

import './index.css'

const CHART_FULL = [
  {
    title: 'AllInOne',
    reduce: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  },
]
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

const ChartContainerFull = ({ origin, metric, charts }) => {
  const p = {
    metric,
    origin,
    time: TIME,
    reduceseconds: 10,
  }
  return (
    <div className="GraphContainer">
      {charts.map((chart, i) => <GraphFull key={i} {...p} {...chart} />)}
    </div>
  )
}

const DEFAULT_ORIGIN = '000001000013'
const DEFAULT_METRIC = '001000000000ec'

const SelectHosts = ({ onChange, hosts }) => {
  return (
    <div>
      <select onChange={onChange}>
        {hosts.map(host => (
          <option value={host.id} key={host.id}>
            {host.host}
          </option>
        ))}
      </select>
    </div>
  )
}

const SelectMetrics = ({ onChange, metrics }) => {
  return (
    <div>
      <select onChange={onChange}>
        {metrics.map(metric => (
          <option value={metric.id} key={metric.id}>
            {metric.name}
          </option>
        ))}
      </select>
    </div>
  )
}

class Items extends React.Component {
  state = {
    inputValue: {
      origin: DEFAULT_ORIGIN,
      metric: DEFAULT_METRIC,
    },
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

  render() {
    const { hosts, metrics } = this.props
    const {
      inputValue: { origin, metric },
    } = this.state

    const p = {
      origin,
      metric,
    }
    return (
      <div>
        <div className="selects">
          <SelectHosts onChange={this.handleChangeInput('origin')} hosts={hosts} />
        </div>
        <div className="selects">
          <SelectMetrics onChange={this.handleChangeInput('metric')} metrics={metrics} />
        </div>
        <ChartContainer {...p} charts={CHART_1} />
        <ChartContainer {...p} charts={CHART_2} />
        <ChartContainer {...p} charts={CHART_3} />
        <ChartContainer {...p} charts={CHART_4} />
        <ChartContainerFull {...p} charts={CHART_FULL} />
      </div>
    )
  }
}

class Main extends React.Component {
  state = {
    hosts: [],
    metrics: [],
  }

  async componentDidMount() {
    Promise.all([getHostList(), getMetricsList(DEFAULT_ORIGIN)]).then(([hosts, metrics]) =>
      this.setState({
        hosts: hosts.sort((a, b) => a.host.localeCompare(b.host)),
        metrics: metrics.sort((a, b) => a.name.localeCompare(b.name)),
      }),
    )
  }

  render() {
    const { hosts, metrics } = this.state
    return (
      <div className="main">
        <div className="Items">
          <Items hosts={hosts} metrics={metrics} />
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(<Main />, document.getElementById('root'))
