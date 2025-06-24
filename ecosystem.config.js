module.exports = {
    apps: [
      {
        name: "technotorial",
        script: "yarn",
        args: "start",
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  }