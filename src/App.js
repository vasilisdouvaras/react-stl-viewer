import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

import "./App.css";

const rootElement = document.getElementById("root");
const stlLoader = new STLLoader();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scene: null,
    };
    this.fileReader = new FileReader();

    this.test = this.test.bind(this);
  }

  componentDidMount() {
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
  }

  sceneSetup = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    console.warn(width, height);

    this.state.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 2000);

    this.controls = new OrbitControls(this.camera, this.el);
    // this.stlLoader = new STLLoader();

    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement);
  };

  addCustomSceneObjects = () => {
    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.state.scene.add(lights[0]);
    this.state.scene.add(lights[1]);
    this.state.scene.add(lights[2]);
  };

  startAnimationLoop = () => {
    if (this.mesh) {
      // this.mesh.rotation.x += 0.01;
      // this.mesh.rotation.y += 0.01;
    }
    this.renderer.render(this.state.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleFileRead = (e) => {
    console.warn(this.fileReader);

    stlLoader.parse(this.fileReader.result, (event) => {
      console.warn(event);
    });
    // stlLoader.load(event.target.value, (geometry) => {
    //   this.mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    //     color: 0x156289,
    //     emissive: 0x072534,
    //     side: THREE.DoubleSide,
    //     flatShading: true,
    //     // wireframe: true
    //   }));
    //   this.mesh.rotation.set(-Math.PI / 2, 0, 0);
    //   this.mesh.scale.setScalar(10);
    //   this.scene.add(this.mesh);
    //   console.log('asdasd')
    //   // console.log("stl volume is ." + getVolume(geometry));
    // });
  };

  test(event, scene) {
    var fileObject = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      var geometry = stlLoader.parse(this.result);
      console.warn(geometry);
      var material = new THREE.MeshPhongMaterial({
        emissive: 0x55ffff,
        color: 0xffffff,
        specular: null,
        shininess: 1,
        wireframe: true,
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.set(-Math.PI / 2, 0, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    };
    reader.readAsArrayBuffer(fileObject);
  }

  render() {
    return (
      <div>
        <div
          style={{ width: "600px", height: "600px" }}
          ref={(ref) => (this.el = ref)}
        />
        <div>
          <input
            type="file"
            id="multi"
            onChange={(event) => this.test(event, this.state.scene)}
            multiple
          />
        </div>
      </div>
    );
  }
}

export default App;
