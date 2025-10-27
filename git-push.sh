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

#docusaurus clear

#npm run-script build && git add ./build && git commit -a -m "run build script"

npm run -w website build && git add ./website/build && git commit -a -m "run build script"

ssh-add -D

ssh-add "${GITHUB_KEY_PATH}";
git push github

#ssh-add "${GITLAB_KEY_PATH}"
#git push gitlab --all

docusaurus clear
