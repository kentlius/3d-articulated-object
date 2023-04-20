import { subtractVectors, normalize, cross } from "./utility.js";

export class Matrix4 {
  nRow = 4;
  nCol = 4;
  matrix;

  constructor(matrix) {
    this.matrix = new Array(this.nRow * this.nCol);

    // Check that matrix is compatible.
    if (matrix != null && matrix.length == this.nRow * this.nCol) {
      this.matrix = matrix;
    }
  }

  /**
   * Set the value of the matrix at the given row and column. 
   *
   * @param row - The row of the matrix.
   * @param col - The column of the matrix.
   * @param value - The value to set.
   */
  set(row, col, value) {
    this.matrix[row * this.nCol + col] = value;
  }

  /**
   * Get the value of the matrix at the given row and column. 
   *
   * @param row - The row of the matrix.
   * @param col - The column of the matrix.
   * @returns The value of the matrix at the given row and column.
   */
  get(row, col) {
    return this.matrix[row * this.nCol + col];
  }

  /**
   * Set the array of matrix. 
   *
   * @param matrix - The array of matrix.
   */
  setMatrix(matrix) {
    this.matrix = matrix;
  }

  /**
   * Get the array of matrix. 
   *
   * @returns - The array of matrix.
   */
  getMatrix() {
    return this.matrix;
  }

  /**
   * Clone the matrix.
   *
   * @param matrix - The matrix to be cloned.
   * @returns - The cloned matrix.
   */
  clone = () => {
    let result = new Matrix4();

    for (let row = 0; row < this.nRow; row++) {
      for (let col = 0; col < this.nCol; col++) {
        result.set(row, col, this.get(row, col));
      }
    }

    return result;
  }

  /**
   * Create a identity matrix. 
   *
   * @returns - The identity matrix.
   */
  static identity = () => {
    let matrix = new Matrix4();

    for (let row = 0; row < matrix.nRow; row++) {
      for (let col = 0; col < matrix.nCol; col++) {
        if (row === col) {
          matrix.set(row, col, 1);
        } else {
          matrix.set(row, col, 0);
        }
      }
    }
    return matrix;
  }

  /**
   * Transpose the matrix and save the result in this matrix.
   *
   */
  transpose = () => {
    for (let row = 0; row < this.nRow; row++) {
      for (let col = row; col < this.nCol; col++) {
        let tmp = this.get(row, col);
        this.set(row, col, this.get(col, row));
        this.set(col, row, tmp);
      }
    }
  }

  /**
   * Multiply the matrix with this matrix and save the result in this matrix.
   * Example: [matrix]*[this] 
   *
   * @param matrix - The matrix to multiply.
   */
  multiply = (matrix) => {
    let result = new Matrix4();
    for (let row = 0; row < this.nRow; row++) {
      for (let col = 0; col < this.nCol; col++) {
        let sum = 0;
        for (let i = 0; i < this.nCol; i++) {
          sum += matrix.get(row, i) * this.get(i, col);
        }
        result.set(row, col, sum);
      }
    }
    this.setMatrix(result.getMatrix());
  }

  /**
   * Multiply the matrix with this matrix and save the result into new matrix.
   * Example: [a]*[b] 
   *
   * @param matrix - The matrix to multiply.
   * @returns - The new matrix.
   */
  static multiply = (a, b) => {
    let result = new Matrix4();
    for (let row = 0; row < a.nRow; row++) {
      for (let col = 0; col < a.nCol; col++) {
        let sum = 0;
        for (let i = 0; i < a.nCol; i++) {
          sum += a.get(row, i) * b.get(i, col);
        }
        result.set(row, col, sum);
      }
    }
    return result;
  }

  /**
   * Inverse this matrix and save the result in this matrix.
   */
  inverse = () => {
    let m00 = this.matrix[0 * 4 + 0];
    let m01 = this.matrix[0 * 4 + 1];
    let m02 = this.matrix[0 * 4 + 2];
    let m03 = this.matrix[0 * 4 + 3];
    let m10 = this.matrix[1 * 4 + 0];
    let m11 = this.matrix[1 * 4 + 1];
    let m12 = this.matrix[1 * 4 + 2];
    let m13 = this.matrix[1 * 4 + 3];
    let m20 = this.matrix[2 * 4 + 0];
    let m21 = this.matrix[2 * 4 + 1];
    let m22 = this.matrix[2 * 4 + 2];
    let m23 = this.matrix[2 * 4 + 3];
    let m30 = this.matrix[3 * 4 + 0];
    let m31 = this.matrix[3 * 4 + 1];
    let m32 = this.matrix[3 * 4 + 2];
    let m33 = this.matrix[3 * 4 + 3];
    let tmp_0  = m22 * m33;
    let tmp_1  = m32 * m23;
    let tmp_2  = m12 * m33;
    let tmp_3  = m32 * m13;
    let tmp_4  = m12 * m23;
    let tmp_5  = m22 * m13;
    let tmp_6  = m02 * m33;
    let tmp_7  = m32 * m03;
    let tmp_8  = m02 * m23;
    let tmp_9  = m22 * m03;
    let tmp_10 = m02 * m13;
    let tmp_11 = m12 * m03;
    let tmp_12 = m20 * m31;
    let tmp_13 = m30 * m21;
    let tmp_14 = m10 * m31;
    let tmp_15 = m30 * m11;
    let tmp_16 = m10 * m21;
    let tmp_17 = m20 * m11;
    let tmp_18 = m00 * m31;
    let tmp_19 = m30 * m01;
    let tmp_20 = m00 * m21;
    let tmp_21 = m20 * m01;
    let tmp_22 = m00 * m11;
    let tmp_23 = m10 * m01;

    let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    this.setMatrix([
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ]);
    return this;
  }

