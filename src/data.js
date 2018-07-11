import AlphabotAPIHandler from './api/AlphabotAPIHandler'
import FryApiHandler from './api/FryApiHandler'

function convertSerie(datas) {
  const data = []
  let time = datas[0]
  const size = datas.length

  data.push({ x: new Date(datas[0]), y: datas[1] })

  for (let i = 2; i < size; i += 2) {
    data.push({ x: new Date(datas[i] + time), y: datas[i + 1] })
    time += datas[i]
  }

  return data
}

function getData(params) {
  const { start, stop, reduceseconds, reduce, origin, metric } = params

  const LiveMonCredentials = new AlphabotAPIHandler()

  return LiveMonCredentials.GetToken()
    .then(res => LiveMonCredentials.SetToken(res))
    .then(res => {
      const Fry = new FryApiHandler(LiveMonCredentials.token)
      return Fry.ExecuteRequest('metrics/queryhistory', {
        scope: [
          {
            origin,
            metrics: [metric],
          },
        ],
        start,
        stop,
        reduceseconds,
        reduce,
      }).then(res => Fry.ParseResponse(res, 'data'))
    })
    .then(res => {
      const data = res.data[origin][metric]
      return convertSerie(data)
    })
}

export default getData
