const dbString = require('url').parse(process.env.DATABASE_URL),
      auth = dbString.auth.split(':');
console.log(JSON.stringify({
  "url": "http://beta.kevinpei.com/",
  "server": {
    host: '0.0.0.0',
    port: 5000
  },
  "preloadHeaders": 100,
  "database": {
    "client": "mysql",
    "connection": {
        host: dbString.hostname,
        user: auth[0],
        password: auth[1],
        database: dbString.path.substring(1),
        port: dbString.port,
        charset: 'utf8'
    }
  },
  "mail": {
    "transport": "SMTP",
    "options": {
        "service": "Mailgun",
        "auth": {
            "user": process.env.MAILUSER,
            "pass": process.env.MAILPASS
        }
    }
  },
  "logging": {
    "transports": [
      "stdout"
    ]
  },
  "paths": {
    "contentPath": "../../content"
  }
}));