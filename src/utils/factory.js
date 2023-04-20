import { degToRad, radToDeg } from "./helper.js";
import WebGLArticulatedObject from "./WebGLArticulatedObject.js";
import WebGLObject from "./WebGLObject.js";
import { Transformation, Frame, Animation } from "./Animation.js";

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
    articulatedModel.object,
    gl,
    program
  );
  articulatedObject.object.scale = articulatedModel.scale;
  articulatedObject.object.setTexture("DEFAULT");

  //Set other properties
  articulatedObject.name = articulatedModel.id;
  articulatedObject.translation = articulatedModel.coordinates;
  articulatedObject.rotation = articulatedModel.rotation.map(degToRad);
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
    rot_subtr: articulatedObject.rotation.map(radToDeg),
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

function TransformationFactory(transformationModel) {
  let transformation = new Transformation();
  transformation.tr_subtr = transformationModel.tr_subtr;
  transformation.rot_subtr = transformationModel.rot_subtr;
  transformation.scale_subtr = transformationModel.scale_subtr;
  return transformation;
}

function FrameFactory(frameModel) {
  let frame = new Frame();
  for (let i = 0; i < frameModel.transformations.length; i++) {
    frame.transformations.push(
      TransformationFactory(frameModel.transformations[i])
    );
  }
  return frame;
}

export function AnimationFactory(animationModel) {
  let animation = new Animation();
  for (let i = 0; i < animationModel.frames.length; i++) {
    animation.frames.push(FrameFactory(animationModel.frames[i]));
  }
  return animation;
}
