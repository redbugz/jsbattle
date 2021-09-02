require('dotenv').config()

const baseUrl = process.env.DYNO ? 'https://fsbattle.herokuapp.com' : 'localhost'
const port = process.env.PORT || 8080
module.exports = {
  "web": {
    port: port,
    baseUrl: `${baseUrl}:${port}`,
    corsOrigin: [`${baseUrl}:${port}`],
  },
  "auth": {
    "admins": [
      {
        "provider": "github",
        "username": "redbugz"
      }
    ],
    "providers": [
      {
        "name": "github",
      },
      // {
      //   "name": "teamtoken",
      //   "clientID": "",
      //   "clientSecret": ""
      // }
    ]
  },
  "data": {
    "adapter": "mongo",
    "uri": process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
  },
  "league": {
    "scheduleInterval": 600000
  }
}