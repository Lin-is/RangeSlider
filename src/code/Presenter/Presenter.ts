import { Model } from '../Model/Model';
import { View } from '../View/View';
import { Observer } from '../base';
import { viewMsg } from '../base';
import { sliderInfo } from '../base';

class Presenter {
  view: View;

  model: Model;

  viewObserver: Observer;

  modelObserver: Observer;

  // constructor(model: Model, view: View) {
  //   this.model = model;
  //   this.view = view;
  //   this.viewObserver = new Observer(this.viewObserverFunc.bind(this));
  //   this.modelObserver = new Observer(this.modelObserverFunc.bind(this));
  //   this.view.addObserver(this.viewObserver);
  //   this.model.addObserver(this.modelObserver);
  //   console.log('presenter constructor');
  // }

  constructor (info: sliderInfo, container: HTMLElement) {
    this.model = new Model(info, container);
    const modelInfo = this.model.getInfo();
    console.log('model Info', modelInfo);
    this.view = new View (container);
    this.viewObserver = new Observer(this.viewObserverFunc.bind(this));
    this.modelObserver = new Observer(this.modelObserverFunc.bind(this));
    this.view.addObserver(this.viewObserver);
    this.model.addObserver(this.modelObserver);
    this.view.setInfo(modelInfo);
    this.view.start();
  }

  viewObserverFunc(newMsg: viewMsg) {
    this.model.updateInfo(newMsg);
    // this.updateViewInfo();
  }
  modelObserverFunc(newMsg: sliderInfo) {
    this.view.updateInfo(newMsg);
  }

  updateViewInfo() {
    const newInfo = this.model.getSliderData();
    this.view.updateInfo(newInfo);
  }
}

export { Presenter }