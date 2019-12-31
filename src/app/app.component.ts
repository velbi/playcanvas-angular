import {Component, OnInit} from '@angular/core';

declare const glTF: any;
declare const pc;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  canvasWidth: number;
  canvasHeight: number;

  constructor() {
    this.canvasWidth = 500;
    this.canvasHeight = 500;
  }

  ngOnInit() {
    const canvas = document.getElementById('application-canvas');

    const app = new pc.Application(canvas, {
      mouse: new pc.Mouse(canvas),
    });

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.start();




    // camera
    const camera = new pc.Entity();
    camera.addComponent('camera', {
      clearColor: new pc.Color(0.1, 0.2, 0.3)
    });
    camera.setPosition(0, 0, 3);
    app.root.addChild(camera);

    // glTF monkey
    app.assets.loadFromUrl('assets/monkey.gltf', 'json', (err, asset) => {
      const entity = new pc.Entity();
      entity.name = 'monkey';

      if (!err && asset) {
        const json = asset.resource;
        const jsonParse = JSON.parse(json);

        glTF.loadGltf(jsonParse, app.graphicsDevice, (e, res) => {

          entity.addComponent('model');
          entity.model.model = res.model;
        }, {
          basePath: 'assets/'
        });
      }
      app.root.addChild(entity);
    });


    // Cube map
    var hdr = {
      name: 'white-dom',
      ddsPath: 'assets/Helipad/Helipad.dds',
      textures: [
        'assets/Helipad/Helipad_negx.png',
        'assets/Helipad/Helipad_posx.png',
        'assets/Helipad/Helipad_negy.png',
        'assets/Helipad/Helipad_posy.png',
        'assets/Helipad/Helipad_negz.png',
        'assets/Helipad/Helipad_posx.png',
      ]
    };

    var textureAssets = [];
    for (var i = 0; i < hdr.textures.length; i++) {
      var asset = new pc.Asset(hdr.name + '-' + i, 'texture', {url: hdr.textures[i]});
      app.assets.add(asset);
      textureAssets.push(asset.id);
    }

    var cmap = new pc.Asset
    (
      hdr.name,
      'cubemap',
      {url: hdr.ddsPath},
      {
        anisotropy: Number(1),
        // magFilter: Number(5),
        // minFilter: Number(1), // 엣지에서는 WEBGL11163: texParameteri: Texture filter not recognized. 이 에러나서 일단 주석처리했음
        rgbm: true,
        textures: textureAssets
      }
    );

    app.scene.skyboxIntensity = Number(1);
    app.scene.gammaCorrection = pc.GAMMA_SRGB;
    app.setSkybox(cmap);
  }
}
