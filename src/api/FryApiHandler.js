import request from 'request'

const { REACT_APP_FRYURI } = process.env

class FryApiHandler {
  constructor(aToken) {
    this.Options = {
      api: REACT_APP_FRYURI,
      method: 'POST',
      json: true,
      headers: {
        Authorization: 'Bearer ' + aToken,
        'Content-type': 'application/json; charset=UTF-8',
        'User-agent': 'Mozilla/5.0',
      },
    }
  }
  ExecuteRequest(aLocation, aBody) {
    return new Promise((resolve, reject) => {
      this.Options.url = this.Options.api + aLocation
      this.Options.body = aBody
      request(this.Options, (error, response, body) => {
        if (error !== null || response.statusCode !== 200) {
          return reject({
            type: 'FryApiHandler.ExecuteRequest',
            message: body,
          })
        }
        resolve(body)
      })
    })
  }
  ParseResponse(response, values) {
    return new Promise((resolve, reject) => {
      if (response == null) {
        return reject({
          type: 'FryApiHandler.ParseResponse',
          message: 'empty string',
        })
      }
      if (typeof values !== 'object' && typeof values !== 'string') {
        return reject({
          type: 'FryApiHandler.ParseResponse',
          message: 'bad values input',
        })
      }
      var obj = JSON.parse(JSON.stringify(response))
      var output = {}
      if (typeof values === 'object') {
        for (var n in values) {
          output[values[n]] = obj[values[n]]
        }
      }
      if (typeof values === 'string') {
        output[values] = obj[values]
      }
      resolve(output)
    })
  }
}

export default FryApiHandler
