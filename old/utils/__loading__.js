window.onload = () => {
    console.log('-- all scripts loaded! --');
    console.log('-- fbinstant initializing... --');

    FBInstant.initializeAsync().then( function()
    {

        if (app.startPC) {
            app.startPC();
        }

        console.log('-- fbinstant initialized! --');
        console.log('-- pc.script create loading... --');

        pc.script.createLoadingScreen( function(app) 
        {

            app.on('preload:end', function () 
            {
                console.log('-- app loading done! --');
                app.off('preload:progress');
            });

            app.on('preload:progress', function (value)
            {
                console.log('-- fbinstant loading progress... --');
                FBInstant.setLoadingProgress( value*100 )
            });

            app.on('start', function()
            {
                console.log('-- fbinstant starting... --');
                FBInstant.startGameAsync().then(function(){})
            });
            
        });

    });
};