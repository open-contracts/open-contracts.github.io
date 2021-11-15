# run and commit build in main
git submodule update --init --recursive
git submodule update --recursive --remote
yarn list react-scripts
yarn install
yarn run build
git rm -r build/client-protocol
rm -rf .git/modules/build/client-protocol
cp -r public/client-protocol build/client-protocol
rm -r build/client-protocol/.git
git add .
git commit -m "Built Page"
git push