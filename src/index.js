const core = require('@actions/core')

const setup = require('./setup')

;(async () => {
  try {
    await setup()
  } catch (error) {
    core.setFailed(error.message)
  }
})()
