import { PlayCanvas, PlayCanvasConfig } from "./Playcanvas"; 

let authToken:string = 'lJHHrNEjN3klG93krjX3CrCa8SLIydWy';
let config:PlayCanvasConfig = {
    playcanvas              : {
        project_id              : 873503,
        name                    : "Ball Blast",
        scenes                  : [1334543],
        branch_id               : "cd24f9ce-7b7e-4124-a29a-a6e4f3f4d545",
        description             : "",
        preload_bundle          : true,
        version                 : "0.0.1",
        release_notes           : "",
        scripts_concatenate     : true, 
        scripts_sourcemaps      : false,
        scripts_minify          : true,
        optimize_scene_format   : true
    },
    csp                     : {
        "style-src"             : [
            "'self'",
            "'unsafe-inline'"
        ],
        "connect-src"       : [
            "'self'",
            "blob:",
            "data:",
            "https://www.google-analytics.com"
        ],
    },
    one_page                : {
        patch_xhr_out           : false,
        inline_game_scripts     : false,
        extern_files            : false,
    },
};

(async () => {
    let branches = await PlayCanvas.GetBranches(authToken, config.playcanvas.project_id, true);
    console.log(branches);
    console.log('done');
})();