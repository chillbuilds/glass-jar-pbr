window.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('babylonCanvas')
    var engine = new BABYLON.Engine(canvas, true)

    function createScene() {
        var scene = new BABYLON.Scene(engine)

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 200.0 }, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../assets/env/small-studio-2k.env', scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // scene.environmentTexture = '../assets/env/small-studio-2k.env'
        scene.createDefaultEnvironment({
            environmentTexture: '../assets/env/small-studio-2k.env',
            createSkybox: false,
            setMainColor: new BABYLON.Color3.White()
        })

        scene.clearColor = new BABYLON.Color3(1, 1, 1)
        var box = BABYLON.Mesh.CreateBox("Box", 4, scene)
        box.position.y = 5
        var camera = new BABYLON.ArcRotateCamera("arcCamera1",
            BABYLON.Tools.ToRadians(45),
            BABYLON.Tools.ToRadians(45),
            10.0, new BABYLON.Vector3.Zero(), scene)
        box.setEnabled(false)
        camera.attachControl(canvas, true)

        // pbr setup
        var glassPBR = new BABYLON.PBRMaterial('glass', scene)
        // glassPBR.reflectionTexture = '../assets/env/small-studio-2k.env'
        glassPBR.indexOfRefraction = 0.8
        glassPBR.alpha = 0.2
        glassPBR.directIntensity = 0.5
        glassPBR.environmentIntensity = 0.2
        glassPBR.cameraExposure = 0.66
        glassPBR.cameraContrast = 1.66
        glassPBR.microSurface = 1
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
        
        BABYLON.SceneLoader.ImportMeshAsync('vessel', '../assets/models/', 'vessel.obj').then((result)=>{
            var vessel = result.meshes[0]
            vessel.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            vessel.rotation.x = BABYLON.Tools.ToRadians(90)
            vessel.material = glassPBR
            camera.position = new BABYLON.Vector3(box.position.x+20, box.position.y+15, box.position.z)
        })
        BABYLON.SceneLoader.ImportMeshAsync('wax', '../assets/models/', 'wax.obj').then((result)=>{
            var wax = result.meshes[0]
            wax.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            wax.rotation.x = BABYLON.Tools.ToRadians(90)
            wax.material = waxPBR
        })
        BABYLON.SceneLoader.ImportMeshAsync('wick', '../assets/models/', 'wick.obj').then((result)=>{
            var wick = result.meshes[0]
            wick.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            wick.rotation.x = BABYLON.Tools.ToRadians(90)
            wick.material = wickPBR
            wick.diffuseColor = new BABYLON.Color3(0,0,0)
        })

        return scene
    }

    var scene = createScene()

    engine.runRenderLoop(function(){
        scene.render()
    })
})