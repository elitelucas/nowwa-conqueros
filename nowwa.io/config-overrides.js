const path = require('path');

module.exports = {
    paths: function (paths, env) {
        paths.appIndexJs = path.resolve(__dirname, 'src/Newpages/index.js');
        paths.appSrc = path.resolve(__dirname, 'src/Newpages');
        paths.appPublic = path.resolve(__dirname, 'storage');
        paths.appHtml = path.resolve(__dirname, 'storage/Index.html');
        return paths;
    },
}