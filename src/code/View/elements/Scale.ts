import { Toggle } from './Toggle';
import { InterfaceElement } from '../../base';
import { Observer } from '../../base';
import { toggleMsg } from '../../base';
import { sliderInfo } from '../../base';

class Scale extends InterfaceElement {
  container: HTMLElement;

  track: HTMLElement;

  scale: HTMLElement;

  scaleContainer: HTMLElement;

  fractSize: number;

  info: sliderInfo;

  toggles: Array<Toggle>;

  observers: Array<Observer>;

  togCoords: {
      firstTog: number,
      secTog: number,
  }

  progressBar: HTMLElement;

  togObserver: Observer;

  labelUpdateObserver: Observer;

  constructor(info: sliderInfo) {
    super();
    console.log('scale info', info);
    this.toggles = [];
    this.observers = [];
    this.info = info;
    this.togCoords = {
      firstTog: undefined,
      secTog: undefined,
    };
    this.calcFractSize();
    this.renderFirstStage();
    this.labelUpdateObserver = new Observer(this.togObserverUpdateLabelFunc.bind(this));
    this.togObserver = new Observer(this.togObserverFunc.bind(this));
  }

  renderFirstStage() { // add track container and track
    this.container = this.createElement('div', 'slider__trackContainer', this.info.idNum) as HTMLElement;
    this.track = (this.createElement('div', 'slider__track', this.info.idNum)) as HTMLElement;
    if (this.info.isVertical) {
      this.container.classList.add('vertical');
      this.track.classList.add('vertical');
    }
    
    this.container.append(this.track);
    
  }

  renderSecStage() { // add toggles, set toggles first positions
    const that = this;
    this.addToggles();

    this.toggles.forEach((toggle, index) => {
      const togCoord = that.calculateToggleValToCoord(that.info.togVals[index]);
      toggle.setPosition(togCoord);
      toggle.updateLabel(that.info.togVals[index]);

      if (index === 0) {
        that.togCoords.firstTog = togCoord;
      } else {
        that.togCoords.secTog = togCoord;
      }
    });
  }

  updateInfo(newInfo: sliderInfo) {
    this.info = newInfo;

    this.calcFractSize();
    this.updateDradAndDropInfo();
    this.toggles.forEach((toggle) => {
      toggle.updateInfo(newInfo);
    });
    this.updateScaleLabels();
  }

  updateDradAndDropInfo() {
  // update info about start and fin coords for every toggle drag and drop function
    const trackSize = this.info.isVertical
      ? this.track.getBoundingClientRect().height
      : this.track.getBoundingClientRect().width;
    const trackStart = this.info.isVertical
      ? this.track.getBoundingClientRect().top
      : this.track.getBoundingClientRect().left;
    let finEdge = trackSize;
    let startEdge = 0;
    const that = this;

    for (let i = 0; i < this.toggles.length; i++) {
      finEdge = trackSize;
      startEdge = 0;

      if (i === 0 && this.info.isRange) {
        finEdge = that.togCoords.secTog;
      }
      if (i === 1) {
        startEdge = that.togCoords.firstTog;
      }
      this.toggles[i].updateDragAndDropInfo(startEdge, finEdge, trackStart, this.calcStepSize());
    }
  }

  updateTrack() { // remove toggles and create again
    this.removeToggles();
    this.renderSecStage();
    this.addDragAndDrop();
  }

  updateScaleLabels(toRemoveAdditText = false) {
    const divs = Array.from(this.scale.children);
    for (const division of divs) {
      const htmlDiv = division as HTMLElement;
      if (division.children.length > 0) {
        const coord = parseFloat(this.info.isVertical ? htmlDiv.style.top : htmlDiv.style.left);
        let newVal = this.calculateToggleCoordToVal(coord);

        if (toRemoveAdditText) {
          newVal = this.removeAdditText(newVal);
        }
        division.firstElementChild.innerHTML = `${newVal}`;
      }
    }
  }

  updateProgressBar() {
    const start = this.info.isRange ? this.togCoords.firstTog : 0;
    const fin = this.info.isRange ? this.togCoords.secTog : this.togCoords.firstTog;
    this.progressBarSetCoords(start, fin);
  }

