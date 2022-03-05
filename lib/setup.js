
// Node.js core
const fs = require('fs').promises;
const os = require('os');
const path = require('path');

// External
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest')

async function run () {
  try {
    // Gather GitHub Actions inputs
    let version = core.getInput('version');

    let githubToken = core.getInput("github-token")

    if (!version) {
        core.info("No version provided. Getting the latest version from GitHub.")
        
        let octokit = new Octokit()
    
        if (githubToken) {
            octokit = github.getOctokit(githubToken)
        }
        const release = await octokit.rest.repos.getLatestRelease({
            owner: "raito-io",
            repo: "cli"
        })
        version = release.data.name
    }
    core.info(`Using version: ${version}`);
    core.setOutput('version', version);
  
    // Gather OS details
    const platform = mapOS(os.platform());
    const arch = mapArch(os.arch());
    core.info(`Finding assets for Raito CLI version ${version} on ${platform}/${arch}.`);


    let url = `https://github.com/raito-io/cli/releases/download/${version}/raito-${version.slice(1)}-${platform}_${arch}.tar.gz`
    
    // Download requested version
    auth = (githubToken) ? "token " + githubToken : null
    const pathToCLI = await downloadCLI(url, auth);
  
    // Add to path
    core.addPath(pathToCLI);
  } catch (error) {
    core.error(error);
    throw error;
  }
}

async function downloadCLI (url, auth) {
  core.info(`Downloading Raito CLI from ${url}`);
  const pathToCLITar = await tc.downloadTool(url, null, auth);
  
  core.info('Extracting Raito CLI tar.gz file');
  const pathToCLI = await tc.extractTar(pathToCLITar);
  core.info(`Raito CLI path is ${pathToCLI}.`);
  
  if (!pathToCLITar || !pathToCLI) {
    throw new Error(`Unable to download Raito from ${url}`);
  }
  
  return pathToCLI;
}


// arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
// return value in [amd64, 386, arm]
function mapArch (arch) {
  const mappings = {
    x32: '386',
    x64: 'amd64'
  };
  return mappings[arch] || arch;
}
  
// os in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
// return value in [darwin, linux, windows]
function mapOS (os) {
  const mappings = {
    win32: 'windows'
  };
  return mappings[os] || os;
}

module.exports = run;