import { fragmentShaderSource } from "./shaders/fragment-shader.js";
import { vertexShaderSource } from "./shaders/vertex-shader.js";
import { createShader, createProgram } from "./utils/webgl-utils.js";
import { WebGLArticulatedObjectFactory } from "./utils/factory.js";
import { WebGLArticulatedRenderer } from "./utils/WebGLArticulatedRenderer.js";
import steve from "../test/steve.json" assert { type: "json" };
import ghast from "../test/ghast.json" assert { type: "json" };
import snow_golem from "../test/snow_golem.json" assert { type: "json" };
import sheep from "../test/sheep.json" assert { type: "json" };

async function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const articulatedRenderer = new WebGLArticulatedRenderer(gl, program);

  let loadModel = steve;
  let articulatedObject = WebGLArticulatedObjectFactory(
    loadModel.components[0],
    gl,
    program
  );
  let component = 0;
  const tree = document.querySelector("#tree");
  const selected = document.querySelector("#selected");
  const projections = document.querySelectorAll("input[name='projection']");
  const textures = document.querySelectorAll("input[name='texture']");
  const translateX = document.querySelector("#translateX");
  const translateY = document.querySelector("#translateY");
  const translateZ = document.querySelector("#translateZ");
  const rotateX = document.querySelector("#rotateX");
  const rotateY = document.querySelector("#rotateY");
  const rotateZ = document.querySelector("#rotateZ");
  const scaleX = document.querySelector("#scaleX");
  const scaleY = document.querySelector("#scaleY");
  const scaleZ = document.querySelector("#scaleZ");
  const angle = document.querySelector("#angle");
  const radius = document.querySelector("#radius");
  let isShading = true;
  const shading = document.querySelector("#shading");
  const animate = document.querySelector("#animate");
  const reset = document.querySelector("#reset");

  const load = () => {
    articulatedObject = WebGLArticulatedObjectFactory(
      loadModel.components[0],
      gl,
      program
    );
    articulatedRenderer.setObject(articulatedObject);
    articulatedRenderer.setAnimation(loadModel.animations[0]);
    requestAnimationFrame(
      articulatedRenderer.drawScene.bind(articulatedRenderer)
    );
    tree.innerHTML = articulatedRenderer.object.getUI(0, 0);
    component = 0;
    selected.innerHTML = "Selected Component: " + articulatedRenderer.object.getArticulatedObject(component).name;
    translateX.value = articulatedRenderer.object.getArticulatedObject(component).translation[0];
    translateY.value = articulatedRenderer.object.getArticulatedObject(component).translation[1];
    translateZ.value = articulatedRenderer.object.getArticulatedObject(component).translation[2];
    rotateX.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[0] * Math.PI) / 180;
    rotateY.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[1] * Math.PI) / 180;
    rotateZ.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[2] * Math.PI) / 180;
    scaleX.value = articulatedRenderer.object.getArticulatedObject(component).scale[0];
    scaleY.value = articulatedRenderer.object.getArticulatedObject(component).scale[1];
    scaleZ.value = articulatedRenderer.object.getArticulatedObject(component).scale[2];
    angle.value = (articulatedRenderer.cameraAngle * Math.PI) / 180;
    radius.value = articulatedRenderer.cameraRadius;
    shading.checked = articulatedRenderer.shadingMode;
    articulatedRenderer.setProjection("ORTHOGRAPHIC");
    projections.forEach((projection) => {
      if (projection.value === "orthographic") {
        projection.checked = true;
      } else{
        projection.checked = false;
      }
    });
    textures.forEach((texture) => {
      if (texture.value.toUpperCase() === loadModel.components[0].texture) {
        texture.checked = true;
      } else{
        texture.checked = false;
      }
    });
    
    for (let i = 0; i < articulatedRenderer.object.getNumObj(); i++) {
      let button = document.querySelector("#AO-" + i);
      button.onclick = () => {
        component = i;
        selected.innerHTML = "Selected Component: " + articulatedRenderer.object.getArticulatedObject(component).name;
        translateX.value = articulatedRenderer.object.getArticulatedObject(component).translation[0];
        translateY.value = articulatedRenderer.object.getArticulatedObject(component).translation[1];
        translateZ.value = articulatedRenderer.object.getArticulatedObject(component).translation[2];
        rotateX.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[0] * Math.PI) / 180;
        rotateY.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[1] * Math.PI) / 180;
        rotateZ.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[2] * Math.PI) / 180;
        scaleX.value = articulatedRenderer.object.getArticulatedObject(component).scale[0];
        scaleY.value = articulatedRenderer.object.getArticulatedObject(component).scale[1];
        scaleZ.value = articulatedRenderer.object.getArticulatedObject(component).scale[2];
      }
    }
  };

  // load default model
  load();

  //change model
  const models = document.querySelectorAll("input[name='model']");
  models.forEach((model) => {
    model.addEventListener("change", (event) => {
      switch (event.target.value) {
        case "ghast":
          loadModel = ghast;
          break;
        case "sheep":
          loadModel = sheep;
          break;
        case "snow_golem":
          loadModel = snow_golem;
          break;
        default:
          loadModel = steve;
      }
      load();
    });
  });

  // Projection Radio Button Handler
  projections.forEach((projection) => {
    projection.addEventListener("change", (event) => {
      articulatedRenderer.setProjection(event.target.value.toUpperCase());
    });
  });

  // Texture Radio Button Handler
  textures.forEach((texture) => {
    texture.addEventListener("change", (event) => {
      // set texture for all components
      for (let i = 0; i < articulatedRenderer.object.getNumObj(); i++) {
        articulatedRenderer.object.getArticulatedObject(i).object.setTexture(event.target.value.toUpperCase());
      }
    });
  });

  // Translation Slider Handlers
  translateX.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).translation[0] = translateX.value;
  });

  translateY.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).translation[1] = translateY.value;
  });

  translateZ.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).translation[2] = translateZ.value;
  });

  // Rotation Slider Handlers
  rotateX.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).rotation[0] = (rotateX.value * Math.PI) / 180;
  });

  rotateY.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).rotation[1] = (rotateY.value * Math.PI) / 180;
  });

  rotateZ.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).rotation[2] = (rotateZ.value * Math.PI) / 180;
  });

  // Scale Slider Handlers
  scaleX.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).scale[0] = scaleX.value;
  });

  scaleY.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).scale[1] = scaleY.value;
  });

  scaleZ.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).scale[2] = scaleZ.value;
  });

  // View Angle Slider Handler
  angle.addEventListener("input", () => {
    articulatedRenderer.cameraAngle = (angle.value * Math.PI) / 180;
  });

  // View Radius Slider Handler
  radius.addEventListener("input", () => {
    articulatedRenderer.cameraRadius = radius.value;
  });

  // Toggle Shading
  shading.addEventListener("change", (event) => {
    if (!event.target.checked) {
      isShading = false;
    } else {
      isShading = true;
    }
    articulatedRenderer.shadingMode = isShading;
  });

  // Toggle Animation
  animate.addEventListener("change", (event) => {
    if (!event.target.checked) {
      articulatedRenderer.animate = false;
    } else {
      articulatedRenderer.animate = true;
    }
  });

  // Reset
  reset.addEventListener("click", () => {
    load();
  });
}

main();
