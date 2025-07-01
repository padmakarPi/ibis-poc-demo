const fs = require('fs')
const path = require('path')


const corePackages = ['next', 'react', 'react-dom']

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"))

const peerDependencies = pkg.peerDependencies || {}

const violation = []

for (const core of corePackages) {
    if (peerDependencies[core]){
        violation.push(`❌ '${core}' should not be listed under 'peerDependencies'. Move it to 'dependencies' or 'devDependencies'.`)
    }
}

if (violation.length >0){
    console.error(violation.join('\n'))
    process.exit(1)
}
else{
    console.log("✅ Core dependencies check passed.");
}

