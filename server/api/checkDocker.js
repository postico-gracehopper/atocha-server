'use strict'
const router = require('express').Router()
const { spawn } = require("node:child_process");

function cmd(...command) {
    let p = spawn(command[0], command.slice(1));
    return new Promise((resolve, reject) => {
      p.stdout.on("data", (x) => {
        // process.stdout.write(x.toString());
        const arrayVersion = x.toString().trim().split('\n')
        resolve(arrayVersion.length > 1 ? arrayVersion : arrayVersion[0] )
      });
      p.stderr.on("data", (x) => {
        reject(x.toString())
      });
    });
}

async function cmdObj(...command) {
    return {[command.join(' ')]: await cmd(...command)}
}


router.get('/', async (req, res, next) => {
    let commands = [['ls'], ['pwd'], ['python3', '--version'], ['pip3', '--version']]
    const result = await Promise.all(commands.map(c => cmdObj(...c))).then((values) => {
        return values.reduce((acc, val) => Object.assign(acc, val), {})
    })
    res.json(result)
  })

module.exports = router
  