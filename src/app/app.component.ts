import {Component, OnInit} from '@angular/core';
import pc from './playcanvas';

declare const glTF: any;

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

    if (canvas === null) {
      return;
    }

    const app = new pc.Application(canvas, {
      mouse: new pc.Mouse(canvas),
    });

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.start();


    // cube
    const cube = new pc.Entity();
    cube.addComponent('model', {
      type: 'box'
    });
    cube.setPosition(1, 1, 0);

    // camera
    const camera = new pc.Entity();
    camera.addComponent('camera', {
      clearColor: new pc.Color(0.1, 0.2, 0.3)
    });
    camera.setPosition(0, 0, 3);

    // light
    const light = new pc.Entity();
    light.addComponent('light');
    light.setEulerAngles(45, 0, 0);

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

    app.root.addChild(cube);
    app.root.addChild(camera);
    app.root.addChild(light);
  }
}
