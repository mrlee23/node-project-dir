if [ -z "${GH_TOKEN}" ]; then "GH_TOKEN is not setted" 1>&2; fi
if [ -z "${REPO}" ]; then REPO=$(sed "s/https:\/\/github.com/https:\/\/${GH_TOKEN}@github.com/g" <<< $(git config remote.origin.url)); fi
if [ -z "${BUILD_BRANCH}" ]; then BUILD_BRANCH="gh-pages"; fi
if [ -z "${PUBLISHED_DIR}" ]; then PUBLISHED_DIR=".published"; fi
if [ -z "${COMMIT_MSG}" ]; then COMMIT_MSG=$(git log --oneline -n 1 --pretty="Deploy: %s from %h"); fi
git checkout --orphan $BUILD_BRANCH
git pull origin $BUILD_BRANCH
shopt -s extglob
rm -rf !(.git|$PUBLISHED_DIR)
mv -f "${PUBLISHED_DIR}"/* ./
git add ./
git commit -a -m "${COMMIT_MSG}"
test $? -eq "0" && git push $REPO $BUILD_BRANCH > /dev/null 2>&1
