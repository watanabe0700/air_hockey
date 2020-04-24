window.addEventListener("DOMContentLoaded", function() {
    new Game("gameCanvas");
}, false);

var run_game_ai = null;
var gameAiPos = null;

var playerScore = 0;
var gameAiScore = 0;
var scoreboard_texture = null;

var first_flag = true;

asset = [null, null, null, null, null, null, null, null, null, null, null, null, null];

var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    this.engine = new BABYLON.Engine(canvas, true);
    this.engine.enableOfflineSupport = false;

    this.scene = this._initScene(this.engine, this);

    //ダブルクリックしたら、パックの位置を初期化
    canvas.addEventListener('dblclick',function(e) {
        if (asset[1] != null) {
            asset[1].physicsImpostor = null;
            asset[1].position = new BABYLON.Vector3(0, 0, -0.5);
            asset[1].physicsImpostor = new BABYLON.PhysicsImpostor(asset[1], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, restitution: 0, friction: 0 }, this.scene);
        }
    });

    var _this = this;

    this.engine.runRenderLoop(function () {
        $("#score_div").text("You:" + playerScore + "  Game AI:" + gameAiScore);
        
        _this.scene.render();
    });
};

Game.prototype._initScene = function(engine, _this) {
    var scene = new BABYLON.Scene(engine);
    
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,2.5,-1.5), scene);
    camera.rotation.x = 45;

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,10,0), scene);
    light.intensity = 0.7;
    
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81,0), new BABYLON.CannonJSPlugin());

    BABYLON.SceneLoader.ImportMesh("table_bottom", "./babylon_file/", "table_bottom.babylon", scene, function (newMeshes) {
        asset[4] = newMeshes[0];
        asset[4].physicsImpostor = new BABYLON.PhysicsImpostor(asset[4], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_upper_left", "./babylon_file/", "table_upper_left.babylon", scene, function (newMeshes) {
        asset[5] = newMeshes[0];
        asset[5].physicsImpostor = new BABYLON.PhysicsImpostor(asset[5], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_upper_right", "./babylon_file/", "table_upper_right.babylon", scene, function (newMeshes) {
        asset[6] = newMeshes[0];
        asset[6].physicsImpostor = new BABYLON.PhysicsImpostor(asset[6], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_right", "./babylon_file/", "table_right.babylon", scene, function (newMeshes) {
        asset[7] = newMeshes[0];
        asset[7].physicsImpostor = new BABYLON.PhysicsImpostor(asset[7], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_lower_right", "./babylon_file/", "table_lower_right.babylon", scene, function (newMeshes) {
        asset[8] = newMeshes[0];
        asset[8].physicsImpostor = new BABYLON.PhysicsImpostor(asset[8], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_lower_left", "./babylon_file/", "table_lower_left.babylon", scene, function (newMeshes) {
        asset[9] = newMeshes[0];
        asset[9].physicsImpostor = new BABYLON.PhysicsImpostor(asset[9], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });

    BABYLON.SceneLoader.ImportMesh("table_left", "./babylon_file/", "table_left.babylon", scene, function (newMeshes) {
        asset[10] = newMeshes[0];
        asset[10].physicsImpostor = new BABYLON.PhysicsImpostor(asset[10], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, scene);
    });


    BABYLON.SceneLoader.ImportMesh("player_lost_point", "./babylon_file/", "player_lost_point.babylon", scene, function (newMeshes) {
        asset[11] = newMeshes[0];
        var material = new BABYLON.StandardMaterial("player_lost_point_Material", scene);
        material.diffuseColor = new BABYLON.Color3(1,1,1);
        material.alpha = 0;
        asset[11].material = material;
    });

    BABYLON.SceneLoader.ImportMesh("game_ai_lost_point", "./babylon_file/", "game_ai_lost_point.babylon", scene, function (newMeshes) {
        asset[12] = newMeshes[0];
        var material = new BABYLON.StandardMaterial("game_ai_lost_point_Material", scene);
        material.diffuseColor = new BABYLON.Color3(1,1,1);
        material.alpha = 0;
        asset[12].material = material;
    });


    BABYLON.SceneLoader.ImportMesh("pack", "./babylon_file/", "pack.babylon", scene, function (newMeshes) {
        asset[1] = newMeshes[0];
        asset[1].position = new BABYLON.Vector3(0, 0, -0.5);
        asset[1].physicsImpostor = new BABYLON.PhysicsImpostor(asset[1], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, restitution: 0, friction: 0 }, scene);

        setInterval(function(){
            asset[1].rotation = new BABYLON.Vector3(0, 0, 0);
            asset[1].position.y = 0;
            if(asset[11] != null && asset[12] != null) {
                if (asset[1].intersectsMesh(asset[11], true)) {

                    console.log("Game AI +1");
                    gameAiScore++;

                    asset[1].physicsImpostor = null;
                    asset[1] = newMeshes[0];
                    asset[1].position = new BABYLON.Vector3(0, 0, -0.5);
                    asset[1].physicsImpostor = new BABYLON.PhysicsImpostor(asset[1], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, restitution: 0, friction: 0 }, scene);

                    if (playerScore + gameAiScore >= 3) {
                        judgement();
                    }
                }
                else if (asset[1].intersectsMesh(asset[12], true)) {

                    console.log("Player +1");
                    playerScore++;

                    asset[1].physicsImpostor = null;
                    asset[1] = newMeshes[0];
                    asset[1].position = new BABYLON.Vector3(0, 0, -0.5);
                    asset[1].physicsImpostor = new BABYLON.PhysicsImpostor(asset[1], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, restitution: 0, friction: 0 }, scene);

                    if (playerScore + gameAiScore >= 3) {
                        judgement();
                    }
                }
            }

            // パックの位置がテーブルの範囲を越えた場合
            if(!(asset[1].position.x >= -0.5 && asset[1].position.x <= 0.5) || !(asset[1].position.z >= -1.0 && asset[1].position.z <= 1.0) || !(asset[1].position.y >= -0.01 && asset[1].position.y <= 0.03)) {
                asset[1].physicsImpostor = null;
                asset[1] = newMeshes[0];
                asset[1].position = new BABYLON.Vector3(0, 0, -0.5);
                asset[1].physicsImpostor = new BABYLON.PhysicsImpostor(asset[1], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, restitution: 0, friction: 0 }, scene);
                console.log("The pack is out of range!");
            }

            // パックがゲームAI側で固まった場合
            var pack1Pos1 = asset[1].position;
            setTimeout(function(){
                var pack1Pos2 = asset[1].position;
                if(pack1Pos2.z > 0 && distance(pack1Pos1, pack1Pos2) < 0.005) {
                    asset[1].position = new BABYLON.Vector3(0, 0, 0.5);
                }
            }, 3000);
        },100);
    });

    BABYLON.SceneLoader.ImportMesh("mallet", "./babylon_file/", "mallet.babylon", scene, function (newMeshes) {
        asset[2] = newMeshes[0];
        _initAsset2Position(asset);
        asset[2].physicsImpostor = new BABYLON.PhysicsImpostor(asset[2], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0, friction: 10}, scene);
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
            
            
            asset[2].position = mousePos2;
            playerPos = mousePos2;
        }, false);
        
        setInterval(function(){
            asset[2].position = playerPos;
        },1);
    });

    BABYLON.SceneLoader.ImportMesh("mallet2", "./babylon_file/", "mallet2.babylon", scene, function (newMeshes) {
        asset[3] = newMeshes[0];
        _initAsset3Position(asset);
        gameAiPos = new BABYLON.Vector3(0.0, 0.0, 0.95);
        asset[3].physicsImpostor = new BABYLON.PhysicsImpostor(asset[3], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0, friction: 10 }, scene);

        setInterval(function(){
            asset[3].position = gameAiPos;
        },1);
        
        var exec_game_ai = false;

        // ゲームAI起動
        run_game_ai = setInterval(game_ai, 200, exec_game_ai);
    });

    return scene;
};

