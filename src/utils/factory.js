import WebGLArticulatedObject from "./WebGLArticulatedObject.js";
import WebGLObject from "./WebGLObject.js";

export function webGLObjectFactory(model, gl, program) {
  // Create the WebGL Object
  const object = new WebGLObject(gl, program, model);

  return object;
}

export function WebGLArticulatedObjectFactory(articulatedModel, gl, program) {
  let articulatedObject = new WebGLArticulatedObject(
    gl,
    program,
    articulatedModel
  );

  //Set object
  articulatedObject.object = webGLObjectFactory(
    articulatedModel,
    gl,
    program
  );
  articulatedObject.object.scale = articulatedModel.scale;
  articulatedObject.object.setTexture(articulatedModel.texture);

  //Set other properties
  articulatedObject.name = articulatedModel.id;
  articulatedObject.translation = articulatedModel.coordinates;
  articulatedObject.rotation = articulatedModel.rotation.map((x) => x*Math.PI/180);
  articulatedObject.scale = [1, 1, 1];

  //Set children
  for (let i = 0; i < articulatedModel.children.length; i++) {
    articulatedObject.children.push(
      WebGLArticulatedObjectFactory(articulatedModel.children[i], gl, program)
    );
  }

  return articulatedObject;
}

export function WebGLArticulatedModelFactory(articulatedObject) {
  const articulatedModel = {
    name: articulatedObject.name,

    tl_subtr: articulatedObject.translation,
    rot_subtr: articulatedObject.rotation.map((x) => x*180/Math.PI),
    scale_subtr: articulatedObject.scale,
    texture: fromTextureMode(articulatedObject.object.textureMode),

    object: articulatedObject.object.model,
    children: [],
  };

  //Set children
  for (let i = 0; i < articulatedObject.children.length; i++) {
    articulatedModel.children.push(
      WebGLArticulatedModelFactory(articulatedObject.children[i])
    );
  }

  return articulatedModel;
}
