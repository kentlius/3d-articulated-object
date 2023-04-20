import { Matrix4 } from "./matrix.js";
import { getAllVectors, normalize } from "./vector.js";
import { TEXTURE_MAP, toTextureMode } from "./Texture.js";
import WebGLLocation from "./WebGLLocation.js";

export default class WebGLObject {
  // -1 : No texture.
  // 0 : Image texture.
  // 1 : Environment texture.
  // 2 : Bump texture.
  textureMode = -1;

  // The translation values.
  translation = [0, 0, 0];
  // The rotation values.
  rotation = [0, 0, 0];
  // The scale values.
  scale = [1, 1, 1];

  constructor(gl, program, model) {
    // Set the WebGL context and shader program.
    this.gl = gl;
    this.program = program;

    // Set model.
    this.model = model;

    // Create the buffers.
    this.positionBuffer = this.gl.createBuffer();
    this.colorBuffer = this.gl.createBuffer();
    this.textureCoordBuffer = this.gl.createBuffer();
    this.normalBuffer = this.gl.createBuffer();
    this.tangentBuffer = this.gl.createBuffer();
    this.bitangentBuffer = this.gl.createBuffer();

    // Set shader locations.
    this.location = new WebGLLocation(this.gl, this.program);

    // Generate the properties.
    this.generateProperties();
  }

  /**
   * Generate the properties from models.
   */
  generateProperties() {
    let vertexPositions = [];
    let vertexColors = [];
    let vertexTextureCoordinates = [];

    // The component in this models.
    let component = {
      num_vertices: 8,
      vertices: [
        [100, 100, 100],
        [-100, 100, 100],
        [-100, -100, 100],
        [100, -100, 100],
        [100, 100, -100],
        [-100, 100, -100],
        [-100, -100, -100],
        [100, -100, -100],
      ],
      num_faces: 6,
      faces: [
        [0, 1, 2, 3],
        [5, 4, 7, 6],
        [4, 0, 3, 7],
        [1, 5, 6, 2],
        [0, 4, 5, 1],
        [2, 6, 7, 3],
      ],
      colors: [
        [255, 0, 0, 255],
        [255, 0, 0, 255],
        [255, 0, 0, 255],
        [255, 0, 0, 255],
        [255, 0, 0, 255],
        [255, 0, 0, 255],
      ],
    };

    // List of vertices in the component.
    let vertices = component.vertices;

    // Position and color of each vertex.
    let positions = [];
    let colors = [];
    let textureCoordinates = [];

    // Mapping each vertex in a face to a position and color.
    for (let j = 0; j < component.num_faces; j++) {
      let face = component.faces[j];

      // Set each vertex position.
      positions = positions.concat(vertices[face[1]]);
      positions = positions.concat(vertices[face[2]]);
      positions = positions.concat(vertices[face[3]]);
      positions = positions.concat(vertices[face[0]]);
      positions = positions.concat(vertices[face[1]]);
      positions = positions.concat(vertices[face[3]]);

      // Set each vertex color.
      let color_idx = j % component.colors.length;
      for (let k = 0; k < 6; k++) {
        colors = colors.concat(component.colors[color_idx]);
      }

      // Set each vertex texture coordinate.
      textureCoordinates = textureCoordinates.concat([
        0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1,
      ]);
    }

    vertexPositions = vertexPositions.concat(positions);
    vertexColors = vertexColors.concat(colors);
    vertexTextureCoordinates =
      vertexTextureCoordinates.concat(textureCoordinates);

    // Get the number of vertices.
    let numVertices = vertexPositions.length / 3;

    // Get the vector.
    let vector = getAllVectors(vertexPositions);

    // Set the properties of the object.
    this.setProperties(
      numVertices,
      vertexPositions,
      vertexColors,
      vector.normals,
      vector.tangents,
      vector.bitangents,
      vertexTextureCoordinates
    );
  }

  /**
   * Set the properties of the object.
   *
   * @param numVertices - The number of vertices.
   * @param geometry - The geometry of the object.
   * @param color - The colors of the object.
   */
  setProperties(
    numVertices,
    geometry,
    color,
    normal,
    tangent,
    bitangent,
    textureCoord
  ) {
    this.numVertices = numVertices;
    this.position = geometry;
    this.color = color;
    this.normal = normal;
    this.tangent = tangent;
    this.bitangent = bitangent;
    this.textureCoord = textureCoord;

    // Create texture.
    let imageTexture = TEXTURE_MAP.image(this.gl);
    let environmentTexture = TEXTURE_MAP.environment(this.gl);
    let bumpTexture = TEXTURE_MAP.bump(this.gl);
    let defaultTexture = TEXTURE_MAP.default(this.gl, this.color);

    this.textures = [imageTexture, environmentTexture, bumpTexture, defaultTexture];
  }

  /**
   * Set the texture of the object.
   *
   * @param texture - The texture.
   */
  setTexture(texture) {
    this.textureMode = toTextureMode(texture);
  }

