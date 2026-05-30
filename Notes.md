# To scan with docker

## docker pull zricethezav/gitleaks:latest
## docker run --rm -v $(pwd):/repo zricethezav/gitleaks:latest detect --source /repo --config /repo/.gitleaks.toml -v --no-git



Removing secret from git history:
1. pip install git-filter-repo
2. verify: git-filter-repo --help
3. now create a file and keep all flagged secrets in old commits in it with text you want to replace them with (refer expression.txt)
4. run: git filter-repo --replace-text .\expression.txt   (use --force if any issues)
5. above command will remove the origin remote from local branch, we will add it again
6.  git remote add origin https://github.com/Jack9507/secret-scan-test.git
7.  git push origin main --force
8.  




-------- For dangling commits:

# anyone can do this after cloning
git fsck --unreachable | grep commit    # find dangling commits
git show e3a7050                        # read the secret

# permanently delete all dangling objects
git gc --prune=now --aggressive

# Step 1: expire all reflog entries
git reflog expire --expire=now --all

How to Actually Remove Dangling Commits
bash# Step 1: expire all reflog entries (reflog keeps dangling commits alive)
git reflog expire --expire=now --all

# Step 2: garbage collect - permanently deletes unreachable objects
git gc --prune=now --aggressive

# Step 3: force push
git push origin main --force