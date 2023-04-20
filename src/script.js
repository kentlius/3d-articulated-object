import { fragmentShaderSource } from "./shaders/fragment-shader.js";
import { vertexShaderSource } from "./shaders/vertex-shader.js";
import { createShader, createProgram } from "./utils/webgl-utils.js";
import { WebGLArticulatedObjectFactory, AnimationFactory } from "./utils/factory.js";
import { WebGLArticulatedRenderer } from "./utils/WebGLArticulatedRenderer.js";
import person from "../test/model.json" assert { type: "json" };
import ghast from "../test/ghast.json" assert { type: "json" };
import snow_golem from "../test/snow_golem.json" assert { type: "json" };
import sheep from "../test/sheep.json" assert { type: "json" };
import { ManFlexing } from "../test/animations/person-anim.js";

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

  let loadModel = person;
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
          loadModel = person;
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

  // Switch Shading
  shading.addEventListener("change", (event) => {
    if (!event.target.checked) {
      isShading = false;
    } else {
      isShading = true;
    }
    articulatedRenderer.shadingMode = isShading;
  });

  // Reset
  reset.addEventListener("click", () => {
    load();
  });

  // ANIMATION WIP
  let shutterSpeed = 0.5;
  const defaultAnimationModel = ManFlexing;
  let animation = AnimationFactory(defaultAnimationModel);
  let isPlayed = false;

  const playButton = document.querySelector("#play-button");
  const pauseButton = document.querySelector("#pause-button");
  playButton.disabled = isPlayed;
  pauseButton.disabled = !isPlayed;

  playButton.onclick = () => {
    isPlayed = true;
    playButton.disabled = isPlayed;
    pauseButton.disabled = !isPlayed;
  };

  pauseButton.onclick = () => {
    isPlayed = false;
    playButton.disabled = isPlayed;
    pauseButton.disabled = !isPlayed;
  };

  //Buat timer
  let globalTimer = 0;
  setInterval(function () {
    globalTimer++;
    if (isPlayed) {
      if (globalTimer % Math.round(shutterSpeed * 10) == 0) {
        animation.curFrame = Math.min(
          animation.frames.length - 1,
          animation.curFrame + 1
        );
        articulatedRenderer.object.applyFrame(
          animation.frames[animation.curFrame]
        );
      }
    }
  }, 100);

  // const position = gl.getAttribLocation(program, "a_position");
  // const color = gl.getAttribLocation(program, "a_color");
  // const normal = gl.getAttribLocation(program, "a_normal");
  // const tangent = gl.getAttribLocation(program, "a_tangent");
  // const bitangent = gl.getAttribLocation(program, "a_bitangent");
  // const textureCoord = gl.getAttribLocation(program, "a_textureCoord");

  // // Set uniform location.
  // const projectionMatrix = gl.getUniformLocation(program, "u_projectionMatrix");
  // const viewMatrix = gl.getUniformLocation(program, "u_viewMatrix");
  // const modelMatrix = gl.getUniformLocation(program, "u_modelMatrix");
  // const normalMatrix = gl.getUniformLocation(program, "u_normalMatrix");
  // const reverseLightDirection = gl.getUniformLocation(
  //   program,
  //   "u_reverseLightDirection"
  // );
  // const worldCameraPosition = gl.getUniformLocation(program, "u_worldCameraPosition");
  // const shadingOn = gl.getUniformLocation(program, "u_shadingOn");
  // const textureMode = gl.getUniformLocation(program, "u_textureMode");

  // // Texture uniform location.
  // const textureImage = gl.getUniformLocation(program, "u_texture_image");
  // const textureEnvironment = gl.getUniformLocation(program, "u_texture_environment");
  // const textureBump = gl.getUniformLocation(program, "u_texture_bump");

  // let lastTime = 0;

  // function render(time) {
  //   time *= 0.001;
  //   const deltaTime = time - lastTime;
  //   lastTime = time;

  //   resizeCanvasToDisplaySize(gl.canvas);
  //   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //   // gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //   gl.enable(gl.CULL_FACE);
  //   gl.enable(gl.DEPTH_TEST);
  //   gl.useProgram(program);

  //   requestAnimationFrame(render);
  // }
  // requestAnimationFrame(render);
}

main();
