#!/usr/bin/env bash
# Builds the website, commits the build and pushes to GitHub.
# Stops before committing or pushing anything if the build fails: otherwise the sources
# would reach GitHub with a stale build, and GitHub Pages would keep serving the old site.

# The paths below are relative to the repository root, where this script lives.
cd "$(dirname "$0")" || exit 1

# source "${HOME}"/.bashrc;
source ./.env;

# git init 

# > add remote repository
# git remote remove origin # remove remote 'origin' repository
#
# git remote add gitlab "git@gitlab.com:${GIT_USER_NAME}/${APP_NAME}.git"
#
# git remote add github "git@github.com:${GITHUB_NAMESPACE}/${APP_NAME}.git"
# git push --set-upstream github master # first push

git config --local user.name "$GIT_USER_NAME";
git config --local user.email "$GIT_USER_EMAIL";

#git config --local -l

# docusaurus clear

if ! npm run -w website build; then
    echo "❌ Website build failed: nothing was committed or pushed." >&2
    exit 1
fi

git add ./website/build
# `git commit` fails when there is nothing to commit (e.g. the build has not changed);
# that must not block pushing the commits made before running this script.
if ! git diff --cached --quiet || ! git diff --quiet; then
    git commit -a -m "run build script"
fi

ssh-add -D

ssh-add "${GITHUB_KEY_PATH}";
git push github

#ssh-add "${GITLAB_KEY_PATH}"
#git push gitlab --all

# docusaurus clear

# fetch remote branch:
# git branch -r
  #  github/HEAD -> github/master
  #  github/claude/cascading-cashback-contract-iTcpn
# git switch --track github/claude/cascading-cashback-contract-iTcpn