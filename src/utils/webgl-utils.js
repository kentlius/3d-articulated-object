function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

function setUniformVariable(gl, program, uniformName, ...uniformData) {
  // Get the location of the uniform.
  const uniformLocation = gl.getUniformLocation(program, uniformName);

  // Set the uniform based on length of the data.
  switch (uniformData.length) {
    case 1:
      gl.uniform1f(uniformLocation, uniformData[0]);
      break;
    case 2:
      gl.uniform2f(uniformLocation, uniformData[0], uniformData[1]);
      break;
    case 3:
      gl.uniform3f(
        uniformLocation,
        uniformData[0],
        uniformData[1],
        uniformData[2]
      );
      break;
    case 4:
      gl.uniform4f(
        uniformLocation,
        uniformData[0],
        uniformData[1],
        uniformData[2],
        uniformData[3]
      );
      break;
    default:
      throw "Invalid uniform data length.";
  }
}

export {
  createProgram,
  createShader,
  resizeCanvasToDisplaySize,
  setUniformVariable,
};
