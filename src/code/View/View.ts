import { ControlPanel } from './elements/controlPanel';
import { Scale } from './elements/Scale';
import { sliderInfo } from '../base';
import { Observer } from '../base';
import { scaleMsg } from '../base';


class View {
  // model: Model;
  info: sliderInfo;

  scale: Scale;

  parentElement: HTMLElement;

  controlPanel: ControlPanel;

  container: HTMLElement;

  observers: Array<Observer>;

  scaleObserver: Observer;

  constructor(parentElement: HTMLElement) {
    // this.info = info;
    this.observers = [];
    this.parentElement = parentElement;
    // this.scale = new Scale(this.info);
    // this.controlPanel = new ControlPanel(info);
    // this.scaleObserver = new Observer(this.scaleObserverFunc.bind(this));
    // this.render(parentElement);
    // this.scale.renderSecStage();
    // this.scale.addDragAndDrop();
    // this.scale.renderScale();
    // this.scale.showScale(false);
    // this.controlPanel.addToggleInput(this.scale.toggles[0].info.order, `${this.info.togVals[0]}`, this.togInputListener.bind(this));
    // if (this.info.isRange) {
    //   this.controlPanel.addToggleInput(this.scale.toggles[1].info.order, `${this.info.togVals[1]}`, this.togInputListener.bind(this));
    // }
    // this.addListeners();
    // this.scale.addObserver(this.scaleObserver);
    // window.addEventListener('resize', this.changeWindowSizeListener.bind(this));
    // console.log('view constructor');
  }

  render(parentElement: HTMLElement) {
    if (!parentElement) {
      this.container = document.createElement('div');
    } else {
      this.container = parentElement;
    }
    
    this.container.classList.add('slider__mainContainer');
    this.container.setAttribute('id', `slider__mainContainer-${this.info.idNum}`);

    this.container.append(this.scale.container);
    this.container.append(this.controlPanel.container);
    // parentElement.append(this.container);
  }

  addListeners() {
    this.controlPanel.showToggleLabelsCheckbox.addEventListener('change', this.togLabelsCheckListener.bind(this));
    this.controlPanel.showScaleCheckbox.addEventListener('change', this.scaleCheckListener.bind(this));
    this.controlPanel.isVerticalRadio.addEventListener('change', this.rotateVerticalListener.bind(this));
    this.controlPanel.isHorizontalRadio.addEventListener('change', this.rotateHorizontalListener.bind(this));
    this.controlPanel.isSingleValRadio.addEventListener('change', this.singleValListener.bind(this));
    this.controlPanel.isRangeValRadio.addEventListener('change', this.rangeValListener.bind(this));
    this.controlPanel.minInput.addEventListener('change', this.minInputListener.bind(this));
    this.controlPanel.maxInput.addEventListener('change', this.maxInputListener.bind(this));
    this.controlPanel.stepInput.addEventListener('change', this.stepInputListener.bind(this));

    this.controlPanel.smDivNumInput.addEventListener('change', this.scaleSmDivInputListener.bind(this));
    this.controlPanel.lDivNumInput.addEventListener('change', this.scaleLDivInputListener.bind(this));

    this.scale.track.addEventListener('click', this.trackClickListener.bind(this));
    this.scaleDivsAddListeners();

    this.controlPanel.additTextForm.addEventListener('submit', (e: MouseEvent) => {
      e.preventDefault();
    });

    this.controlPanel.valTypeSelector.addEventListener('change', this.valTypeSelectListener.bind(this));
    this.controlPanel.textBeforeRadio.addEventListener('change', this.textBeforeRadioListener.bind(this));
    this.controlPanel.textAfterRadio.addEventListener('change', this.textAfterRadioListener.bind(this));
    this.controlPanel.additTextInput.addEventListener('change', this.additTextInputListener.bind(this));
  }

  scaleDivsAddListeners() {
    const scaleDivs = Array.from(this.scale.scale.children);
    for (const div of scaleDivs) {
      div.addEventListener('click', this.scaleDivClickListener.bind(this));
    }
  }

  togLabelsCheckListener(e: MouseEvent) {
    const checkbox = e.currentTarget as HTMLInputElement;
    if (checkbox.checked) {
      this.scale.showTogLabels(checkbox.checked);
    } else {
      this.scale.showTogLabels(checkbox.checked);
    }
  }

  scaleCheckListener(e: MouseEvent) {
    const checkbox = e.currentTarget as HTMLInputElement;
    this.scale.showScale(checkbox.checked);
    if (checkbox.checked && this.controlPanel.divNumInputsContainer.classList.contains('hidden')) {
      this.controlPanel.divNumInputsContainer.classList.remove('hidden');
    } else if (!checkbox.checked && !this.controlPanel.divNumInputsContainer.classList.contains('hidden')) {
      this.controlPanel.divNumInputsContainer.classList.add('hidden');
    }
  }

