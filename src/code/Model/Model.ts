import { Observable } from '../base';
import { Observer } from '../base';
import { sliderInfo } from '../base';
import { viewMsg } from '../base';

class Model extends Observable {
  sliderData: sliderInfo;
  observers: Array<Observer>;

  constructor(sliderData: sliderInfo, parentElement: HTMLElement) {
    super();
    this.sliderData = {};
    this.setStartInfo(sliderData);
    console.log('model constructor');
  }

  setStartInfo(data: sliderInfo) {
    this.sliderData.idNum = data.idNum;
    this.sliderData.valType = data.valType ?? "integer";
    this.setValType(this.sliderData.valType);
    this.setMinValue(data.minValue);
    this.setMaxValue(data.maxValue);
    this.updateTogVals(data.togVals);
    this.setStep(data.step);
    this.updateIsVerticalInfo(data.isVertical);
    this.updateIsRangeInfo(data.isRange);
    this.setLDivNum(data.lDivNum);
    this.setSmDivNum(data.smDivNum);
    this.updateAdditText(data.additText);
    this.updateIsTextAfterInfo(data.isAdditTextAfter);

    // this.sendMessage();

    console.log('slider data from model', this.sliderData);
  }

  updateInfo(msg: viewMsg) {
    switch (msg.name) {
      case 'minValue': {
        this.setMinValue(`${msg.newVal}`);
        break;
      }
      case 'maxValue': {
        this.setMaxValue(`${msg.newVal}`);
        break;
      }
      case 'step': {
        this.setStep(`${msg.newVal}`);
        break;
      }
      case 'isRange': {
        if (typeof (msg.newVal) === 'boolean') {
          this.updateIsRangeInfo(msg.newVal);
        }
        break;
      }
      case 'valType': {
        if (typeof (msg.newVal) === 'string') {
          this.setValType(msg.newVal);
        }
        break;
      }
      case 'isVertical': {
        if (typeof (msg.newVal) === 'boolean') {
          this.updateIsVerticalInfo(msg.newVal);
        }
        break;
      }
      case 'lDivNum': {
        this.setLDivNum(+msg.newVal);

        break;
      }
      case 'smDivNum': {
        this.setSmDivNum(+msg.newVal);
        break;
      }
      case 'isAdditTextAfter': {
        if (typeof (msg.newVal) === 'boolean') {
          this.updateIsTextAfterInfo(msg.newVal);
        }
        break;
      }
      case 'additText': {
        if (typeof (msg.newVal) === 'string') {
          this.updateAdditText(msg.newVal);
        }
        break;
      }
      default: {
        console.log('Error: wrong name');
        break;
      }
    }
    this.sendMessage();
  }

  getInfo(): sliderInfo {
    return this.sliderData;
  }

  getMinValue(): number {
    return +this.sliderData.minValue;
  }

  getMaxValue(): number {
    return +this.sliderData.maxValue;
  }

  getStep(): number {
    return +this.sliderData.step;
  }

  getIsRangeInfo(): boolean {
    return this.sliderData.isRange;
  }

  getStartVals(): Array<number | string> {
    return this.sliderData.togVals;
  }

  getValType(): string {
    return this.sliderData.valType;
  }

  getIsVerticalInfo(): boolean {
    return this.sliderData.isVertical;
  }

  getSliderData(): sliderInfo {
    return this.sliderData;
  }

  setMinValue(newMin: number | string) {
    if (!newMin) {
      return;
    }
    if (this.sliderData.valType === 'integer' || this.sliderData.valType === 'float') {
      this.sliderData.minValue = +newMin;
    } else {
      this.sliderData.minValue = newMin;
    }
    console.log('newMin', this.sliderData.minValue);
  }

  setMaxValue(newMax: number | string) {
    if (!newMax) {
      return;
    }
    if (this.sliderData.valType === 'integer' || this.sliderData.valType === 'float') {
      this.sliderData.maxValue = +newMax;
    } else {
      this.sliderData.maxValue = newMax;
    }
  }

  setStep(newStep: string) {
    if (!newStep) {
      return;
    }
    if (+newStep > 0) {
      this.sliderData.step = newStep;
    } else {
      this.sliderData.step = "1";
    }
  }

  updateIsRangeInfo(newData: boolean) {
    this.sliderData.isRange = newData ?? false;
  }

  setValType(newValType: string) {
    this.sliderData.valType = newValType;
    switch (newValType) {
      case 'integer': {
        this.setStartValsInt();
        break;
      }
      case 'float': {
        this.setStartValsFloat();
        break;
      }
      case 'latin': {
        this.setStartValsLatin();
        break;
      }
      case 'cyrillic': {
        this.setStartValsCyrillic();
        break;
      }
      default: {
        console.log('ERROR: wrong valType');
        break;
      }
    }
  }

  updateIsVerticalInfo(newData: boolean) {
    this.sliderData.isVertical = newData ?? false;
  }

  updateIsTextAfterInfo(newData: boolean) {
    this.sliderData.isAdditTextAfter = newData ?? false;
  }

  setLDivNum(newNum: number) {
    this.sliderData.lDivNum = newNum ?? 5;
  }

  setSmDivNum(newNum: number) {
    this.sliderData.smDivNum = newNum ?? 2;
  }

  updateTogVals(newVals: Array<number | string>) {
      for (let i = 0; i < 2; i++) {
        if (newVals[i]) {
          this.sliderData.togVals[i] = newVals[i];
        }
        else return;
      }
  }
  updateAdditText(newText: string) {
    this.sliderData.additText = newText ?? '';
  }

  setStartValsInt() {
    if (this.sliderData.valType === 'integer') {
      this.setMinValue('0');
      this.setMaxValue('100');
      this.setStep('1');
      this.sliderData.togVals = [];
      this.sliderData.togVals.push(25);
      this.sliderData.togVals.push(75);
    }
  }

  setStartValsFloat() {
    if (this.sliderData.valType === 'float') {
      this.setMinValue('1.5');
      this.setMaxValue('11.5');
      this.setStep('0.5');
      this.sliderData.togVals = [];
      this.sliderData.togVals.push(4.5);
      this.sliderData.togVals.push(8.5);
    }
  }

  setStartValsLatin() {
    if (this.sliderData.valType === 'latin') {
      this.setMinValue('A');
      this.setMaxValue('z');
      this.setStep('1');
      this.sliderData.togVals = [];
      this.sliderData.togVals.push('H');
      this.sliderData.togVals.push('s');
    }
  }

  setStartValsCyrillic() {
    if (this.sliderData.valType === 'cyrillic') {
      this.setMinValue('А');
      this.setMaxValue('я');
      this.setStep('1');
      this.sliderData.togVals = [];
      this.sliderData.togVals.push('И');
      this.sliderData.togVals.push('ч');
    }
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  sendMessage() {
    const msg = this.sliderData;
    for (let i = 0, len = this.observers.length; i < len; i++) {
      this.observers[i].update(msg);
    }
    console.log('model msg', msg);
  }
}

export { Model }