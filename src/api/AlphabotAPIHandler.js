import request from 'request'

const { REACT_APP_AUTHURI, REACT_APP_USERNAME, REACT_APP_PASSWORD } = process.env

class AlphabotAPIHandler {
  constructor() {
    this.token = ''
    this.options = {
      url: REACT_APP_AUTHURI,
      method: 'POST',
      json: true,
      body: {
        username: REACT_APP_USERNAME,
        password: REACT_APP_PASSWORD,
        grant_type: 'password',
        client_id: 'lmdashboard',
      },
    }
  }
  GetToken() {
    return new Promise((resolve, reject) => {
      request(this.options, (error, response, body) => {
        if (error !== null || response.statusCode !== 200) {
          return reject({
            type: 'AlphabotAPIHandler.GetToken',
            message: body,
          })
        }
        var { access_token } = JSON.parse(JSON.stringify(body))
        resolve(access_token)
      })
    })
  }
  SetToken(aValue) {
    return new Promise((resolve, reject) => {
      if (aValue == null) {
        return reject({
          type: 'AlphabotAPIHandler.SetToken',
          message: 'aValue is empty',
        })
      }
      this.token = aValue
      resolve()
    })
  }
}

export default AlphabotAPIHandler
