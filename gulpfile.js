const {src, dest, watch} = require('gulp');

const wp='wp5latest';

function copyLocalizedResources() {
<<<<<<< HEAD
    return src(`../${wp}/src/webparts/**/loc/*.d.ts`)
=======
    return src('../mywp1latest/src/webparts/**/loc/*.d.ts')
>>>>>>> 3ea42f6c8f1544e298e7a2ef975391febfeeda46
    .pipe(dest('./src/webparts'));
}

function triggerTargetWebPartReload() {
    //return src('../spfx/src/index.ts')
<<<<<<< HEAD
    return src(`../${wp}/src/webparts/helloWorld/HelloWorldWebPart.ts`)
    .pipe(dest(`../${wp}/src/webparts/helloWorld`))
=======
    return src('../mywp1latest/src/webparts/helloWorld/HelloWorldWebPart.ts')
    .pipe(dest('../mywp1latest/src/webparts/helloWorld'))
>>>>>>> 3ea42f6c8f1544e298e7a2ef975391febfeeda46
}

exports['copy-loc'] = copyLocalizedResources;

exports.watch = function() {
<<<<<<< HEAD
    watch(`../${wp}/src/webparts/**/loc/*.d.ts`, {
=======
    watch('../mywp1latest/src/webparts/**/loc/*.d.ts', {
>>>>>>> 3ea42f6c8f1544e298e7a2ef975391febfeeda46
        ignoreInitial: false
    }, copyLocalizedResources);

    watch('./dist/*.js', triggerTargetWebPartReload);

}
