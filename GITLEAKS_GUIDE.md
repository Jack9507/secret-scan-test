# Gitleaks Secret Scanning Guide

## Purpose
We use Gitleaks to detect and prevent secrets (tokens, API keys, passwords, private keys, connection strings) from entering our Git repository.

This is enforced through:
1. CI pipeline scanning (GitHub Actions)
2. Manual local scanning
3. Pre-commit hook checks (to prevent bad commits early)

---

## CI Scanning (GitHub Actions)

Use a pipeline job to scan on PRs and pushes to protected branches.

```yaml
name: Secret Scan (Gitleaks)

on:
  pull_request:
  push:
    branches: ["main", "develop"]

jobs:
  gitleaks-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Gitleaks full history scan
        run: |
          docker run --rm -v ${{ github.workspace }}:/repo \
            zricethezav/gitleaks:latest detect \
            --source /repo \
            --config /repo/.gitleaks.toml \
            --report-format sarif \
            --report-path /repo/gitleaks-report.sarif \
            -v || true

        - name: Upload GitLeaks sarif report
          uses: github/codeql-action/upload-sarif@v3
          with:
            sarif_file: gitleaks-report.sarif
```

### CI Outcome
- No findings: job passes
- Findings detected: job fails and blocks merge (recommended)

---

## Manual Local Scanning

### Install
- Windows: `choco install gitleaks` or download the binary from: https://github.com/gitleaks/gitleaks/releases
- macOS: `brew install gitleaks`
- Linux: 
  - Ubuntu/Debian: `sudo apt install gitleaks `
  - Fedora/RHEL: `sudo dnf install gitleaks`
  - Manual Downlaod (specific version): https://github.com/gitleaks/gitleaks/releases

### If downloaded binary then add it to your PATH variable before using it:

#### If using windows bash:
```
echo 'export PATH="$PATH:/c/Users/jk667839/Downloads/gitleaks_8.30.1_windows_x64"' >> ~/.bashrc
and to reload config:
source ~/.bashrc
```
#### NOTE: update you gitleaks binary path in above command

#### If using Linux
```
tar -xzf gitleaks_8.30.1_linux_x64.tar.gz
sudo mv gitleaks /usr/local/bin/
```

Check:
```bash
gitleaks version
```

### Scan commands
- Full repo/history-style scan:
```bash
gitleaks detect --source . --verbose --redact
```

- Staged changes only:
```bash
gitleaks detect --source . --staged --verbose --redact
```

- Save JSON report:
```bash
gitleaks detect --source . --redact --report-format json --report-path gitleaks-report.json
```

---

### Via Docker (no install needed)
```
docker run --rm -v $(pwd):/repo \
  zricethezav/gitleaks:latest detect \
  --source /repo \
  --config /repo/.gitleaks.toml \
  -v --no-git
```

## Pre-commit Hook Protection

### Using pre-commit framework with custom config

- Install pre-commit and verify:
    ```
    pip install pre-commit
    pre-commit --version
    ```
- Create `.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.24.3
    hooks:
      - id: gitleaks
        args: ["--config", ".gitleaks.toml"]
```
## NOTE: create .gitleaks.toml at root of your github repo

Install hook scripts:
```bash
pre-commit install
```

Run manually:
```bash
pre-commit run --all-files
```

### How it works:
```
developer runs: git commit
                    ↓
          pre-commit hook fires
                    ↓
          gitleaks scans staged files
                    ↓
    secret found?  YES → commit blocked ❌
    secret found?  NO  → commit allowed ✅
```


## Recommended Standard

1. Keep `.gitleaks.toml` as single source of truth.
2. Use pre-commit hook locally for fast feedback.
3. Enforce in CI pipeline as backstop.
4. Block merges when secrets are detected.

---

## If a Secret Is Found

1. Treat as compromised.
2. Revoke/rotate immediately.
3. Remove from code.
4. If leaked in history, consider history rewrite (with team coordination).
5. Store secrets in secure secret managers, not in source code.
