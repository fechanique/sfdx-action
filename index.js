const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('child_process').exec
const fs = require('fs')

try {
  installSFDX(()=>{
    createAuthFile(()=>{
      authSFDX()
    })
  })
} catch (error) {
  core.setFailed(error.message)
}

function installSFDX(next){
  var download = 'wget https://developer.salesforce.com/media/salesforce-cli/sfdx-linux-amd64.tar.xz'
  var createDir = 'mkdir sfdx'
  var unzip = 'tar xJf sfdx-linux-amd64.tar.xz -C sfdx --strip-components 1'
  var install = './sfdx/install'
  exec(download+' && '+createDir+' && '+unzip+' && '+install, function(error, stdout, stderr){
    if(error) throw(stderr)
    next()
  })
}

function createAuthFile(next){
  fs.writeFile('./sfdx_auth.txt', core.getInput('sfdx-auth-url'), function (error, data){
    if(error) throw(stderr)
    next()
  })
}

function authSFDX(){
  exec('sfdx force:auth:sfdxurl:store -f ./sfdx_auth.txt --setdefaultusername -a SFDX-ENV', function(error, stdout, stderr){
    if(error) throw(stderr)
  })
}
