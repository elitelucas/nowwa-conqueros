// postprocess-suffix.js

rpw.init().then(function(){
    //console.log('================= rpw completed ================');
    pc.script.createLoadingScreen( function(app) 
    {
        console.log('createLoadingScreen');
        console.log('preload:start');
        if (typeof app.startPC != 'undefined') {
            app.startPC();
        }
        app.on('preload:end', function () 
        {
            console.log('preload:end');
            app.off('preload:progress');
        });

        app.on('preload:progress', function (value)
        {
            //console.log('================= preload:progress:' + value);
            rpw.SetLoadingProgress( value*100 );
        });

        app.on('start', function()
        {
            rpw.SetOnError(function(e){
                console.log('we got error');
                console.log(e);
            });
            rpw.start().then(function(){
                console.log('game is ready to be played');
            });
        });
    });
});