// ゲームAI実装部分
function game_ai(exec_game_ai) {
    if (asset[1] != null && exec_game_ai == false) {
        if (asset[1].position.z > 0.08) {
            exec_game_ai = true;
            clearInterval(run_game_ai);

            var pack_pnt1 = asset[1].position;
            var pack_pnt2;
            
            setTimeout(function(){
                pack_pnt2 = asset[1].position;
                
                // （ほぼ）停止 OR 迫る OR 遠ざかる
                if (distance(pack_pnt1, pack_pnt2) < 0.01) {// （ほぼ）停止
                    var new_pnt = pack_pnt2;
                    
                    new_pnt = game_ai_mallet_point(new_pnt);

                    // 打点位置までマレットを移動
                    var move_game_ai_mallet_cnt = 0;
                    var original_pos = asset[3].position;
                    var move_game_ai_mallet = setInterval(function(){
                        if (move_game_ai_mallet_cnt >= 6){
                            clearInterval(move_game_ai_mallet);
                            exec_game_ai = false;
                            run_game_ai = setInterval(game_ai, 200, exec_game_ai, asset);
                        } else {
                            var new_x = asset[3].position.x + (new_pnt.x - original_pos.x) * 0.16;
                            var new_z = asset[3].position.z + (new_pnt.z - original_pos.z) * 0.16;
                            asset[3].position = new BABYLON.Vector3(new_x, 0.0, new_z);
                            gameAiPos = asset[3].position;
                            move_game_ai_mallet_cnt++;
                        }
                    }, 100);
                } else if(pack_pnt2.z > pack_pnt1.z) {// 迫る
                    var dig = radian_to_degree(pnt2_radian(pack_pnt1, pack_pnt2));
                    var dig2 = 180 - dig;
                    var w_pnt1 = point_distance_degree_to_new_point(pack_pnt2, distance(pack_pnt1, pack_pnt2) * 3, dig);
                    var new_pnt = new BABYLON.Vector3(0.0, 0.0, 0.0);
                    if (w_pnt1.x < -0.45 || w_pnt1.x > 0.45) {// 壁に反射する場合
                        if(w_pnt1.x > 0) {
                            var i_pnt = intersection_point(pack_pnt2, w_pnt1, new BABYLON.Vector3(0.5, 0, 0), new BABYLON.Vector3(0.5, 0, 1.0));
                            new_pnt = point_distance_degree_to_new_point(i_pnt, distance(pack_pnt1, pack_pnt2) * 3 - distance(pack_pnt2, i_pnt), dig2);
                        } else {
                            var i_pnt = intersection_point(pack_pnt2, w_pnt1, new BABYLON.Vector3(-0.5, 0, 0), new BABYLON.Vector3(-0.5, 0, 1.0));
                            new_pnt = point_distance_degree_to_new_point(i_pnt, distance(pack_pnt1, pack_pnt2) * 3 - distance(pack_pnt2, i_pnt), dig2);
                        }
                    } else {// 壁に反射しない場合
                        new_pnt = w_pnt1;
                    }
                    new_pnt = game_ai_mallet_point(new_pnt);
                    
                    // 打点位置までマレットを移動
                    var move_game_ai_mallet_cnt = 0;
                    var original_pos = asset[3].position;
                    var move_game_ai_mallet = setInterval(function(){
                        if (move_game_ai_mallet_cnt >= 6){
                            clearInterval(move_game_ai_mallet);
                            
                            exec_game_ai = false;
                            run_game_ai = setInterval(game_ai, 200, exec_game_ai, asset);
                        } else {
                            var new_x = asset[3].position.x + (new_pnt.x - original_pos.x) * 0.16;
                            var new_z = asset[3].position.z + (new_pnt.z - original_pos.z) * 0.16;
                            asset[3].position = new BABYLON.Vector3(new_x, 0.0, new_z);
                            gameAiPos = asset[3].position;
                            move_game_ai_mallet_cnt++;
                        }
                    }, 100);
                } else {// 遠ざかる
                    exec_game_ai = false;
                    run_game_ai = setInterval(game_ai, 200, exec_game_ai, asset);
                }
            }, 200);
        }
    }
}

