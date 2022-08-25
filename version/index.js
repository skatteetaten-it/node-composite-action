const core = require("@actions/core");
const github = require("@actions/github");

function findMatch(ref, searchParam) {
  let match = ref.match(searchParam);
  return match.length == 0 ? null : match[1];
}

function run() {
  let ref = github.context.ref;
  const type = core.getInput("type", { required: true });
  let version;
  if (type == "release") {
    version = findMatch(ref, "refs/tags/(.*)");
  } else if (type == "branch") {
    version = findMatch(ref, "refs/heads/(.*)");
  } else {
    core.setFailed("Invalid type: " + type + " (type is: branch, release)");
    return;
  }

  if (!version) {
    core.setFailed("Could not find version: " + type + " (ref: " + ref + ")");
  }
  version = version.replace(/\//g, "-");
  version = version.replace(/_/g, "-");
  console.log(`Version is: ${version}`);

  core.setOutput(
    "dockerversion",
    type == "branch" ? version + "-" + github.context.runNumber : version
  );
  core.setOutput(
    "npmversion",
    type == "branch"
      ? "0.0.1-" + version + "-" + github.context.runNumber
      : version
  );
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
