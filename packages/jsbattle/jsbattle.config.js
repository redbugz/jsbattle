require('dotenv').config()

const port = process.env.PORT || 8080
console.log("PORT", port)
const baseUrl = process.env.DYNO ? 'https://fsbattle.herokuapp.com' : `http://localhost:${port}`
module.exports = {
  "web": {
    port: port,
    baseUrl: baseUrl,
    corsOrigin: [baseUrl],
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