window.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('babylonCanvas')
    var engine = new BABYLON.Engine(canvas, true)

    function createScene() {
        var scene = new BABYLON.Scene(engine)

        scene.createDefaultEnvironment({
            environmentTexture: '../assets/env/environment.env',
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
        var pbr = new BABYLON.PBRMetallicRoughnessMaterial('pbr', scene)
        pbr.diffuseColor = new BABYLON.Color3.White()
        pbr.specularColor = new BABYLON.Color3.White()
        pbr.metallic = 0.2
        pbr.roughness = 0.2
        // pbr.environmentTexture = '../assets/env/environment.env'
        // pbr.baseTexture = new BABYLON.Texture('../assets/images/marble.jpg')

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
            vessel.material = pbr
            vessel.material.diffuseColor = new BABYLON.Color3.White()
            camera.position = new BABYLON.Vector3(vessel.position.x+20, vessel.position.y+15, vessel.position.z)
        })
        BABYLON.SceneLoader.ImportMeshAsync('wax', '../assets/models/', 'wax.obj').then((result)=>{
            var vessel = result.meshes[0]
            vessel.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            vessel.rotation.x = BABYLON.Tools.ToRadians(90)
            vessel.material = pbr
            vessel.material.diffuseColor = new BABYLON.Color3.White()
        })
        BABYLON.SceneLoader.ImportMeshAsync('wick', '../assets/models/', 'wick.obj').then((result)=>{
            var vessel = result.meshes[0]
            vessel.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            vessel.rotation.x = BABYLON.Tools.ToRadians(90)
            vessel.material = pbr
            vessel.material.diffuseColor = new BABYLON.Color3.White()
        })

        return scene
    }

    var scene = createScene()

    engine.runRenderLoop(function(){
        scene.render()
    })
})