  rotateVerticalListener(e: MouseEvent) {
    const radio = e.currentTarget as HTMLInputElement;
    if (radio.checked) {
      this.sendMessage('isVertical', true);
      this.scale.rotateVertical();
    }
    this.scaleDivsAddListeners();
    const check = this.controlPanel.showScaleCheckbox as HTMLInputElement;
    if (check.checked) {
      this.scale.showScale(true);
    } else {
      this.scale.showScale(false);
    }
  }

  rotateHorizontalListener(e: MouseEvent) {
    const radio = e.currentTarget as HTMLInputElement;
    if (radio.checked) {
      this.sendMessage('isVertical', false);
      this.scale.rotateHorizontal();
    }
    this.scaleDivsAddListeners();
    const check = this.controlPanel.showScaleCheckbox as HTMLInputElement;
    if (check.checked) {
      this.scale.showScale(true);
    } else {
      this.scale.showScale(false);
    }
  }

  singleValListener(e: MouseEvent) {
    const radio = e.currentTarget as HTMLInputElement;
    if (radio.checked) {
      this.sendMessage('isRange', false);
      this.updateAllTogInputs();
      this.scale.updateTrack();
      if (this.info.togVals.length === 2) {
        this.info.togVals.pop();
      }
    }
    const check = this.controlPanel.showToggleLabelsCheckbox as HTMLInputElement;
    if (check.checked) {
      this.scale.showTogLabels(true);
    }
  }

  rangeValListener(e: MouseEvent) {
    const radio = e.currentTarget as HTMLInputElement;
    if (radio.checked && this.controlPanel.toggleInputsContainer.children.length === 1) {
      this.sendMessage('isRange', true);
      this.controlPanel.addToggleInput(1, `${this.info.maxValue}`, this.togInputListener.bind(this));
      this.info.togVals.push(this.info.maxValue);
      this.scale.updateTrack();
    }
    const check = this.controlPanel.showToggleLabelsCheckbox as HTMLInputElement;
    if (check.checked) {
      this.scale.showTogLabels(true);
    }
  }

  togInputListener(e: MouseEvent) {
    const input = e.currentTarget as HTMLInputElement;
    const newVal = input.value;
    this.scale.moveToggle(newVal, +input.getAttribute('data-toggleNum'));
  }

  minInputListener(e: MouseEvent) {
    const input = e.target as HTMLInputElement;
    const newVal = input.value;
    this.sendMessage('minValue', newVal);
    this.scale.recalcTogCoords();
    this.scale.recalcTogPositions();
    this.scale.updateScaleLabels();
  }

  maxInputListener(e: MouseEvent) {
    const input = e.target as HTMLInputElement;
    const newVal = input.value;
    this.sendMessage('maxValue', newVal);
    this.scale.recalcTogCoords();
    this.scale.recalcTogPositions();
    this.scale.updateScaleLabels();
  }

  stepInputListener(e: MouseEvent) {
    const input = e.target as HTMLInputElement;
    const newVal = input.value;
    this.sendMessage('step', newVal);
  }

  trackClickListener(e: MouseEvent) {
    const halfTog = 10;

    const newCoord = this.info.isVertical
      ? e.clientY - this.scale.track.getBoundingClientRect().top
      : e.clientX - this.scale.track.getBoundingClientRect().left;

    if (newCoord > this.scale.togCoords.firstTog - halfTog
      && newCoord < this.scale.togCoords.firstTog + halfTog) {
      return;
    }
    if (this.info.isRange && newCoord > this.scale.togCoords.secTog - halfTog
      && newCoord < this.scale.togCoords.secTog + halfTog) {
      return;
    }
    this.scale.moveClosestTog(newCoord);
  }

  scaleDivClickListener(e: MouseEvent) {
    let div = e.target as HTMLElement;
    if (div.tagName === 'LABEL') {
      div = div.parentElement;
    }
    const newCoord = this.info.isVertical
      ? div.getBoundingClientRect().top - this.scale.track.getBoundingClientRect().top
      : div.getBoundingClientRect().left - this.scale.track.getBoundingClientRect().left;

    this.scale.moveClosestTog(newCoord);
  }

  scaleLDivInputListener(e: MouseEvent) {
    const input = e.target as HTMLInputElement;
    const newVal = input.value;
    if (newVal) {
      this.sendMessage('lDivNum', newVal);
      this.scale.reloadScale();
      this.scaleDivsAddListeners();
    }
  }

