exports.connection = function() {
  if (process.env.DB_URL) {
    return process.env.DB_URL;
  }

  return {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
};

exports.initUser = {
  name: process.env.SYSADMIN_NAME,
  password: process.env.SYSADMIN_PASSWORD,
  email: process.env.SYSADMIN_EMAIL,
  systemAdminId: 1,
  role: 'systemadmin',
  lastLogon: new Date(),
};
