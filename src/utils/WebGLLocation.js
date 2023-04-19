export default class WebGLLocation {
  constructor(gl, program) {
    // Set the WebGL context and shader program.
    this.gl = gl;
    this.program = program;

    // Set the attribute location.
    this.position = this.gl.getAttribLocation(this.program, "a_position");
    this.color = this.gl.getAttribLocation(this.program, "a_color");
    this.normal = this.gl.getAttribLocation(this.program, "a_normal");
    this.tangent = this.gl.getAttribLocation(this.program, "a_tangent");
    this.bitangent = this.gl.getAttribLocation(this.program, "a_bitangent");
    this.textureCoord = this.gl.getAttribLocation(
      this.program,
      "a_textureCoord"
    );

    // Set uniform location.
    this.projectionMatrix = this.gl.getUniformLocation(
      this.program,
      "u_projectionMatrix"
    );
    this.viewMatrix = this.gl.getUniformLocation(this.program, "u_viewMatrix");
    this.modelMatrix = this.gl.getUniformLocation(
      this.program,
      "u_modelMatrix"
    );
    this.normalMatrix = this.gl.getUniformLocation(
      this.program,
      "u_normalMatrix"
    );
    this.reverseLightDirection = this.gl.getUniformLocation(
      program,
      "u_reverseLightDirection"
    );
    this.worldCameraPosition = this.gl.getUniformLocation(
      program,
      "u_worldCameraPosition"
    );
    this.shadingOn = this.gl.getUniformLocation(this.program, "u_shadingOn");
    this.textureMode = this.gl.getUniformLocation(
      this.program,
      "u_textureMode"
    );

    // Texture uniform location.
    this.textureImage = this.gl.getUniformLocation(program, "u_texture_image");
    this.textureEnvironment = this.gl.getUniformLocation(
      program,
      "u_texture_environment"
    );
    this.textureBump = this.gl.getUniformLocation(program, "u_texture_bump");
  }
}
