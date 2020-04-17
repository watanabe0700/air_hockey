window.addEventListener("DOMContentLoaded", function() {
    new Game("gameCanvas");
}, false);

var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    this.engine = new BABYLON.Engine(canvas, true);
    this.engine.enableOfflineSupport = false;
    this.asset = [null, null, null, null, null, null, null, null, null, null, null];

    this.scene = this._initScene(this.engine, this.asset);
    
    this._initGame();

    var _this = this;

    this.scene.registerBeforeRender(function() {
        _this.checkCollisions();
    });

    this.engine.runRenderLoop(function () {
        _this.scene.render();
    });
};

Game.prototype._initScene = function(engine, _asset) {
    var scene = new BABYLON.Scene(engine);
    
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,2.5,-1.5), scene);
    camera.rotation.x = 45;
    //camera.attachControl(engine.getRenderingCanvas());

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,10,0), scene);
    light.intensity = 0.7;
    
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81,0), new BABYLON.CannonJSPlugin());

    BABYLON.SceneLoader.ImportMesh("table_bottom", "./babylon_file/", "table_bottom.babylon", scene, function (newMeshes) {
        _asset[4] = newMeshes[0];
        _asset[4].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[4], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_upper_left", "./babylon_file/", "table_upper_left.babylon", scene, function (newMeshes) {
        _asset[5] = newMeshes[0];
        _asset[5].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[5], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_upper_right", "./babylon_file/", "table_upper_right.babylon", scene, function (newMeshes) {
        _asset[6] = newMeshes[0];
        _asset[6].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[6], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_right", "./babylon_file/", "table_right.babylon", scene, function (newMeshes) {
        _asset[7] = newMeshes[0];
        _asset[7].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[7], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_lower_right", "./babylon_file/", "table_lower_right.babylon", scene, function (newMeshes) {
        _asset[8] = newMeshes[0];
        _asset[8].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[8], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_lower_left", "./babylon_file/", "table_lower_left.babylon", scene, function (newMeshes) {
        _asset[9] = newMeshes[0];
        _asset[9].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[9], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_left", "./babylon_file/", "table_left.babylon", scene, function (newMeshes) {
        _asset[10] = newMeshes[0];
        _asset[10].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[10], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });


    BABYLON.SceneLoader.ImportMesh("pack", "./babylon_file/", "pack.babylon", scene, function (newMeshes) {
        _asset[1] = newMeshes[0];
        _asset[1].position = new BABYLON.Vector3(0, 0, -0.5);
        _asset[1].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[1], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, restitution: 0, friction: 0 }, scene);

        setInterval(function(){
            _asset[1].rotation = new BABYLON.Vector3(0, 0, 0);
            _asset[1].position.y = 0;
        },100);
    });

    BABYLON.SceneLoader.ImportMesh("mallet", "./babylon_file/", "mallet.babylon", scene, function (newMeshes) {
        _asset[2] = newMeshes[0];
        _initAsset2Position(_asset);
        _asset[2].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[2], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0, friction: 10}, scene);
        var playerPos = new BABYLON.Vector3(0.0, 0.0, -0.95);
        document.addEventListener('mousemove', function() {
            // マウススクリーン座標をワールド座標に変換し、平面ワールド座標に変換する
            
            var mousePos = BABYLON.Vector3.Unproject(
                new BABYLON.Vector3(scene.pointerX, scene.pointerY, 0.0),
                engine.getRenderWidth(),
                engine.getRenderHeight(),
                BABYLON.Matrix.Identity(),
                scene.getViewMatrix(),
                scene.getProjectionMatrix()
            );
            
            var farPos = BABYLON.Vector3.Unproject(
                new BABYLON.Vector3(scene.pointerX, scene.pointerY, 1.0),
                engine.getRenderWidth(),
                engine.getRenderHeight(),
                BABYLON.Matrix.Identity(),
                scene.getViewMatrix(),
                scene.getProjectionMatrix()
            );
            
            var ray = new BABYLON.Vector3(farPos.x - mousePos.x, farPos.y - mousePos.y, farPos.z - mousePos.z);
            ray = ray.normalize();

            var dot1 = BABYLON.Vector3.Dot(ray, new BABYLON.Vector3(0, 1, 0));
            var dot2 = BABYLON.Vector3.Dot(new BABYLON.Vector3(-mousePos.x, -mousePos.y, -mousePos.z), new BABYLON.Vector3(0, 1, 0));

            var d = (dot2/dot1);
            var ray2 = new BABYLON.Vector3(ray.x * d, ray.y * d, ray.z * d);
            var mousePos2 = new BABYLON.Vector3(mousePos.x + ray2.x, mousePos.y + ray2.y, mousePos.z + ray2.z);

            // マウス範囲を設定
            if (mousePos2.x < -0.45) {
                mousePos2.x = -0.45;
            } else if (mousePos2.x > 0.45) {
                mousePos2.x = 0.45;
            }

            if (mousePos2.z < -0.95) {
                mousePos2.z = -0.95;
            } else if(mousePos2.z > -0.06) {
                mousePos2.z = -0.06;
            }
            
            
            _asset[2].position = mousePos2;
            playerPos = mousePos2;
            //_asset[2].rotation = BABYLON.Vector3.RotationFromAxis(0, 0, 0);
        }, false);
        
        setInterval(function(){
            _asset[2].position = playerPos;
        },1);
    });

    BABYLON.SceneLoader.ImportMesh("mallet2", "./babylon_file/", "mallet2.babylon", scene, function (newMeshes) {
        _asset[3] = newMeshes[0];
        _initAsset3Position(_asset);
        var gameAiPos = new BABYLON.Vector3(0.0, 0.0, 0.95);
        _asset[3].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[3], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0, friction: 10 }, scene);

        setInterval(function(){
            _asset[3].position = gameAiPos;
        },1);
        
        var exec_game_ai = false;

        // ゲームAI実装部分
        var run_game_ai = setInterval(function(){
            if (_asset[1] != null && exec_game_ai == false) {
                if (_asset[1].position.z > 0.08) {
                    exec_game_ai = true;
                    clearInterval(run_game_ai);

                    var pack_pnt1 = _asset[1].position;
                    var pack_pnt2;
                    setTimeout(function(){
                        pack_pnt2 = _asset[1].position;

                        // （ほぼ）停止 OR 迫る OR 遠のく
                        if (Math.abs(pack_pnt2.z - pack_pnt1.z) < 0.001) {
                            
                        } else if(pack_pnt2.z > pack_pnt1.z) {
                            
                        } else {
                            
                        }
                    }, 200);
                }
            }
        },200);
    });

    return scene;
};

var _initAsset2Position = function(_asset) {
    _asset[2].position = new BABYLON.Vector3(0.0, 0.0, -0.95);
};
var _initAsset3Position = function(_asset) {
    _asset[3].position = new BABYLON.Vector3(0.0, 0.0, 0.95);// X 0.45
};

Game.prototype._initGame = function() {
    this.playerScore = 0;
    this.comScore = 0;

    

    
    this.scene.debugLayer.show();
};


Game.prototype.checkCollisions = function(_this) {
    //if (_this.box.intersectsMesh(_this.otherMesh, true)) {
        
    //}
};

// 2点間の距離を返す
function distance(pnt1, pnt2) {
    return Math.sqrt((Math.pow(pnt2.x - pnt1.x, 2) + Math.pow(pnt2.z - pnt1.z, 2)));
}

// 2点間からの角度を返す
function pnt2_radian(pnt1, pnt2) {
    return Math.atan2((pnt2.z - pnt1.z), (pnt2.x - pnt1.x));
}

