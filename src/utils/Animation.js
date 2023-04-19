export class Transformation {
  tr_obj = [0, 0, 0];
  rot_obj = [0, 0, 0];
  scale_obj = [1, 1, 1];
  tr_subtr = [0, 0, 0];
  rot_subtr = [0, 0, 0];
  scale_subtr = [1, 1, 1];
}

export class Frame {
  transformations = [];

  addTransformation(index) {
    let toAdd = new Transformation();
    //Copy by value
    for (let i = 0; i < 3; i++) {
      toAdd.tr_obj[i] = this.transformations[index].tr_obj[i];
      toAdd.rot_obj[i] = this.transformations[index].rot_obj[i];
      toAdd.scale_obj[i] = this.transformations[index].scale_obj[i];
      toAdd.tr_subtr[i] = this.transformations[index].tr_subtr[i];
      toAdd.rot_subtr[i] = this.transformations[index].rot_subtr[i];
      toAdd.scale_subtr[i] = this.transformations[index].scale_subtr[i];
    }
    this.transformations.splice(index, 0, toAdd);
  }
}

export class Animation {
  frames = [];
  curFrame = 0;

  addTransformation(index) {
    for (let i = 0; i < this.frames.length; i++) {
      this.frames[i].addTransformation(index);
    }
  }
}
