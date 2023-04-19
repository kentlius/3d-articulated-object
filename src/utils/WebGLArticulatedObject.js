import { degToRad, radToDeg } from "./helper.js";
import WebGLObject from "./WebGLObject.js";
import { Transformation } from "./Animation.js";

export default class WebGLArticulatedObject {
  // Struktur tree rekursif
  children = [];

  // TRANSFORMATION PROPERTIES
  translation = [0, 0, 0];
  rotation = [0, 0, 0];
  scale = [1, 1, 1];

  constructor(gl, program, articulatedModel) {
    this.gl = gl;
    this.program = program;
    this.object = new WebGLObject(gl, program, articulatedModel.object);
  }

  draw(projection, view, model, cameraPosition, shadingMode) {
    //Hitung model untuk anak2nya
    let newModel = model.clone();
    newModel.transform(this.translation, this.rotation, this.scale);

    //Gambar object
    this.object.draw(projection, view, newModel, cameraPosition, shadingMode);

    // Draw secara depth first search
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw(
        projection,
        view,
        newModel,
        cameraPosition,
        shadingMode
      );
    }
  }

  getUI(depth, dfsId) {
    let toReturn = "<div class='horizontal-box justify-start'>";
    for (let i = 0; i < depth; i++) {
      toReturn += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    toReturn +=
      "<button id='AO-" + dfsId + "'>" + this.name + "</button></div>";
    dfsId++;
    for (let i = 0; i < this.children.length; i++) {
      toReturn += this.children[i].getUI(depth + 1, dfsId);
      dfsId += this.children[i].getNumObj();
    }
    return toReturn;
  }

  getArticulatedObject(dfsId) {
    if (dfsId == 0) {
      return this;
    }
    dfsId--;
    for (let i = 0; i < this.children.length; i++) {
      //console.log("sebelum", dfsId);
      let returned = this.children[i].getArticulatedObject(dfsId);
      dfsId -= this.children[i].getNumObj();
      //console.log("sesudah", dfsId);
      if (returned != null) {
        return returned;
      }
    }
    return null;
  }

  getNumObj() {
    let toReturn = 1;
    for (let i = 0; i < this.children.length; i++) {
      toReturn += this.children[i].getNumObj();
    }
    return toReturn;
  }

  applyFrame(frame, idx = 0) {
    //Applying transformations, deep copy
    this.object.translation = frame.transformations[idx].tr_obj.map((e) => e);
    this.object.rotation = frame.transformations[idx].rot_obj.map(degToRad);
    this.object.scale = frame.transformations[idx].scale_obj.map((e) => e);
    this.translation = frame.transformations[idx].tr_subtr.map((e) => e);
    this.rotation = frame.transformations[idx].rot_subtr.map(degToRad);
    this.scale = frame.transformations[idx].scale_subtr.map((e) => e);
    idx++;

    //Applying frame to children
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].applyFrame(frame, idx);
      idx += this.children[i].getNumObj();
    }
  }

  getFrame(toReturn) {
    //Copying reference agar penggantian di UI juga mengganti frame
    let toAdd = new Transformation();
    toAdd.tr_obj = this.object.translation;
    toAdd.rot_obj = this.object.rotation.map(radToDeg);
    toAdd.scale_obj = this.object.scale;
    toAdd.tr_subtr = this.translation;
    toAdd.rot_subtr = this.rotation.map(radToDeg);
    toAdd.scale_subtr = this.scale;
    toReturn.transformations.push(toAdd);

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].getFrame(toReturn);
    }
  }

  setTexture(toTexture) {
    this.object.setTexture(toTexture);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setTexture(toTexture);
    }
  }
}
