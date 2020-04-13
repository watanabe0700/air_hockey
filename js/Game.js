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
        _asset[4].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[4], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_upper_left", "./babylon_file/", "table_upper_left.babylon", scene, function (newMeshes) {
        _asset[5] = newMeshes[0];
        _asset[5].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[5], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_upper_right", "./babylon_file/", "table_upper_right.babylon", scene, function (newMeshes) {
        _asset[6] = newMeshes[0];
        _asset[6].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[6], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_right", "./babylon_file/", "table_right.babylon", scene, function (newMeshes) {
        _asset[7] = newMeshes[0];
        _asset[7].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[7], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_lower_right", "./babylon_file/", "table_lower_right.babylon", scene, function (newMeshes) {
        _asset[8] = newMeshes[0];
        _asset[8].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[8], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_lower_left", "./babylon_file/", "table_lower_left.babylon", scene, function (newMeshes) {
        _asset[9] = newMeshes[0];
        _asset[9].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[9], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_left", "./babylon_file/", "table_left.babylon", scene, function (newMeshes) {
        _asset[10] = newMeshes[0];
        _asset[10].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[10], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    });


    BABYLON.SceneLoader.ImportMesh("pack", "./babylon_file/", "pack.babylon", scene, function (newMeshes) {
        _asset[1] = newMeshes[0];
        _asset[1].position = new BABYLON.Vector3(0, 0, 0.5);
        _asset[1].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[1], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, restitution: 1 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("mallet", "./babylon_file/", "mallet.babylon", scene, function (newMeshes) {
        _asset[2] = newMeshes[0];
        _initAsset2Position(_asset);
        document.addEventListener('mousemove', function() {
            // plane world position from mouse screen position
            
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

            // set mouse position area
            if (mousePos2.x < -0.45) {
                mousePos2.x = -0.45;
            } else if (mousePos2.x > 0.45) {
                mousePos2.x = 0.45;
            }

            if (mousePos2.z < -0.95) {
                mousePos2.z = -0.95;
            } else if(mousePos2.z > -0.05) {
                mousePos2.z = -0.05;
            }
            
            // currently, player's mallet fly
            _asset[2].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[2], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);

            _asset[2].position = mousePos2;

        }, false);
    });

    BABYLON.SceneLoader.ImportMesh("mallet2", "./babylon_file/", "mallet2.babylon", scene, function (newMeshes) {
        _asset[3] = newMeshes[0];
        _initAsset3Position(_asset);
        // currently, Game AI's mallet pass over the pack
        _asset[3].physicsImpostor = new BABYLON.PhysicsImpostor(_asset[3], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3.0, restitution: 1 }, scene);

        // Game AI will grow
        setInterval(function(){
            if(_asset[3].position.z > 0.05) {
                _asset[3].position.z -= 0.05;
            }
        },100)
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
