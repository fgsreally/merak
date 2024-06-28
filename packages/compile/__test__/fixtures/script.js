/* eslint-disable vars-on-top */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable one-var */
/* eslint-disable no-var */

function output() {
  console.log(x, y, z)
}

const x = 1, y = 2

var z = () => {
  const d = 4

  function log() {
    console.log(d)
  }
  log()
}

console.log(x, y, z)
output()