  scaleSmDivInputListener(e: MouseEvent) {
    const input = e.target as HTMLInputElement;
    const newVal = input.value;
    if (newVal) {
      this.sendMessage('smDivNum', newVal);
      this.scale.reloadScale();
      this.scaleDivsAddListeners();
    }
  }

  changeWindowSizeListener() {
    this.scale.updateDradAndDropInfo();
    this.scale.recalcTogCoords();
    this.scale.recalcTogPositions();
    this.scale.updateScaleLabels();
  }

  valTypeSelectListener(e: MouseEvent) {
    const select = e.target as HTMLInputElement;
    const newVal = select.value;
    this.sendMessage('valType', newVal);
    this.controlPanel.reloadInputs();
    this.controlPanel.minInput.addEventListener('change', this.minInputListener.bind(this));
    this.controlPanel.maxInput.addEventListener('change', this.maxInputListener.bind(this));
    this.controlPanel.stepInput.addEventListener('change', this.stepInputListener.bind(this));

    if (newVal === 'latin' || newVal === 'cyrillic') {
      this.controlPanel.toHideAdditTextInput(true);
    }
    if (newVal === 'integer' || newVal === 'float') {
      this.controlPanel.toHideAdditTextInput(false);
    }
    this.scale.updateTrack();
    const check = this.controlPanel.showToggleLabelsCheckbox as HTMLInputElement;
    if (check.checked) {
      this.scale.showTogLabels(true);
    }
  }

  additTextInputListener(e: MouseEvent) {
    const input = e.currentTarget as HTMLInputElement;
    const newVal = input.value;
    if (newVal) {
      this.sendMessage('additText', newVal);
      this.scale.removeAllAdditText();
      this.scale.updateAllAdditText();
    }
  }

  textBeforeRadioListener(e: MouseEvent) {
    e.preventDefault();
    const radio = e.currentTarget as HTMLInputElement;
    if (radio.checked) {
      this.scale.removeAllAdditText();
      this.sendMessage('isAdditTextAfter', false);
      this.scale.updateAllAdditText();
    }
  }

  textAfterRadioListener(e: MouseEvent) {
    e.preventDefault();
    const radio = e.currentTarget as HTMLInputElement;
    if (radio.checked) {
      this.scale.removeAllAdditText();
      this.sendMessage('isAdditTextAfter', true);
      this.scale.updateAllAdditText();
    }
  }

  updateTogInput(order: number, newVal: string) {
    const input = this.controlPanel
      .toggleInputsContainer
      .children[order]
      .lastElementChild as HTMLInputElement;
    input.value = newVal;
    this.info.togVals[order] = newVal;
  }

  updateInfo(info: sliderInfo) {
    this.info = info;
    this.scale.updateInfo(info);
    this.controlPanel.updateInfo(info);
  }

  updateAllTogInputs() {
    if (this.controlPanel.toggleInputsContainer.children.length === 2 && !this.info.isRange) {
      this.controlPanel.toggleInputsContainer.lastElementChild.remove();
    }
    if (this.controlPanel.toggleInputsContainer.children.length === 1 && this.info.isRange) {
      this.controlPanel.addToggleInput(this.scale.toggles[1].info.order, `${this.info.togVals[1]}`, this.togInputListener.bind(this));
    }
  }

  sendMessage(name: string, newVal: string | boolean) {
    const msg = {
      name,
      newVal,
    };
    for (let i = 0, len = this.observers.length; i < len; i++) {
      this.observers[i].update(msg);
    }
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  scaleObserverFunc(msg: scaleMsg) {
    this.updateTogInput(msg.order, msg.newVal);
  }
  setInfo (info: sliderInfo) {
    this.info = info;
  }
  start () {
    this.scale = new Scale(this.info);
    this.controlPanel = new ControlPanel(this.info);
    this.scaleObserver = new Observer(this.scaleObserverFunc.bind(this));
    this.render(this.parentElement);
    this.scale.renderSecStage();
    this.scale.addDragAndDrop();
    this.scale.renderScale();
    this.scale.showScale(false);
    this.controlPanel.addToggleInput(this.scale.toggles[0].info.order, `${this.info.togVals[0]}`, this.togInputListener.bind(this));
    if (this.info.isRange) {
      this.controlPanel.addToggleInput(this.scale.toggles[1].info.order, `${this.info.togVals[1]}`, this.togInputListener.bind(this));
    }
    this.addListeners();
    this.scale.addObserver(this.scaleObserver);
    window.addEventListener('resize', this.changeWindowSizeListener.bind(this));
    console.log('view constructor');
  }
}

export { View }