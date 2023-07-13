const { spawn } = require("child_process")
const { resolve } = require("path")

const scriptPath = resolve(__dirname, "startLavalink.sh")
const lavalinkPath = resolve(__dirname, "Lavalink.jar")
const javaPath = "/home/nedcloarbr/.sdkman/candidates/java/current/bin/java" // Replace with the full path to the Java executable
const bashPath = "/bin/bash" // Replace with the full path to the Bash executable

const child = spawn(bashPath, [scriptPath])

child.stdout.on("data", data => {
  console.log(`${data}`)
})

child.stderr.on("data", data => {
  console.error(`Error: ${data}`)
})

child.on("close", code => {
  console.log(`Exit code: ${code}`)
})
