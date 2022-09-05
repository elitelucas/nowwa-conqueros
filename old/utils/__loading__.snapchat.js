var startLoadingTime    = Date.now();
var engineLoadedTime    = Date.now();
var assetsLoadedTime    = Date.now();
var loadingErrors       = [];


var FBInstant;

if( FBInstant ) 
{
    FBInstant.initializeAsync().then( doCreate );
} else if (GCInstantWrapper) {
    GCInstantWrapper.initializeAsync().then ( doCreate );
} else {
    doCreate();
}
 
function doCreate()
{
    if ( pc.app.startPC ) pc.app.startPC();
    
    var assets;

    pc.script.createLoadingScreen(function (app) 
    {
        startLoadingTime = Date.now();
        loadingErrors = [];

        var showSplash = function() 
        {
            // splash wrapper
            var wrapper = document.createElement('div');
            wrapper.id  = 'application-splash-wrapper';
            
            document.body.appendChild(wrapper);

            // splash
            var splash  = document.createElement('div');
            splash.id   = 'application-splash';
            
            wrapper.appendChild(splash);
    
            splash.style.display = 'block';
            
            var container = document.createElement('div');
            container.id  = 'progress-bar-container';
            
            splash.appendChild(container);

            var bar     = document.createElement('div');
            bar.id      = 'progress-bar';

            container.appendChild( bar );
        };

        var hideSplash = function() 
        {
            app.off( "LOADSCENE:onShow", hideSplash );

            var splash = document.getElementById('application-splash-wrapper');
            splash.parentElement.removeChild( splash );
    
        };

        var setProgress = function( value ) 
        {
            value = Math.min(1, Math.max(0, value));
            var bar = document.getElementById('progress-bar');

            var percent = value * 100;
            
            if( bar ) bar.style.width = percent + '%';

            //console.log("preload:progress", percent );
    
            try {
            if( sc ) sc.setLoadingProgress(value);
            } catch (e) {
                
            }
            
            try {
            if( FBInstant ) FBInstant.setLoadingProgress( percent );
            } catch (e) {
            }
            
            
        };

        var createCss = function () {
            var css = [
                'body {',
                '    background-color: #02206d;',
                '}',

                '#application-splash-wrapper {',
                '    position: absolute;',
                '    top: 0;',
                '    left: 0;',
                '    height: 100%;',
                '    width: 100%;',
                '    background-color: #02206d;',
                '}',

                '#application-splash {',
                '    position: absolute;',
                '    top: calc(50% - 50px);',
                '    width: 264px;',
                '    left: calc(50% - 132px);',
                '}',

                '#application-splash img {',
                '    width: 100%;',
                '}',

                '#progress-bar-container {',
                '    margin: 20px auto 0 auto;',
                '    height: 2px;',
                '    width: 100%;',
                '    background-color: #000000;',
                '}',

                '#progress-bar {',
                '    width: 0%;',
                '    height: 100%;',
                '    background-color: #f60;',
                '}',
                '@media (max-width: 480px) {',
                '    #application-splash {',
                '        width: 170px;',
                '        left: calc(50% - 85px);',
                '    }',
                '}'
            ].join("\n");

            var style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
            style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            document.head.appendChild(style);
        };
    
        createCss();

        showSplash();


        // --- get assets loading errors
        
        const onAssetError = function (err, asset) {
            app.fire('preload:progress:' + asset.id);
            loadingErrors.push(asset.name);
        };
 
        app.once("preload:start", function() 
        {
        // if( app.startPC ) app.startPC();
    
            assets = app.assets.list({
                preload: true
            });

            for (let i = 0; i < assets.length; i++) {
                const asset = assets[i];
                if (!asset.loaded) {
                    asset.once('error', onAssetError);
                }
            }

            engineLoadedTime = Date.now();
        });

        app.on( 'preload:end', function () 
        {
            //console.log("preload:end" );

            if( assets )
            {
                // --- clean up listeners
                for (let i = 0; i < assets.length; i++) {
                    const asset = assets[i];
                    if (!asset.loaded) {
                        asset.off('error', onAssetError);
                    }
                }
            }
 
            assetsLoadedTime = Date.now();
    
        });
    
        app.on('preload:progress', setProgress );
        app.once("LOADSCENE:onShow", hideSplash );
    });

}