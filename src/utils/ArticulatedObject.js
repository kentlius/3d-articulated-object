import Object from "./Object.js";

export default class ArticulatedObject {
  // Articulated Object Properties
  children = [];

  // Transformation Properties
  translation = [0, 0, 0];
  rotation = [0, 0, 0];
  scale = [1, 1, 1];

  constructor(gl, program, articulatedModel) {
    this.gl = gl;
    this.program = program;
    this.object = new Object(gl, program, articulatedModel.object);
  }

  draw(projection, view, model, cameraPosition, shadingMode) {
    let newModel = model.clone();
    newModel.transform(this.translation, this.rotation, this.scale);

    // draw object recursively
    //draw the object
    this.object.draw(projection, view, newModel, cameraPosition, shadingMode);
    // draw object's children
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

  generateHTML(depth, id) {
    let toReturn = "<div class='horizontal-box justify-start'>";
    for (let i = 0; i < depth; i++) {
      toReturn += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    toReturn +=
      "<button id='Object-" + id + "'>" + this.name + "</button></div>";
    id++;
    for (let i = 0; i < this.children.length; i++) {
      toReturn += this.children[i].generateHTML(depth + 1, id);
      id += this.children[i].getTotalObj();
    }
    return toReturn;
  }

  getArticulatedObject(id) {
    if (id == 0) {
      return this;
    }
    id--;
    for (let i = 0; i < this.children.length; i++) {
      let returned = this.children[i].getArticulatedObject(id);
      id -= this.children[i].getTotalObj();
      if (returned != null) {
        return returned;
      }
    }
    return null;
  }

  getArticulatedObjectByName(name) {
    if (this.name == name) {
      return this;
    }
    for (let i = 0; i < this.children.length; i++) {
      let returned = this.children[i].getArticulatedObjectByName(name);
      if (returned != null) {
        return returned;
      }
    }
    return null;
  }

  getTotalObj() {
    let toReturn = 1;
    for (let i = 0; i < this.children.length; i++) {
      toReturn += this.children[i].getTotalObj();
    }
    return toReturn;
  }

  applyFrame(frame, idx = 0) {
    //Applying transformations, deep copy
    this.translation = frame.transformations[idx].tr_subtr.map((e) => e);
    this.rotation = frame.transformations[idx].rot_subtr.map(
      (x) => (x * Math.PI) / 180
    );
    this.scale = frame.transformations[idx].scale_subtr.map((e) => e);
    idx++;

    //Applying frame to children
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].applyFrame(frame, idx);
      idx += this.children[i].getTotalObj();
    }
  }

  setTexture(toTexture) {
    this.object.setTexture(toTexture);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setTexture(toTexture);
    }
  }
}
