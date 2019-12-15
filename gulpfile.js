const {src, dest, watch} = require('gulp');

function copyLocalizedResources() {
    return src('../mywp1latest/src/webparts/**/loc/*.d.ts')
    .pipe(dest('./src/webparts'));
}

function triggerTargetWebPartReload() {
    //return src('../spfx/src/index.ts')
    return src('../mywp1latest/src/webparts/helloWorld/HelloWorldWebPart.ts')
    .pipe(dest('../mywp1latest/src/webparts/helloWorld'))
}

exports['copy-loc'] = copyLocalizedResources;

exports.watch = function() {
    watch('../mywp1latest/src/webparts/**/loc/*.d.ts', {
        ignoreInitial: false
    }, copyLocalizedResources);

    watch('./dist/*.js', triggerTargetWebPartReload);

}
