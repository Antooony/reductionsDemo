var request = require("request");

class AlphabotAPIHandler {
  constructor() {
    this.token = "";
    this.options = {
      url: process.env.REACT_APP_AUTHURI,
      method: "POST",
      json: true,
      body: {
        username: process.env.REACT_APP_USERNAME,
        password: process.env.REACT_APP_PASSWORD,
        grant_type: "password",
        client_id: "lmdashboard"
      }
    };
  }
  GetToken() {
    return new Promise((resolve, reject) => {
      request(this.options, (error, response, body) => {
        if (error !== null || response.statusCode !== 200) {
          return reject({
            type: "AlphabotAPIHandler.GetToken",
            message: body
          });
        }
        var { access_token } = JSON.parse(JSON.stringify(body));
        resolve(access_token);
      });
    });
  }
  SetToken(aValue) {
    return new Promise((resolve, reject) => {
      if (aValue == null) {
        return reject({
          type: "AlphabotAPIHandler.SetToken",
          message: "aValue is empty"
        });
      }
      this.token = aValue;
      resolve();
    });
  }
}

class FryApiHandler {
  constructor(aToken) {
    this.Options = {
      api: process.env.REACT_APP_FRYURI,
      method: "POST",
      json: true,
      headers: {
        Authorization: "Bearer " + aToken,
        "Content-type": "application/json; charset=UTF-8",
        "User-agent": "Mozilla/5.0"
      }
    };
  }
  ExecuteRequest(aLocation, aBody) {
    return new Promise((resolve, reject) => {
      this.Options.url = this.Options.api + aLocation;
      this.Options.body = aBody;
      request(this.Options, (error, response, body) => {
        if (error !== null || response.statusCode !== 200) {
          return reject({
            type: "FryApiHandler.ExecuteRequest",
            message: body
          });
        }
        resolve(body);
      });
    });
  }
  ParseResponse(response, values) {
    return new Promise((resolve, reject) => {
      if (response == null) {
        return reject({
          type: "FryApiHandler.ParseResponse",
          message: "empty string"
        });
      }
      if (typeof values !== "object" && typeof values !== "string") {
        return reject({
          type: "FryApiHandler.ParseResponse",
          message: "bad values input"
        });
      }
      var obj = JSON.parse(JSON.stringify(response));
      var output = {};
      if (typeof values === "object") {
        for (var n in values) {
          output[values[n]] = obj[values[n]];
        }
      }
      if (typeof values === "string") {
        output[values] = obj[values];
      }
      resolve(output);
    });
  }
}

function convertSerie(datas) {
  const data = [];
  let time = datas[0];
  const size = datas.length;

  data.push({ x: new Date(datas[0]), y: datas[1] });

  for (let i = 2; i < size; i += 2) {
    data.push({ x: new Date(datas[i] + time), y: datas[i + 1] });
    time += datas[i];
  }

  return data;
}

function getData(params) {
  var Fry;
  var LiveMonCredentials;
  return new Promise((resolve, reject) => {
    let data;
    LiveMonCredentials = new AlphabotAPIHandler();
    LiveMonCredentials.GetToken()
      .then(res => LiveMonCredentials.SetToken(res))
      .then(res => {
        Fry = new FryApiHandler(LiveMonCredentials.token);
        return Fry.ExecuteRequest("metrics/queryhistory", {
          scope: [
            {
              origin: "000001000013", // paste your origin id here
              metrics: ["001000000000ec"] // paste your metricsid array here
            }
          ],
          start: params.start,
          stop: params.stop,
          reduceseconds: params.reduceseconds,
          reduce: params.reduce
        });
      })
      .then(res => Fry.ParseResponse(res, "data"))
      .then(res => {
        console.log(res);
        data = res.data["000001000013"]["001000000000ec"];
        resolve(convertSerie(data));
      })
      .catch(err => {
        console.log(err.type, err.message);
      });
  });
}

module.exports = getData;
