module.exports = {
    apps: [
      {
        name: "technotorial",
        script: "yarn",
        args: "start",
        instances: 1,
        exec_mode: "fork",
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  }