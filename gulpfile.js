const {src, dest, watch} = require('gulp');

const wp='wp5latest';

function copyLocalizedResources() {
    return src(`../${wp}/src/webparts/**/loc/*.d.ts`)
    .pipe(dest('./src/webparts'));
}

function triggerTargetWebPartReload() {
    //return src('../spfx/src/index.ts')
    return src(`../${wp}/src/webparts/helloWorld/HelloWorldWebPart.ts`)
    .pipe(dest(`../${wp}/src/webparts/helloWorld`))
}

exports['copy-loc'] = copyLocalizedResources;

exports.watch = function() {
    watch(`../${wp}/src/webparts/**/loc/*.d.ts`, {
        ignoreInitial: false
    }, copyLocalizedResources);

    watch('./dist/*.js', triggerTargetWebPartReload);

}
