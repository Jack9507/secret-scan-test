# To scan with docker

## docker pull zricethezav/gitleaks:latest
## docker run --rm -v $(pwd):/repo zricethezav/gitleaks:latest detect --source /repo --config /repo/.gitleaks.toml -v --no-git