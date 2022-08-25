const core = require("@actions/core");
const github = require("@actions/github");

function findMatch(ref, searchParam) {
  let match = ref.match(searchParam);
  return match.length == 0 ? null : match[1];
}

function run() {
  let ref = github.context.ref;
  const type = core.getInput("type", { required: true });
  let version = findMatch(ref, "refs/tags/(.*)");

  if (!version) {
    core.setFailed("Could not find version: " + type + " (ref: " + ref + ")");
  }

  var branch = findMatch(ref, "refs/heads/(.*)");
  branch = branch.replace(/\//g, "_");

  core.setOutput(
    "dockerversion",
    type == "branch" ? branch + "-" + github.context.runNumber : version
  );
  core.setOutput(
    "npmversion",
    type == "branch"
      ? version + "." + branch + "-" + github.context.runNumber
      : version
  );
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
