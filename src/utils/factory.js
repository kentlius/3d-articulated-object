import ArticulatedObject from "./ArticulatedObject.js";
import Object from "./Object.js";

export function WebGLArticulatedObjectFactory(articulatedModel, gl, program) {
  let articulatedObject = new ArticulatedObject(
    gl,
    program,
    articulatedModel
  );

  //Set object
  articulatedObject.object = new Object(
    gl,
    program,
    articulatedModel
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
