docker run --rm -w "/builder" -v "${PWD}:/builder" heroiclabs/nakama-pluginbuilder:3.13.1 build -buildmode=plugin -trimpath -o ./plugin.so
mv ./plugin.so ../plugin.so