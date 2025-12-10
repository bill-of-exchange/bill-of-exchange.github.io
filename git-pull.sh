# source "${HOME}"/.bashrc;
source ./.env;

git config --local user.name "$GIT_USER_NAME";
git config --local user.email "$GIT_USER_EMAIL";

ssh-add -D

ssh-add "${GITHUB_KEY_PATH}";
git pull