  renderScale() {
    const largeDivNum = this.info.lDivNum;
    const regDivNum = this.info.smDivNum;
    this.scaleContainer = this.createElement('div', 'slider__scaleContainer', this.info.idNum) as HTMLElement;
    this.scale = this.createElement('div', 'slider__scale', this.info.idNum) as HTMLElement;

    if (this.info.isVertical) {
      this.scale.classList.add('vertical');
      this.scaleContainer.classList.add('vertical');
    }

    this.scaleContainer.append(this.scale);
    this.container.append(this.scaleContainer);

    let largePxSize = this.scale.offsetWidth / largeDivNum;

    if (this.info.isVertical) {
      largePxSize = this.scale.offsetHeight / largeDivNum;
    }
    const regPxSize = largePxSize / regDivNum;

    this.renderScaleDivisions(largeDivNum, largePxSize, true);
    this.renderScaleDivisions(regDivNum * largeDivNum, regPxSize, false);
  }

  renderScaleDivisions(num: number, pxSize: number, isLarge: boolean) {
    for (let i = 0; i <= num; i++) {
      const division = (isLarge ? this.createElement('div', 'slider__scaleDivision slider__scaleDivision_large', this.info.idNum) : this.createElement('div', 'slider__scaleDivision slider__scaleDivision_reg', this.info.idNum)) as HTMLElement;
      if (this.info.isVertical) {
        division.classList.add('vertical');
      }
      const coord = pxSize * i;

      if (this.info.isVertical) {
        division.style.top = `${coord}px`;
      } else {
        division.style.left = `${coord}px`;
      }

      let divLabel: HTMLElement;
      if (isLarge) {
        divLabel = this.createElement('label', 'slider__scaleDivLabel', this.info.idNum) as HTMLElement;
      } else {
        divLabel = this.createElement('label', 'slider__scaleDivLabel slider__scaleDivLabel_reg', this.info.idNum) as HTMLElement;
      }

      divLabel.setAttribute('for', division.id);
      if (this.info.isVertical) {
        divLabel.classList.add('vertical');
      }
      divLabel.innerHTML = `${this.calculateToggleCoordToVal(coord)}`;

      division.append(divLabel);
      this.scale.append(division);
    }
  }

  showScale(toShow: boolean) {
    if (toShow && this.scaleContainer.classList.contains('hidden')) {
      this.scaleContainer.classList.remove('hidden');
    }
    if (!toShow && !this.scaleContainer.classList.contains('hidden')) {
      this.scaleContainer.classList.add('hidden');
    }
  }

  reloadScale() {
    this.scaleContainer.remove();
    this.renderScale();
  }

  addToggles() { // create toggles and progress bar
    console.log('add toggles this.info', this.info);
    const progBarStartCoord = this.info.isVertical ? this.getCoords().left : this.getCoords().top;
    const firstTog = new Toggle(this.info, this.info.togVals[0], 0);
    firstTog.addObserver(this.labelUpdateObserver);
    firstTog.addObserver(this.togObserver);
    this.toggles.push(firstTog);
    const firstTogCoord = this.calculateToggleValToCoord(this.info.togVals[0]);
    this.togCoords.firstTog = firstTogCoord;

    if (this.info.isRange) {
      const secTogCoord = this.calculateToggleValToCoord(this.info.togVals[1]);
      const secTog = new Toggle(this.info, this.info.togVals[1], 1);
      secTog.addObserver(this.labelUpdateObserver);
      secTog.addObserver(this.togObserver);

      this.toggles.push(secTog);
      this.togCoords.secTog = secTogCoord;
      this.track.append(firstTog.container);
      this.addProgressBar(firstTogCoord, secTogCoord);
      this.track.append(secTog.container);
    } else {
      this.addProgressBar(progBarStartCoord, firstTogCoord);
      this.track.append(firstTog.container);
      this.togCoords.secTog = undefined;
    }
  }

  moveToggle(newVal: number | string, togOrder: number) {
    let tempVal = newVal;
    if (newVal > this.info.maxValue) {
      tempVal = this.info.maxValue;
    }
    if (newVal < this.info.minValue && newVal !== 'Ё') {
      tempVal = this.info.minValue;
    }
    const newCoord = this.calculateToggleValToCoord(tempVal);
    this.toggles[togOrder].setPosition(newCoord);
    const val = togOrder === 0
      ? this.calculateToggleCoordToVal(this.togCoords.firstTog)
      : this.calculateToggleCoordToVal(this.togCoords.secTog);
    this.toggles[togOrder].updateLabel(val);
    this.updateProgressBar();
  }

