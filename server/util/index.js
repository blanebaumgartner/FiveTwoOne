function svrmsg(text, type = 'info') {
  console.log('[' + type.toUpperCase() + '] ' + text);
}

function svrerr(text, error) {
  console.log('[ERROR] ' + text + ' ', error);
}

module.exports = { svrmsg, svrerr };