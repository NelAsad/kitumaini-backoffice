import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  api: 'http://65.109.134.87:3000/api'
};
