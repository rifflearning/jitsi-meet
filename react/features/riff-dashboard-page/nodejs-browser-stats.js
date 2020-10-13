/* global APP */
import io from 'socket.io-client';

const link = process.env.BROWSER_STATS_SERVER_URL;
const statSocket = !link ? null : io(link, { path: '/api/nodejs-browser-stats/socket.io' });

export function sendStatsOnConnect() {
  if (!link) return;
  statSocket.emit('start conference', JSON.stringify(getUserData()));

  setTimeout(() => {
    sendAdditionalNetworkStats('networkStatsAfter30sec');
  }, 30000);

  let i = 0;
  setInterval(() => {
    sendAdditionalNetworkStats(`networkStatsAfter${i += 5}min`);
  }, 5 * 60000);
}

export function sendStatsOnHangup() {
  if (!link) return;
  sendAdditionalNetworkStats('networkStatsOnHangup');
  statSocket.disconnect();
}

function sendAdditionalNetworkStats(key) {
  statSocket.emit('additional networkStats', JSON.stringify({
    [key]: JSON.stringify(APP.store.getState()["features/base/conference"].conference?.connectionQuality?._localStats)
  }))
}

function getUserData() {
  const state = APP.store.getState();
  const userData = state['features/riff-metrics'].userData;
  const jitsiId = state["features/base/participants"][0].id;

  const obj = {};

  obj.timestamp = Date();
  obj.browser = get_browser_name();
  obj.href = location.href;
  obj.userData = JSON.stringify({ ...userData, jitsiId });
  obj.userAgent = navigator.userAgent;
  obj.networkStats = JSON.stringify(state["features/base/conference"].conference?.connectionQuality?._localStats);

  return obj;
}

function get_browser_name() {
  var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE', version: (tem[1] || '') };
  }
  if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR|Edge\/(\d+)/)
      if (tem != null) { return { name: 'Opera', version: tem[1] }; }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
  return `${M[0]}, ${M[1]}`;
}