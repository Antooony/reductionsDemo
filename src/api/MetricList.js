import AlphabotAPIHandler from './AlphabotAPIHandler'
import FryApiHandler from './FryApiHandler'

function getMetricsList(origin) {
  const LiveMonCredentials = new AlphabotAPIHandler()
  return LiveMonCredentials.GetToken()
    .then(res => LiveMonCredentials.SetToken(res))
    .then(res => {
      const Fry = new FryApiHandler(LiveMonCredentials.token)
      return Fry.ExecuteRequest('metrics.fromorigin', { origins: [origin] }).then(res =>
        Fry.ParseResponse(res, 'info'),
      )
    })
    .then(res => {
      const result = []
      res.info[origin].forEach(n => {
        result.push({ name: n.name, id: n.id })
      })
      return result
    })
    .catch(err => console.log(err))
}

export default getMetricsList
