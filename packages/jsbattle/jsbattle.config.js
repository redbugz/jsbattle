require('dotenv').config()

module.exports = {
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