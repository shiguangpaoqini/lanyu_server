module.exports = {
  port: 3000,
  mongodb: {
    name: 'lanyu-server',
    host: '127.0.0.1',
    port: 27017,
    user: '',
    pwd:  ''
  },
  mailer: {

  },
  encrypt: {
    salt: 'lanyu-server2019',
  },
  token: {
    secret: 'lanyu',
    expires: '4h',
    unlesses: [/^\/api\/v1\/user/, /^\/api\/v1\/article/, /^\/api\/v1\/classify/, /^\/api\/v1\/tag/]
  },
  router: {
    prefix: '/api/v1/'
  },
  qiniu: {
    accessKey: '',
    secretKey: '',
    scope: '',
    expires: 7200
  },
}