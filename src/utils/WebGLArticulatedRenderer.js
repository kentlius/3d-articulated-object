import { resizeCanvasToDisplaySize } from "./webgl-utils.js";
import { Matrix4 } from "./matrix.js";
import { degToRad } from "./helper.js";

/**
 * A Class for rendering WebGL objects.
 */
export class WebGLArticulatedRenderer {
  // The object to be drawn.
  object;

  cameraAngle = degToRad(0);
  cameraRadius = 500;
  shadingMode = false;

  // WebGL Context.
  _gl;
  get gl() {
    return this._gl;
  }

  // WebGL Shader Program.
  _program;
  get program() {
    return this._program;
  }

  // Projection matrix.
  projectionMatrix;
  // Animation properties.
  then = 0;

  constructor(gl, program) {
    this._gl = gl;
    this._program = program;

    // Default projection.
    this.setProjection("ORTHOGRAPHIC");
  }

  setObject(object) {
    this.object = object;
    this.setDefaultTransformation();
  }

  setDefaultTransformation() {
    this.cameraAngle = degToRad(0);
    this.cameraRadius = 500;
    this.shadingMode = false;
  }

  setProjection(projection) {
    // Orthographic projection parameters.
    const left = 0;
    const right = this._gl.canvas.clientWidth;
    const bottom = 0;
    const top = this._gl.canvas.clientHeight;
    const near = 850;
    const far = -850;

    // Perspective projection parameters.
    const fov = degToRad(60);
    const aspect = this._gl.canvas.clientWidth / this._gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 2000;

    // Oblique projection parameters.
    const theta = 45;
    const phi = 45;

    switch (projection) {
      case "ORTHOGRAPHIC":
        this.projectionMatrix = Matrix4.orthographic(
          left,
          right,
          bottom,
          top,
          near,
          far
        );
        break;
      case "PERSPECTIVE":
        this.projectionMatrix = Matrix4.perspective(fov, aspect, zNear, zFar);
        break;
      default:
        const ortho = Matrix4.orthographic(left, right, bottom, top, near, far);
        const oblique = Matrix4.oblique(-theta, -phi);
        oblique.multiply(ortho);

        // Center the object
        oblique.translate(0, 0, 500);

        this.projectionMatrix = oblique;
        break;
    }
  }

  /**
   * Draw the scene.
   */
  drawScene(now) {
    // Convert to seconds
    now *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = now - this.then;
    // Remember the current time for the next frame.
    this.then = now;

    // Resize the canvas to fit the window.
    resizeCanvasToDisplaySize(this._gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

    // Clear the canvas.
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    this._gl.enable(this._gl.CULL_FACE);

    // Enable the depth buffer
    this._gl.enable(this._gl.DEPTH_TEST);

    // Check if the object is defined.
    if (!this.object) {
      return;
    }

    // Get the projection matrix.
    const projectionMatrix = this.projectionMatrix.clone();

    // Use matrix math to compute a position on a circle where the camera is
    let cameraMatrix = Matrix4.identity();
    cameraMatrix.rotateY(this.cameraAngle);
    cameraMatrix.translate(0, 0, this.cameraRadius);

    // Get the camera's position from the matrix we computed
    var cameraPosition = [
      cameraMatrix.get(3, 0),
      cameraMatrix.get(3, 1),
      cameraMatrix.get(3, 2),
    ];
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    // Compute the camera's matrix using look at.
    cameraMatrix = Matrix4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix
    const viewMatrix = cameraMatrix.clone().inverse();

    // Draw the object.
    this.object.draw(
      projectionMatrix,
      viewMatrix,
      Matrix4.identity(),
      cameraPosition,
      this.shadingMode
    );

    // Call drawScene again next frame
    requestAnimationFrame(this.drawScene.bind(this));
  }

  clear() {
    this.object = null;
  }

  reset(object) {
    this.object = object;
  }
}

export default WebGLArticulatedRenderer;