var _initAsset2Position = function() {
    asset[2].position = new BABYLON.Vector3(0.0, 0.0, -0.95);
};
var _initAsset3Position = function() {
    asset[3].position = new BABYLON.Vector3(0.0, 0.0, 0.95);// X 0.45
};

// 2点間の距離を返す
function distance(pnt1, pnt2) {
    return Math.sqrt((Math.pow(pnt2.x - pnt1.x, 2) + Math.pow(pnt2.z - pnt1.z, 2)));
}

// 2点間からの角度（ラジアン）を返す
function pnt2_radian(pnt1, pnt2) {
    return Math.atan2((pnt2.z - pnt1.z), (pnt2.x - pnt1.x));
}

// ラジアンから度に変換
function radian_to_degree(rad) {
    return rad * 180 / Math.PI;
}

// 度からラジアンに変換
function degree_to_radian(d) {
    return d * Math.PI / 180;
}

// ある座標と距離と角度から座標を求める
function point_distance_degree_to_new_point(pnt, dis, deg) {
    var x2 = pnt.x + dis * Math.cos(degree_to_radian(deg));
    var z2 = pnt.z + dis * Math.sin(degree_to_radian(deg));
    var new_pnt = new BABYLON.Vector3(x2, 0, z2);
    return new_pnt;
}

// ゲームAI側マレットの位置調整
function game_ai_mallet_point(pnt) {
    if (pnt.x < -0.45) {
        pnt.x = -0.45;
    } else if (pnt.x > 0.45) {
        pnt.x = 0.45;
    }

    if (pnt.z > 0.95) {
        pnt.z = 0.95;
    } else if(pnt.z < 0.06) {
        pnt.z = 0.06;
    }

    return pnt;
}

// 2直線（4点）から交点を求める
function intersection_point(p1, p2, p3, p4) {
    var d0 = (p2.z - p1.z) * (p4.x - p3.x) - (p2.x - p1.x) * (p4.z - p3.z);
    var d1 = (p3.z * p4.x - p3.x * p4.z);
    var d2 = (p1.z * p2.x - p1.x * p2.z);
    
    var cp = new BABYLON.Vector3(0, 0, 0);
	cp.x = (d1 * (p2.x - p1.x) - d2 * (p4.x - p3.x)) / d0;
    cp.z = (d1 * (p2.z - p1.z) - d2 * (p4.z - p3.z)) / d0;

    return cp;
}

// クリックしてゲーム開始
function start(){
    if (first_flag == true) {
        first_flag = false;
    } else {
        playerScore = 0;
        gameAiScore = 0;
    }
    $("#start_end_outer").hide();
    $("#start_end_div").hide();
}

// 勝敗判定
function judgement() {
    if (playerScore > gameAiScore) {
        $("#start_end_div").text("You Win! Click to Restart");
    } else {
        $("#start_end_div").text("You Lose! Click to Restart");
    }

    $("#start_end_outer").show();
    $("#start_end_div").show();
}
