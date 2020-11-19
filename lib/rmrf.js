module.exports = function (dir, cb, platform) {
/*
 * this function will async 'rm -rf' <dir> using os's native rm/rd command
 */
  // win32 - replace forward-slash with back-slash in <dir>
  dir = require('path').resolve(dir)
  // win32 - run 'rd /s /q <dir>'
  if ((platform || process.platform) === 'win32') {
    require('child_process').spawn((
      'rd /s /q ' +
      // quote <dir>, e.g. C:\Program Files\foo to "C:\\Program Files\\foo"
      JSON.stringify(dir)
    ), {
      // run inside cmd-shell, because rd is internal-shell-command
      shell: true,
      // ignore err EEXIST to stderr
      stdio: [
        'ignore', 1, 'ignore'
      ]
    }).on('error', cb).on('exit', cb.bind(undefined, undefined))
    return
  }
  // posix - run 'rm -rf <dir>'
  require('child_process').spawn('rm', [
    '-rf', dir
  ], {
    stdio: [
      'ignore', 1, 2
    ]
  }).on('error', cb).on('exit', cb.bind(undefined, undefined))
}
