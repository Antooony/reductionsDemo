import AlphabotAPIHandler from './AlphabotAPIHandler'
import FryApiHandler from './FryApiHandler'

function getHostList() {
  const LiveMonCredentials = new AlphabotAPIHandler()
  return LiveMonCredentials.GetToken()
    .then(res => LiveMonCredentials.SetToken(res))
    .then(res => {
      const Fry = new FryApiHandler(LiveMonCredentials.token)
      return Fry.ExecuteRequest('origins.fromid', {}).then(res => Fry.ParseResponse(res, 'info'))
    })
    .then(res => {
      const result = []
      res.info.forEach(n => {
        result.push({ host: n.host, id: n.id })
      })
      return result
    })
}

export default getHostList