  recalcTogCoords() { // after changing min or max vals
    this.togCoords.firstTog = this.calculateToggleValToCoord(this.info.togVals[0]);
    if (this.info.isRange) {
      this.togCoords.secTog = this.calculateToggleValToCoord(this.info.togVals[1]);
    }
  }

  recalcTogPositions() { // set new positions for toggles and update progress bar
    this.recalcTogCoords();
    this.moveToggle(this.info.togVals[0], 0);
    if (this.info.isRange) {
      this.moveToggle(this.info.togVals[1], 1);
      this.progressBarSetCoords(this.togCoords.firstTog, this.togCoords.secTog);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this.info.isVertical) {
        this.progressBarSetCoords(this.getCoords().top, this.togCoords.firstTog);
      } else {
        this.progressBarSetCoords(this.getCoords().left, this.togCoords.firstTog);
      }
    }
  }

  showTogLabels(toShow: boolean) { // show or hide tog labels
    this.toggles.forEach((toggle) => {
      if (toShow) {
        toggle.showLabel();
      } else {
        toggle.hideLabel();
      }
    });
  }

  moveClosestTog(clickCoord: number) {
    if (this.togCoords.secTog) {
      if (Math.abs(this.togCoords.secTog - clickCoord)
      >= Math.abs(this.togCoords.firstTog - clickCoord)) {
        this.moveToggle(this.calculateToggleCoordToVal(clickCoord), 0);
      } else {
        this.moveToggle(this.calculateToggleCoordToVal(clickCoord), 1);
      }
    } else {
      this.moveToggle(this.calculateToggleCoordToVal(clickCoord), 0);
    }
  }

  removeToggles() {
    this.toggles = [];
    while (this.track.children.length > 0) {
      this.track.lastElementChild.remove();
    }
  }

  updateTogglesLabels(toRemoveAdditText = false) {
    this.toggles.forEach((toggle, index) => {
      let newVal = index === 0
        ? this.calculateToggleCoordToVal(this.togCoords.firstTog)
        : this.calculateToggleCoordToVal(this.togCoords.secTog);
      if (toRemoveAdditText) {
        newVal = this.removeAdditText(newVal);
      }
      toggle.updateLabel(newVal);
    });
  }

  addProgressBar(startCoord: number, endCoord: number) {
    this.progressBar = this.createElement('div', 'slider__progressBar', this.info.idNum) as HTMLElement;
    if (this.info.isVertical) {
      this.progressBar.classList.add('vertical');
    }
    this.track.append(this.progressBar);
    this.progressBarSetCoords(startCoord, endCoord);
  }

  progressBarSetCoords(startCoord: number, endCoord: number) {
    if (this.info.isRange) {
      if (this.info.isVertical) {
        this.progressBar.style.top = `${startCoord}px`;
        this.progressBar.style.height = `${endCoord - startCoord}px`;
      } else {
        this.progressBar.style.left = `${startCoord}px`;
        this.progressBar.style.width = `${endCoord - startCoord}px`;
      }
    } else if (this.info.isVertical) {
      this.progressBar.style.top = '0px';
      this.progressBar.style.height = `${endCoord}px`;
    } else {
      this.progressBar.style.left = '0px';
      this.progressBar.style.width = `${endCoord}px`;
    }
  }

  addDragAndDrop() {
    const that = this;
    that.updateDradAndDropInfo();
    this.toggles.forEach((toggle) => {
      toggle.addDragAndDrop();
    });
  }

  calcStepSize(): number {
    let stepSize: number;
    const minVal = (this.info.valType === 'latin' || this.info.valType === 'cyrillic') ? (`${this.info.minValue}`).charCodeAt(0) : +this.info.minValue;
    let maxVal = (this.info.valType === 'latin' || this.info.valType === 'cyrillic') ? (`${this.info.maxValue}`).charCodeAt(0) : +this.info.maxValue;
    if (this.info.valType === 'latin' && maxVal > 90) {
      maxVal -= 6;
    }
    const stepNumber = (maxVal - minVal) / +this.info.step;
    stepSize = (this.track.getBoundingClientRect().width) / stepNumber;
    if (this.info.isVertical) {
      stepSize = (this.track.getBoundingClientRect().height) / stepNumber;
    }
    return stepSize;
  }

  calcFractSize() {
    const strStep = `${this.info.step}`;
    if (strStep.includes('.')) {
      const [, fract] = strStep.split('.');
      this.fractSize = fract.length;
    } else {
      this.fractSize = 0;
    }
  }

  calculateToggleValToCoord(val: number | string): number {
    const clearVal = this.removeAdditText(`${val}`);
    let coord: number;
    switch (this.info.valType) {
      case 'integer': {
        coord = this.numberValToCoord(+clearVal);
        break;
      }
      case 'float': {
        coord = this.numberValToCoord(+clearVal);
        break;
      }
      case 'latin': {
        coord = this.latValToCoord(`${val}`);
        break;
      }
      case 'cyrillic': {
        coord = this.cyrValToCoord(`${val}`);
        break;
      }
      default: {
        console.log('Error: vrong valType');
        break;
      }
    }
    return coord;
  }

  numberValToCoord(val: number): number {
    const trackSize = this.info.isVertical
      ? this.track.getBoundingClientRect().height
      : this.track.getBoundingClientRect().width;
    const coord = ((val - +this.info.minValue) * (trackSize))
    / (+this.info.maxValue - +this.info.minValue);
    return coord;
  }

  latValToCoord(val: string): number {
    let numMaxVal = (`${this.info.maxValue}`).charCodeAt(0);
    const numMinVal = (`${this.info.minValue}`).charCodeAt(0);

    if (numMaxVal > 90 && numMinVal < 90) {
      numMaxVal -= 6;
    }
    let numVal = val.charCodeAt(0);
    if (numMaxVal > 90 && numMinVal < 90 && numVal > 90) {
      numVal -= 6;
    }
    const trackSize = this.info.isVertical
      ? this.track.getBoundingClientRect().height
      : this.track.getBoundingClientRect().width;
    const coord = ((numVal - numMinVal) * (trackSize)) / (numMaxVal - numMinVal);
    return coord;
  }

  cyrValToCoord(val: string): number {
    const numMaxVal = (`${this.info.maxValue}`).charCodeAt(0);
    const numMinVal = (`${this.info.minValue}`).charCodeAt(0);
    const numVal = val.charCodeAt(0);

    const trackSize = this.info.isVertical
      ? this.track.getBoundingClientRect().height
      : this.track.getBoundingClientRect().width;
    const coord = ((numVal - numMinVal) * (trackSize)) / (numMaxVal - numMinVal);

    return coord;
  }

  calculateToggleCoordToVal(coord: number): string {
    let val: string;
    switch (this.info.valType) {
      case 'integer': {
        val = `${this.coordToIntVal(coord)}`;
        val = this.addAdditText(val);
        break;
      }
      case 'float': {
        val = `${this.coordToFloatVal(coord)}`;
        val = this.addAdditText(val);
        break;
      }
      case 'latin': {
        val = this.coordToLatVal(coord);
        break;
      }
      case 'cyrillic': {
        val = this.coordToCyrVal(coord);
        break;
      }
      default: {
        console.log('Error: vrong valType');
        break;
      }
    }
    return val;
  }

  coordToIntVal(coord: number): number {
    const trackSize = this.info.isVertical
      ? this.track.getBoundingClientRect().height
      : this.track.getBoundingClientRect().width;

    const val = Math.round(((coord * (+this.info.maxValue - +this.info.minValue))
    / (trackSize)) + +this.info.minValue);
    return val;
  }

  coordToFloatVal(coord: number): number {
    let mult = 1;
    for (let i = 0; i < this.fractSize; i++) {
      mult *= 10;
    }
    const trackSize = this.info.isVertical
      ? this.track.getBoundingClientRect().height
      : this.track.getBoundingClientRect().width;

    const val = Math.round(((coord * (+this.info.maxValue * mult - +this.info.minValue * mult))
    / (trackSize)) + +this.info.minValue * mult) / mult;

    return val;
  }

  coordToLatVal(coord: number): string {
    let numMaxVal = (`${this.info.maxValue}`).charCodeAt(0);
    const numMinVal = (`${this.info.minValue}`).charCodeAt(0);
    if (numMaxVal > 90 && numMinVal < 90) {
      numMaxVal -= 6;
    }

    const trackSize = this.info.isVertical
      ? this.track.getBoundingClientRect().height
      : this.track.getBoundingClientRect().width;

    let numVal = Math.round(((coord * (numMaxVal - numMinVal)) / (trackSize)) + numMinVal);
    if (numMaxVal > 90 && numMinVal < 90 && numVal > 90) {
      numVal += 6;
    }
    const val = String.fromCharCode(numVal);
    return val;
  }

  coordToCyrVal(coord: number): string {
    const numMaxVal = (`${this.info.maxValue}`).charCodeAt(0);
    const numMinVal = (`${this.info.minValue}`).charCodeAt(0);

    const trackSize = this.info.isVertical
      ? this.track.getBoundingClientRect().height
      : this.track.getBoundingClientRect().width;

    const numVal = Math.round(((coord * (numMaxVal - numMinVal)) / (trackSize)) + numMinVal);
    const val = String.fromCharCode(numVal);
    return val;
  }

  addAdditText(val: string): string {
    let newVal = val;
    if (this.info.additText) {
      newVal = this.info.isAdditTextAfter ? val + this.info.additText : this.info.additText + val;
    }
    return newVal;
  }

  removeAdditText(val: string): string {
    let newVal = val;
    const index = val.indexOf(this.info.additText);
    if (this.info.additText && index !== -1) {
      if (index === 0) {
        const addLength = this.info.additText.length;
        const finIndex = index + addLength;
        newVal = val.slice(finIndex);
      } else {
        newVal = val.slice(0, index);
      }
    }
    return newVal;
  }

  rotateVertical() {
    this.container.classList.add('vertical');
    this.track.classList.add('vertical');
    this.progressBar.classList.add('vertical');
    this.toggles.forEach((toggle) => {
      toggle.rotateVertical();
    });
    this.progressBar.style.width = '100%';
    this.progressBar.style.left = '0px';
    this.updateDradAndDropInfo();
    this.updateProgressBar();
    this.reloadScale();
  }

  rotateHorizontal() {
    this.container.classList.remove('vertical');
    this.track.classList.remove('vertical');
    this.progressBar.classList.remove('vertical');
    this.toggles.forEach((toggle) => {
      toggle.rotateHorizontal();
    });
    this.progressBar.style.height = '100%';
    this.progressBar.style.top = '0px';
    this.updateDradAndDropInfo();
    this.updateProgressBar();
    this.reloadScale();
  }

  removeAllAdditText() {
    this.updateTogglesLabels(true);
    this.updateScaleLabels(true);
  }

  updateAllAdditText() {
    this.updateScaleLabels(false);
    this.updateTogglesLabels(false);
  }

  sendMessage(order: number, newVal: string) {
    const msg = {
      order,
      newVal,
    };
    for (let i = 0, len = this.observers.length; i < len; i++) {
      this.observers[i].update(msg);
    }
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  // updating data about tog positions in movement;
  // using for updating tog labels and vals of tog inputs
  togObserverUpdateLabelFunc(msg: toggleMsg) {
    const val = this.calculateToggleCoordToVal(msg.newCoord);
    this.toggles[msg.order].updateLabel(val);
    if (msg.order === 0) {
      this.togCoords.firstTog = msg.newCoord;
    } else if (msg.order === 1) {
      this.togCoords.secTog = msg.newCoord;
    }
    this.updateProgressBar();
    this.sendMessage(msg.order, `${val}`);
  }

  togObserverFunc(msg: toggleMsg) {
    const val = this.calculateToggleCoordToVal(msg.newCoord);
    if (msg.order === 0) {
      this.togCoords.firstTog = msg.newCoord;
    } else if (msg.order === 1) {
      this.togCoords.secTog = msg.newCoord;
    }
    this.sendMessage(msg.order, `${val}`);
    this.updateDradAndDropInfo();
    this.updateProgressBar();
  }
}

export { Scale }