  static inverseTranspose(matrix) {
    const outMatrix = matrix.clone();
    outMatrix.inverse();
    outMatrix.transpose();
    return outMatrix;
  }


  static lookAt(cameraPosition, target, up) {
    var zAxis = normalize(
        subtractVectors(cameraPosition, target));
    var xAxis = normalize(cross(up, zAxis));
    var yAxis = normalize(cross(zAxis, xAxis));

    return new Matrix4([
        xAxis[0], xAxis[1], xAxis[2], 0,
        yAxis[0], yAxis[1], yAxis[2], 0,
        zAxis[0], zAxis[1], zAxis[2], 0,
        cameraPosition[0],
        cameraPosition[1],
        cameraPosition[2],
        1,
      ])
  }

  /**
   * Create a orthographic projection matrix. 
   *
   * @param left - The left value of the projection.
   * @param right - The right value of the projection.
   * @param bottom - The bottom value of the projection.
   * @param top - The top value of the projection.
   * @param near - The near value of the projection.
   * @param far - The far value of the projection.
   * @returns - The orthographic projection matrix.
   */
  static orthographic = (left, right, bottom, top, near, far) => {
    let width = right - left;
    let height = top - bottom;
    let depth = far - near;

    return new Matrix4([
      2 / width, 0, 0, 0,
      0, 2 / height, 0, 0,
      0, 0, 2 / depth, 0,
      0, 0, 0, 1,
    ]);
  }

  /**
   * Create a perspective projection matrix. 
   *
   * @param fov - The field of view of the projection.
   * @param aspect - The aspect of the projection.
   * @param near - The near value of the projection.
   * @param far - The far value of the projection.
   * @returns - The perspective projection matrix.
   */
  static perspective = (fov, aspect, near, far) => {
    let f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    let rangeInv = 1.0 / (near - far);

    return new Matrix4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]);
  }

  /**
   * Create a oblique projection matrix. 
   *
   * @param theta - The angle between object and projection plane
   * @param phi - The angle between object and x axis
   * @returns - The oblique projection matrix.
   */
   static oblique = (theta, phi) => {
    let t = theta * Math.PI / 180;
    let p = phi * Math.PI / 180;

    let cotT = -1 / Math.tan(t);
    let cotP = -1 / Math.tan(p);

    const matrix = new Matrix4([
      1, 0, cotT, 0,
      0, 1, cotP, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);

    matrix.transpose();

    return matrix;
  }


  static projection(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return new Matrix4([
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ]);
  }


  /**
   * Rotate the matrix in x-axis.
   *
   * @param angle - The angle of rotation in radian.
   */
  rotateX = (angle) => {
    let matrix = new Matrix4();
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    matrix.setMatrix([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ]);

    this.multiply(matrix);
  }

  /**
   * Rotate the matrix in y-axis. 
   *
   * @param angle - The angle of rotation in radian.
   */
  rotateY = (angle) => {
    let matrix = new Matrix4();
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    matrix.setMatrix([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ]);

    this.multiply(matrix);
  }

  /**
   * Rotate the matrix in z-axis. 
   *
   * @param angle - The angle of rotation in radian.
   */
  rotateZ = (angle) => {
    let matrix = new Matrix4();
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    matrix.setMatrix([
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);

    this.multiply(matrix);
  }

  /**
   * Translate the matrix in direction of the given parameter value. 
   *
   * @param tx - The value of translation in x-axis. 
   * @param ty - The value of translation in y-axis.
   * @param tz - The value of translation in z-axis.
   */
  translate = (tx, ty, tz) => {
    let matrix = new Matrix4();
    matrix.setMatrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1
    ]);

    this.multiply(matrix);
    return this;
  }

  /**
   * Rotate the matrix in all axis. 
   *
   * @param angleX - The angle of rotation in x-axis (radian).
   * @param angleY - The angle of rotation in y-axis (radian).
   * @param angleZ - The angle of rotation in z-axis (radian).
   */
  rotate = (angleX, angleY, angleZ) => {
    let matrix = Matrix4.identity();
    matrix.rotateX(angleX);
    matrix.rotateY(angleY);
    matrix.rotateZ(angleZ);

    this.multiply(matrix);
    return this;
  }

  /**
   * Scale the matrix in x-axis. 
   *
   * @param sx - The value of scaling in x-axis.
   * @param sy - The value of scaling in y-axis.
   * @param sz - The value of scaling in z-axis.
   */
  scale = (sx, sy, sz) => {
    let matrix = new Matrix4();
    matrix.setMatrix([
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1,
    ]);

    this.multiply(matrix);
    return this;
  } 

  /**
   * Update the matrix with the given parameters. 
   *
   * @param translation - The translation of the matrix.
   * @param rotation - The rotation of the matrix.
   * @param scale - The scale of the matrix.
   */
  transform = (translation, rotation, scale) => {
    this.translate(translation[0], translation[1], translation[2]);
    this.rotate(rotation[0], rotation[1], rotation[2]);
    this.scale(scale[0], scale[1], scale[2]);
    return this;
  }
};