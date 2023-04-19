import { fragmentShaderSource } from "./shaders/fragment-shader.js";
import { vertexShaderSource } from "./shaders/vertex-shader.js";
import { createShader, createProgram } from "./utils/webgl-utils.js";
import { Person } from "../test/person.js";
import { WebGLArticulatedObjectFactory } from "./utils/factory.js";
import { WebGLArticulatedRenderer } from "./utils/WebGLArticulatedRenderer.js";

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
    Person,
    gl,
    program
  );
  const articulatedRenderer = new WebGLArticulatedRenderer(gl, program);
  articulatedRenderer.setObject(defaultArticulatedObject);
  requestAnimationFrame(
    articulatedRenderer.drawScene.bind(articulatedRenderer)
  );

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
