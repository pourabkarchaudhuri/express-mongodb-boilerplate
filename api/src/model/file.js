import _ from 'lodash'

class File {
  constructor(app){
    this.app = app;
    this.model = {
      name: null,
      originalname: null,
      mimetype: null,
      size: null,
      created: Date.now(),
    }
  }
  initWithObject(obj){
    this.model.name = _.get(obj, 'filename');
    this.model.originalname = _.get(obj, 'originalname');
    this.model.mimetype = _.get(obj, 'mimetype');
    this.model.size = _.get(obj, 'size');
    this.model.created = Date.now();
    return this;
  }
  toJSON(){
    return this.model;
  }
}
export default File;