  /**
   * Binds the geometry and color to the buffers.
   */
  bind() {
    const gl = this.gl;

    // Start binding the position buffers.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    // Set the position.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.position),
      gl.STATIC_DRAW
    );

    // Start binding the color buffers.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    // Set the colors.
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(this.color), gl.STATIC_DRAW);

    // Start binding the normal buffers.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    // Set the normal.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.normal),
      gl.STATIC_DRAW
    );

    // Start binding the tangent buffers.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
    // Set the tangent.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.tangent),
      gl.STATIC_DRAW
    );

    // Start binding the bitangent buffers.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangentBuffer);
    // Set the bitangent.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.bitangent),
      gl.STATIC_DRAW
    );

    // Start binding the texture coordinates buffers.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    // Set the texture coordinates.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.textureCoord),
      gl.STATIC_DRAW
    );
  }

  /**
   * Set the buffers to the shader.
   * It included set positions, color, normals and texture coordinates for each vertex.
   */
  setBuffers() {
    const gl = this.gl;

    // POSITION.
    // Turn on the attribute.
    gl.enableVertexAttribArray(this.location.position);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      this.location.position,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // COLOR.
    // Turn on the color attribute
    gl.enableVertexAttribArray(this.location.color);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

    // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 4; // 3 components per iteration
    var type = gl.UNSIGNED_BYTE; // the data is 8bit unsigned bytes
    var normalize = true; // normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      this.location.color,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // NORMAL.
    // Turn on the normal attribute
    gl.enableVertexAttribArray(this.location.normal);

    // Bind the normal buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      this.location.normal,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // TANGENT.
    // Turn on the tangent attribute
    gl.enableVertexAttribArray(this.location.tangent);

    // Bind the tangent buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      this.location.tangent,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // BITANGENT.
    // Turn on the bitangent attribute
    gl.enableVertexAttribArray(this.location.bitangent);

    // Bind the bitangent buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangentBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      this.location.bitangent,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // TEXTURE COORDINATES.
    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(this.location.textureCoord);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      this.location.textureCoord,
      size,
      type,
      normalize,
      stride,
      offset
    );
  }

  /**
   * Set the uniforms for the object.
   *
   * @param projection - The projection matrix.
   * @param view - The view matrix.
   * @param model - The world matrix.
   * @param cameraPosition - The camera position.
   * @param shadingMode - The shading mode.
   */
  setUniforms(projection, view, model, cameraPosition, shadingMode) {
    // Set projection matrix.
    this.gl.uniformMatrix4fv(
      this.location.projectionMatrix,
      false,
      projection.getMatrix()
    );
    // Set the view matrix.
    this.gl.uniformMatrix4fv(this.location.viewMatrix, false, view.getMatrix());
    // Set the world matrix.
    this.gl.uniformMatrix4fv(
      this.location.modelMatrix,
      false,
      model.getMatrix()
    );
    // Set the light direction.
    this.gl.uniform3fv(
      this.location.reverseLightDirection,
      normalize([0.2, 0.4, 1])
    );

    // Normal matrix.
    const viewModelMatrix = Matrix4.multiply(view, model);
    const normalMatrix = Matrix4.inverseTranspose(viewModelMatrix);
    this.gl.uniformMatrix4fv(
      this.location.normalMatrix,
      false,
      normalMatrix.getMatrix()
    );

    // Camera position.
    this.gl.uniform3fv(this.location.worldCameraPosition, cameraPosition);

    // Set the shading mode.
    this.gl.uniform1i(this.location.shadingOn, Number(shadingMode));
    // Set the texture on or off.
    this.gl.uniform1i(this.location.textureMode, Number(this.textureMode));

    // Set each texture unit to use a particular texture.
    // Texture image.
    this.gl.uniform1i(this.location.textureImage, 0);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
    // Texture environment.
    this.gl.uniform1i(this.location.textureEnvironment, 1);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textures[1]);
    // Texture bump.
    this.gl.uniform1i(this.location.textureBump, 2);
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[2]);
    // Texture default
    this.gl.uniform1i(this.location.textureDefault, 3);
    this.gl.activeTexture(this.gl.TEXTURE3);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[3]);
  }

  /**
   * Draw the object.
   *
   * @param projection - The projection matrix.
   * @param view - The view matrix.
   * @param model - The world matrix.
   * @param cameraPosition - The camera position.
   * @param shadingMode - The shading mode.
   */
  draw(projection, view, model, cameraPosition, shadingMode) {
    // Tell it to use our this.program (pair of shaders)
    this.gl.useProgram(this.program);

    // Bind the buffers.
    this.bind();

    // Do the ceremonies.
    this.setBuffers();

    let newModel = model.clone();
    newModel.transform(this.translation, this.rotation, this.scale);

    this.setUniforms(projection, view, newModel, cameraPosition, shadingMode);

    // Draw the geometry and colors.
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = this.numVertices;
    this.gl.drawArrays(primitiveType, offset, count);
  }
}
