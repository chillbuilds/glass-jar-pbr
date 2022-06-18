window.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('babylonCanvas')
    var engine = new BABYLON.Engine(canvas, false)

    function createScene() {
        var scene = new BABYLON.Scene(engine)

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene)
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene)
        skyboxMaterial.backFaceCulling = false
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/env/environment.env', scene)
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
        skybox.material = skyboxMaterial
        skybox.position.x = -200
        skybox.Zoffset = 200

        // scene.environmentTexture = '../assets/env/small-studio-2k.env'
        scene.createDefaultEnvironment({
            environmentTexture: '../assets/env/environment.env',
            createSkybox: false,
            // setMainColor: new BABYLON.Color3.White()
        })

        scene.clearColor = new BABYLON.Color3(1, 1, 1)
        var box = BABYLON.Mesh.CreateBox("Box", 4, scene)
        box.position.y = 20
        var camera = new BABYLON.ArcRotateCamera("arcCamera1",
            BABYLON.Tools.ToRadians(45),
            BABYLON.Tools.ToRadians(45),
            10.0, new BABYLON.Vector3.Zero(), scene)
        box.setEnabled(false)
        camera.attachControl(canvas, true)

        // pbr setup
        var glassPBR = new BABYLON.PBRMaterial('glass', scene)
        // glassPBR.reflectionTexture = '../assets/env/small-studio-2k.env'
        glassPBR.indexOfRefraction = 0.2
        glassPBR.alpha = 0.2
        glassPBR.directIntensity = 0.5
        glassPBR.environmentIntensity = 0.2
        glassPBR.cameraExposure = 0.66
        glassPBR.cameraContrast = 1.66
        glassPBR.microSurface = .8
        glassPBR.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2)
        glassPBR.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95)

        var waxPBR = new BABYLON.PBRMetallicRoughnessMaterial('pbr', scene)
        waxPBR.diffuseColor = new BABYLON.Color3.White()
        waxPBR.specularColor = new BABYLON.Color3.White()
        waxPBR.metallic = 0.1
        waxPBR.roughness = 0.5
        waxPBR.baseColor = new BABYLON.Color3(.7,0.6,0.5)
        // pbr.environmentTexture = '../assets/env/environment.env'
        // pbr.baseTexture = new BABYLON.Texture('../assets/images/marble.jpg')

        var wickPBR = new BABYLON.PBRMetallicRoughnessMaterial('pbr', scene)
        wickPBR.diffuseColor = new BABYLON.Color3.White()
        wickPBR.specularColor = new BABYLON.Color3.White()
        wickPBR.metallic = 0.1
        wickPBR.roughness = 0.5
        wickPBR.baseColor = new BABYLON.Color3.Black()

        // point light setup
        var pl1 = new BABYLON.PointLight('pl1', new BABYLON.Vector3(box.position.x, box.position.y-20, box.position.z+50), scene)
        pl1.parent = camera
        pl1.intensity = 1000
        pl1.diffuse = new BABYLON.Color3(1,1,1)
        var pl2 = new BABYLON.PointLight('pl2', new BABYLON.Vector3(box.position.x, box.position.y-20, box.position.z-50), scene)
        pl2.parent = camera
        pl2.intensity = 1000
        pl1.diffuse = new BABYLON.Color3(1,1,1)
        
        BABYLON.SceneLoader.ImportMeshAsync('vessel', '../assets/models/candle/', 'vessel.obj').then((result)=>{
            var vessel = result.meshes[0]
            vessel.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            vessel.rotation.x = BABYLON.Tools.ToRadians(90)
            vessel.material = glassPBR
            camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 50
            camera.position = new BABYLON.Vector3(box.position.x + 15, box.position.y + 15, box.position.z + 15)
        })
        BABYLON.SceneLoader.ImportMeshAsync('wax', '../assets/models/candle/', 'wax.obj').then((result)=>{
            var wax = result.meshes[0]
            wax.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            wax.rotation.x = BABYLON.Tools.ToRadians(90)
            wax.material = waxPBR
        })
        BABYLON.SceneLoader.ImportMeshAsync('wick', '../assets/models/candle/', 'wick.obj').then((result)=>{
            var wick = result.meshes[0]
            wick.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            wick.rotation.x = BABYLON.Tools.ToRadians(90)
            wick.material = wickPBR
            wick.diffuseColor = new BABYLON.Color3(0,0,0)
        })

        function loadTable() {
            let dir = '../assets/models/table'
            let modelArr = ['leg-1', 'leg-2', 'leg-3', 'leg-4', 'screw-1', 'screw-2', 'screw-3', 'screw-4', 'leg-ring', 'table-ring', 'tabletop']
            for(const i of modelArr){
    
                // pbr setup
                var tablePBR = new BABYLON.PBRMetallicRoughnessMaterial('table', scene)
                tablePBR.metallic = 0.5
                tablePBR.roughness = 0.7

                var tabletopPBR = new BABYLON.PBRMetallicRoughnessMaterial('tabletop', scene)
                tabletopPBR.metallic = 1
                tabletopPBR.roughness = 1
                tabletopPBR.metallicRoughnessTexture = new BABYLON.Texture('../assets/images/marble.jpg', scene)
                
    
                BABYLON.SceneLoader.ImportMeshAsync(i, '../assets/models/table/', `${i}.obj`).then((result)=>{
                    var mesh = result.meshes[0]
                    mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
                    mesh.rotation.x = BABYLON.Tools.ToRadians(90)
                    // mesh.diffuseColor = new BABYLON.Color3(0,0,0)
                    if(i == 'leg-1' || i == 'leg-2' || i == 'leg-3' || i == 'leg-4' || i == 'leg-ring' || i == 'table-ring' ){
                        mesh.material = tablePBR
                    }
                    if(i == 'screw-1' || i == 'screw-2' || i == 'screw-3' || i == 'screw-4' ){
                        mesh.material = tablePBR
                    }
                    if(i == 'tabletop'){
                        mesh.material = tabletopPBR
                    }
                })
            }
        }

        loadTable()

        return scene
    }

    var scene = createScene()

    engine.runRenderLoop(function(){
        scene.render()
    })
})