import { fragmentShaderSource } from "./shaders/fragment-shader.js";
import { vertexShaderSource } from "./shaders/vertex-shader.js";
import { createShader, createProgram } from "./utils/webgl-utils.js";
import { WebGLArticulatedObjectFactory } from "./utils/factory.js";
import { WebGLArticulatedRenderer } from "./utils/WebGLArticulatedRenderer.js";
import model from "../test/model.json" assert { type: "json" };

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
  // prettier-ignore
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = createProgram(gl, vertexShader, fragmentShader);
  const defaultArticulatedObject = WebGLArticulatedObjectFactory(
    model.components[0],
    gl,
    program
  );
  const articulatedRenderer = new WebGLArticulatedRenderer(gl, program);
  articulatedRenderer.setObject(defaultArticulatedObject);
  requestAnimationFrame(
    articulatedRenderer.drawScene.bind(articulatedRenderer)
  );
  //Create Tree
  const tree = document.querySelector("#tree");
  tree.innerHTML = articulatedRenderer.object.getUI(0, 0);
  let component = 0;
  let selected = document.querySelector("#selected");
  selected.innerHTML = "Selected Component: " + articulatedRenderer.object.getArticulatedObject(0).name;
  for (let i = 0; i < articulatedRenderer.object.getNumObj(); i++) {
    let button = document.querySelector("#AO-" + i);
    button.onclick = () => {
      component = i;
      selected.innerHTML = "Selected Component: " + articulatedRenderer.object.getArticulatedObject(component).name;
    }
  }

  // Projection Radio Button Handler
  const projections = document.querySelectorAll("input[name='projection']");
  projections.forEach((projection) => {
    projection.addEventListener("change", (event) => {
      articulatedRenderer.setProjection(event.target.value.toUpperCase());
    });
  });

  // Translation Slider Handlers
  const translateX = document.querySelector("#translateX");
  translateX.value = articulatedRenderer.object.getArticulatedObject(component).translation[0];
  translateX.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).translation[0] = translateX.value;
  });

  const translateY = document.querySelector("#translateY");
  translateY.value = articulatedRenderer.object.getArticulatedObject(component).translation[1];
  translateY.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).translation[1] = translateY.value;
  });

  const translateZ = document.querySelector("#translateZ");
  translateZ.value = articulatedRenderer.object.getArticulatedObject(component).translation[2];
  translateZ.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).translation[2] = translateZ.value;
  });

  // Rotation Slider Handlers
  const rotateX = document.querySelector("#rotateX");
  rotateX.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[0] * Math.PI) / 180;
  rotateX.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).rotation[0] = (rotateX.value * Math.PI) / 180;
  });

  const rotateY = document.querySelector("#rotateY");
  rotateY.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[1] * Math.PI) / 180;
  rotateY.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).rotation[1] = (rotateY.value * Math.PI) / 180;
  });

  const rotateZ = document.querySelector("#rotateZ");
  rotateZ.value = (articulatedRenderer.object.getArticulatedObject(component).rotation[2] * Math.PI) / 180;
  rotateZ.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).rotation[2] = (rotateZ.value * Math.PI) / 180;
  });

  // Scale Slider Handlers
  const scaleX = document.querySelector("#scaleX");
  scaleX.value = articulatedRenderer.object.getArticulatedObject(component).scale[0];
  scaleX.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).scale[0] = scaleX.value;
  });

  const scaleY = document.querySelector("#scaleY");
  scaleY.value = articulatedRenderer.object.getArticulatedObject(component).scale[1];
  scaleY.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).scale[1] = scaleY.value;
  });

  const scaleZ = document.querySelector("#scaleZ");
  scaleZ.value = articulatedRenderer.object.getArticulatedObject(component).scale[2];
  scaleZ.addEventListener("input", () => {
    articulatedRenderer.object.getArticulatedObject(component).scale[2] = scaleZ.value;
  });

  // View Angle Slider Handler
  const angle = document.querySelector("#angle");
  angle.value = (articulatedRenderer.cameraAngle * Math.PI) / 180;
  angle.addEventListener("input", () => {
    articulatedRenderer.cameraAngle = (angle.value * Math.PI) / 180;
  });

  // View Radius Slider Handler
  const radius = document.querySelector("#radius");
  radius.value = articulatedRenderer.cameraRadius;
  radius.addEventListener("input", () => {
    articulatedRenderer.cameraRadius = radius.value;
  });

  // Switch Shading
  const shading = document.querySelector("#shading");
  let isShading = true;
  shading.checked = articulatedRenderer.shadingMode;
  shading.addEventListener("change", (event) => {
    if (!event.target.checked) {
      isShading = false;
    } else {
      isShading = true;
    }
    articulatedRenderer.shadingMode = isShading;
  });

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
