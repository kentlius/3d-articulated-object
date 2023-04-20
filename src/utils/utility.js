function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // avoid 0 division
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

// get normal, tangent, bitangent vector
function getVectors(vertices) {
  const n = vertices.length;
  var vertexNormals = [];
  var vertexTangents = [];
  var vertexBitangents = [];
  for (let i = 0; i < n; i += 18) {
    const p1 = [
      vertices[i],
      vertices[i + 1],
      vertices[i + 2],
    ];
    const p2 = [
      vertices[i + 3],
      vertices[i + 4],
      vertices[i + 5],
    ];
    const p3 = [
      vertices[i + 6],
      vertices[i + 7],
      vertices[i + 8],
    ];

    const vec1 = subtractVectors(p2, p1);
    const vec2 = subtractVectors(p3, p1);
    const normalDirection = cross(vec1, vec2);

    const vecNormal = normalize(normalDirection);
    const vecTangent = normalize(vec1);
    const vecBitangent = normalize(vec2);

    for (let j = 0; j < 6; j++) {
      vertexNormals = vertexNormals.concat(vecNormal);
      vertexTangents = vertexTangents.concat(vecTangent);
      vertexBitangents = vertexBitangents.concat(vecBitangent);
    }
  }
  return {
    normals: vertexNormals,
    tangents: vertexTangents,
    bitangents: vertexBitangents,
  };
}

// Get the all vector normals of the edge beam object
function getNormalVector(vPosition) {
  const n = vPosition.length;
  var vNormals = [];
  for (let i = 0; i < n; i += 18) {
    const p1 = [vPosition[i], vPosition[i + 1], vPosition[i + 2]];
    const p2 = [vPosition[i + 3], vPosition[i + 4], vPosition[i + 5]];
    const p3 = [vPosition[i + 6], vPosition[i + 7], vPosition[i + 8]];
    const vec1 = subtractVectors(p2, p1);
    const vec2 = subtractVectors(p3, p1);
    const normalDirection = cross(vec1, vec2);
    const vecNormal = normalize(normalDirection);
    for (let j = 0; j < 6; j++) {
      vNormals = vNormals.concat(vecNormal);
    }
  }

  return vNormals;
}

export { subtractVectors, normalize, cross, getVectors, getNormalVector };
