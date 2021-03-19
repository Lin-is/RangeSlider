/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
import './index.css';

interface sliderInfo {
    idNum?: number,
    minValue?: number | string,
    maxValue?: number | string,
    step?: string,
    isRange?: boolean,
    togVals?: Array<number | string>,
    valType?: string,
    isVertical?: boolean,
    lDivNum?: number,
    smDivNum?: number,
    additText?: string,
    isAdditTextAfter?: boolean,
}

interface toggleMsg {
    order: number,
    newCoord: number,
}

interface scaleMsg {
    order: number,
    newVal: string,

    firstTogVal: number,
    secTogVal: number,
}

interface viewMsg {
    name: string,
    newVal: string | boolean,
}

class Observer {
    update: any;

    constructor(behavior: any) {
      this.update = (msg: any) => {
        behavior(msg);
      };
    }
}

class InterfaceElement {
    container: HTMLElement;

    info: sliderInfo;

    // eslint-disable-next-line class-methods-use-this
    createElement(tag: string, className: string, idNum: number | string): Element {
      if (tag && className) {
        return null;
      }
      const newElem = document.createElement(tag);
      newElem.className = className;
      newElem.id = `${className}-${idNum}`;
      return newElem as HTMLElement;
    }

    getCoords() {
      const coords = {
        top: this.container.getBoundingClientRect().top,
        bottom: this.container.getBoundingClientRect().bottom,
        left: this.container.getBoundingClientRect().left,
        right: this.container.getBoundingClientRect().right,
        height: this.container.getBoundingClientRect().height,
        width: this.container.getBoundingClientRect().width,
      };
      return coords;
    }
}

class Observable {
    observers: Observer[];

    constructor() {
      this.observers = [];
    }

    sendMessage(msg: any) {
      for (let i = 0, len = this.observers.length; i < len; i++) {
        this.observers[i].update(msg);
      }
    }

    addObserver(observer: Observer) {
      this.observers.push(observer);
    }
}

//*--------------------------------------------------------------------------------------------
//* ----MODEL-----------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------

class Model extends Observable {
    sliderData: sliderInfo;

    constructor(sliderData: sliderInfo) {
      super();
      this.sliderData = sliderData;
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
      if (this.sliderData.valType === 'integer' || this.sliderData.valType === 'float') {
        this.sliderData.minValue = +newMin;
      } else {
        this.sliderData.minValue = newMin;
      }
    }

    setMaxValue(newMax: number | string) {
      if (this.sliderData.valType === 'integer' || this.sliderData.valType === 'float') {
        this.sliderData.maxValue = +newMax;
      } else {
        this.sliderData.maxValue = newMax;
      }
    }

    setStep(newStep: string) {
      this.sliderData.step = newStep;
    }

    updateIsRangeInfo(newData: boolean) {
      this.sliderData.isRange = newData;
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
      this.sliderData.isVertical = newData;
    }

    updateIsTextAfterInfo(newData: boolean) {
      this.sliderData.isAdditTextAfter = newData;
    }

    setLDivNum(newNum: number) {
      this.sliderData.lDivNum = newNum;
    }

    setSmDivNum(newNum: number) {
      this.sliderData.smDivNum = newNum;
    }

    updateTogVals(newVals: Array<number | string>) {
      if (newVals.length < 2) {
        this.sliderData.togVals = [];
        this.sliderData.togVals = newVals;
      }
    }

    updateAdditText(newText: string) {
      this.sliderData.additText = newText;
    }

    setStartValsInt() {
      if (this.sliderData.valType === 'integer') {
        this.setMinValue(0);
        this.setMaxValue(100);
        this.setStep('1');
        this.sliderData.togVals = [];
        this.sliderData.togVals.push(25);
        this.sliderData.togVals.push(75);
      }
    }

    setStartValsFloat() {
      if (this.sliderData.valType === 'float') {
        this.setMinValue(1.5);
        this.setMaxValue(11.5);
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
}

//*--------------------------------------------------------------------------------------------
//* ----TOGGLE----------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------

class Toggle extends InterfaceElement {
    label: HTMLElement;

    info: {
        idNum: number,
        isVertical: boolean,
        order: number,
    };

    dragAndDropInfo: {
        startEdge: number,
        finEdge: number,
        trackStart: number,
        stepSize: number,
    }

    observers: Observer[];

    sendMessage(msg: toggleMsg) {
      for (let i = 1, len = this.observers.length; i < len; i++) {
        this.observers[i].update(msg);
      }
    }

    sendMessageToUpdateLabel(msg: toggleMsg) {
      this.observers[0].update(msg);
    }

    addObserver(observer: Observer) {
      this.observers.push(observer);
    }

    constructor(info: sliderInfo, value: number | string, order: number) {
      super();
      this.observers = [];
      this.info = {
        idNum: info.idNum,
        isVertical: info.isVertical,
        order,
      };
      this.dragAndDropInfo = {
        startEdge: undefined,
        finEdge: undefined,
        trackStart: undefined,
        stepSize: undefined,
      };
      this.create(value, order);
    }

    create(value: number | string, order: number) {
      this.container = this.createElement('div', 'slider__toggle', this.info.idNum) as HTMLElement;
      this.container.setAttribute('id', `${this.container.getAttribute('id')}-${order + 1}`);
      this.label = (this.createElement('div', 'slider__toggleLabel', this.info.idNum)) as HTMLElement;
      this.label.innerHTML = `${value}`;
      this.label.setAttribute('id', `${this.label.getAttribute('id')}-${order + 1}`);
      this.label.classList.add('hidden');
      this.container.append(this.label);
      if (this.info.isVertical) {
        this.container.classList.add('vertical');
        this.label.classList.add('vertical');
      }
    }

    rotateVertical() {
      this.container.classList.add('vertical');
      this.label.classList.add('vertical');
      this.container.style.top = this.container.style.left;
      this.container.style.left = '-7px';
      const msg = {
        order: this.info.order,
        newCoord: parseInt(this.container.style.top, 10),
      };
      this.sendMessage(msg);
    }

    rotateHorizontal() {
      this.container.classList.remove('vertical');
      this.label.classList.remove('vertical');
      this.container.style.left = this.container.style.top;
      this.container.style.top = '-7px';
      const msg = {
        order: this.info.order,
        newCoord: parseInt(this.container.style.left, 10),
      };
      this.sendMessage(msg);
    }

    showLabel() {
      if (this.label.classList.contains('hidden')) {
        this.label.classList.remove('hidden');
      }
    }

    hideLabel() {
      if (!this.label.classList.contains('hidden')) {
        this.label.classList.add('hidden');
      }
    }

    remove() {
      this.container.remove();
    }

    setPosition(coord: number): void {
      const tempCoord = this.checkedStepMatch(coord);
      if (this.info.isVertical) {
        this.container.style.top = `${tempCoord}px`;
      } else {
        this.container.style.left = `${tempCoord}px`;
      }
      const msg = {
        order: this.info.order,
        newCoord: tempCoord,
      };
      this.sendMessage(msg);
    }

    getCoord(): number {
      let coord = this.container.getBoundingClientRect().left;
      if (this.info.isVertical) {
        coord = this.container.getBoundingClientRect().top;
      }
      return coord;
    }

    updateLabel(value: number | string) {
      this.label.innerText = `${value}`;
    }

    updateInfo(info: sliderInfo) {
      this.info.idNum = info.idNum;
      this.info.isVertical = info.isVertical;
    }

    updateDragAndDropInfo(startEdge: number, finEdge: number,
      trackStart: number, stepSize: number) {
      this.dragAndDropInfo.startEdge = startEdge;
      this.dragAndDropInfo.finEdge = finEdge;
      this.dragAndDropInfo.trackStart = trackStart;
      this.dragAndDropInfo.stepSize = stepSize;
    }

    checkedStepMatch(coord: number): number {
      let checkedCoord = coord;
      if (coord % this.dragAndDropInfo.stepSize !== 0) {
        const diff = coord / this.dragAndDropInfo.stepSize;
        const minNum = Math.floor(diff);
        const maxNum = Math.ceil(diff);
        if (Math.abs(diff - minNum) < Math.abs(diff - maxNum)) {
          checkedCoord = this.dragAndDropInfo.stepSize * minNum;
        } else {
          checkedCoord = this.dragAndDropInfo.stepSize * maxNum;
        }
        if (!checkedCoord) {
          checkedCoord = coord;
        }
      }
      return checkedCoord;
    }

    addDragAndDrop() {
      const that = this;
      const toggle = this.container;

      toggle.addEventListener('mousedown', (event: MouseEvent) => {
        let shift: number;
        let newCoord: number;
        let eventClient: number;
        let msg: toggleMsg;

        event.preventDefault();

        if (that.info.isVertical) {
          shift = event.clientY - toggle.getBoundingClientRect().top;
        } else {
          shift = event.clientX - toggle.getBoundingClientRect().left;
        }

        function onMouseMove(e: MouseEvent) {
          if (that.info.isVertical) {
            eventClient = e.clientY;
          } else {
            eventClient = e.clientX;
          }

          newCoord = eventClient - shift - that.dragAndDropInfo.trackStart;

          if (newCoord < that.dragAndDropInfo.startEdge) {
            newCoord = that.dragAndDropInfo.startEdge;
          }
          if (newCoord > that.dragAndDropInfo.finEdge) {
            newCoord = that.dragAndDropInfo.finEdge;
          }
          const finCoord = Math.round(newCoord / that.dragAndDropInfo.stepSize)
          * that.dragAndDropInfo.stepSize;

          if (that.info.isVertical) {
            toggle.style.top = `${finCoord}px`;
          } else {
            toggle.style.left = `${finCoord}px`;
          }

          msg = {
            order: that.info.order,
            newCoord: finCoord,
          };

          that.sendMessageToUpdateLabel(msg);
        }

        function onMouseUp() {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
          that.sendMessage(msg);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
      this.container.addEventListener('ondragstart', () => false);
    }
}

//*--------------------------------------------------------------------------------------------
//* ----SCALE-----------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------

class Scale extends InterfaceElement {
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
      const divs = this.scale.children;
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

//*--------------------------------------------------------------------------------------------
//* ----CONTROL PANEL---------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------

class ControlPanel extends InterfaceElement {
    showToggleLabelsCheckbox: HTMLElement;

    showScaleCheckbox: HTMLElement;

    minInput: HTMLElement;

    maxInput: HTMLElement;

    stepInput: HTMLElement;

    divNumInputsContainer: HTMLElement;

    smDivNumInput: HTMLElement;

    lDivNumInput: HTMLElement;

    isHorizontalRadio: HTMLElement;

    isVerticalRadio: HTMLElement;

    isSingleValRadio: HTMLElement;

    isRangeValRadio: HTMLElement

    toggleInputsContainer: HTMLElement;

    valTypeSelector: HTMLElement;

    textBeforeRadio: HTMLElement;

    textAfterRadio: HTMLElement;

    additTextForm: HTMLElement;

    additTextInput: HTMLElement;

    info: sliderInfo;

    constructor(info: sliderInfo) {
      super();
      this.info = info;
      this.render();
    }

    render(): void {
      this.container = this.createElement('div', 'slider__controlElements', this.info.idNum) as HTMLElement;
      this.toggleInputsContainer = this.createElement('div', 'slider__toggleControlContainer', this.info.idNum) as HTMLElement;
      this.divNumInputsContainer = this.createElement('div', 'slider__divNumInputsContainer', this.info.idNum) as HTMLElement;
      this.divNumInputsContainer.classList.add('hidden');
      const inputsContainer = this.createElement('div', 'slider__inputsContainer', this.info.idNum);
      const viewRadioContainer = this.createElement('div', 'slider__radioContainer', this.info.idNum);

      this.showToggleLabelsCheckbox = this.createInput('slider__check slider__showValsCheck', 'checkbox');
      this.showScaleCheckbox = this.createInput('slider__check slider__showScaleCheck', 'checkbox');
      this.minInput = this.createInput('slider__input slider__input_min', 'text', '', `${this.info.minValue}`);
      this.maxInput = this.createInput('slider__input slider__input_max', 'text', '', `${this.info.maxValue}`);
      this.stepInput = this.createInput('slider__input slider__input_step', 'text', '', `${this.info.step}`);
      this.smDivNumInput = this.createInput('slider__input slider__input_smDivNum', 'text', '', `${this.info.smDivNum}`);
      this.lDivNumInput = this.createInput('slider__input slider__input_lDivNum', 'text', '', `${this.info.lDivNum}`);
      this.isHorizontalRadio = this.createInput('slider__viewRadio slider__viewRadio_horizontal', 'radio', `slider__viewRadio -${this.info.idNum}`, 'horizontal', '');
      this.isVerticalRadio = this.createInput('slider__viewRadio slider__viewRadio_vertical', 'radio', `slider__viewRadio -${this.info.idNum}`, 'vertical', '');
      this.isSingleValRadio = this.createInput('slider__isRangeRadio slider__isRangeRadio_single', 'radio', `slider__isRangeRadio-${this.info.idNum}`, 'single', '');
      this.isRangeValRadio = this.createInput('slider__isRangeRadio slider__isRangeRadio_range', 'radio', `slider__isRangeRadio-${this.info.idNum}`, 'range', '');

      const checkboxLabel = this.createLabel('slider__checkLabel slider__showValsCheckLabel', 'Показать значения ползунков', this.showToggleLabelsCheckbox.id);
      const scaleChecboxLabel = this.createLabel('slider__checkLabel slider__showScaleCheckLabel', 'Показать шкалу', this.showScaleCheckbox.id);
      const minInputLabel = this.createLabel('slider__inputLabel slider__inputLabel_min', 'Min:', this.minInput.id);
      const maxInputLabel = this.createLabel('slider__inputLabel slider__inputLabel_max', 'Max:', this.maxInput.id);
      const stepInputLabel = this.createLabel('slider__inputLabel slider__inputLabel_step', 'Шаг:', this.maxInput.id);
      const divInputsCommonLabel = this.createLabel('slider__inputDivNumCommonLabel', 'Число промежутков:');
      const smDivNumLabel = this.createLabel('slider__inputLabel slider__inputLabel_smDivNum', 'Дополнительные:', this.smDivNumInput.id);
      const lDivNumInputLabel = this.createLabel('slider__inputLabel slider__inputLabel_lDivNum', 'Основные:', this.lDivNumInput.id);
      const radioCommonLabel = this.createLabel('slider__radioCommonLabel', 'Вид слайдера:');
      const radioHorizontalLabel = this.createLabel('slider__radioLabel', 'Горизонтальный', this.isHorizontalRadio.id);
      const radioVerticalLabel = this.createLabel('slider__radioLabel', 'Вертикальный', this.isVerticalRadio.id);
      const radioRangeLabel = this.createLabel('slider__radioCommonLabel', 'Тип значения:');
      const radioSingleValLabel = this.createLabel('slider__radioLabel', 'Значение', this.isSingleValRadio.id);
      const radioRangeValLabel = this.createLabel('slider__radioLabel', 'Интервал', this.isRangeValRadio.id);

      if (this.info.isVertical) {
        this.isVerticalRadio.setAttribute('checked', 'true');
      } else {
        this.isHorizontalRadio.setAttribute('checked', 'true');
      }

      if (this.info.isRange) {
        this.isRangeValRadio.setAttribute('checked', 'true');
      } else {
        this.isSingleValRadio.setAttribute('checked', 'true');
      }

      this.container.append(this.showToggleLabelsCheckbox);
      this.container.append(checkboxLabel);
      this.container.append(this.addValTypeSelection());
      this.container.append(this.showScaleCheckbox);
      this.container.append(scaleChecboxLabel);

      this.container.append(this.divNumInputsContainer);
      this.divNumInputsContainer.append(divInputsCommonLabel);
      this.divNumInputsContainer.append(lDivNumInputLabel);
      lDivNumInputLabel.append(this.lDivNumInput);
      this.divNumInputsContainer.append(smDivNumLabel);
      smDivNumLabel.append(this.smDivNumInput);

      this.container.append(inputsContainer);
      inputsContainer.append(minInputLabel);
      minInputLabel.append(this.minInput);
      inputsContainer.append(maxInputLabel);
      maxInputLabel.append(this.maxInput);
      inputsContainer.append(stepInputLabel);
      stepInputLabel.append(this.stepInput);

      if (this.info.valType === 'integer' || this.info.valType === 'float') {
        this.container.append(this.addAdditTextInput());
      }

      this.container.append(viewRadioContainer);
      viewRadioContainer.append(radioCommonLabel);
      viewRadioContainer.append(this.isHorizontalRadio);
      viewRadioContainer.append(radioHorizontalLabel);
      viewRadioContainer.append(this.isVerticalRadio);
      viewRadioContainer.append(radioVerticalLabel);
      viewRadioContainer.append(radioRangeLabel);
      viewRadioContainer.append(this.isSingleValRadio);
      viewRadioContainer.append(radioSingleValLabel);
      viewRadioContainer.append(this.isRangeValRadio);
      viewRadioContainer.append(radioRangeValLabel);

      this.container.append(this.toggleInputsContainer);
    }

    createInput(className: string, type = 'text', name?: string, value?: string, placeholder?: string, isChecked?: boolean): HTMLElement {
      const newInput = this.createElement('input', className, this.info.idNum) as HTMLElement;
      newInput.setAttribute('type', type);
      if (name !== undefined && name !== '') {
        newInput.setAttribute('name', name);
      }
      if (value !== undefined && value !== '') {
        newInput.setAttribute('value', value);
      }
      if (placeholder !== undefined && placeholder !== '') {
        newInput.setAttribute('placeholder', placeholder);
      }
      if (isChecked !== undefined) {
        newInput.setAttribute('checked', `${isChecked}`);
      }
      return newInput;
    }

    createLabel(className: string, text?: string, forAttr?: string): HTMLElement {
      const newLabel = this.createElement('label', className, this.info.idNum) as HTMLElement;
      if (forAttr) {
        newLabel.setAttribute('for', forAttr);
      }
      if (text) {
        newLabel.innerHTML = text;
      }
      return newLabel;
    }

    addToggleInput(toggleOrder: number, value: string, listener: any) {
      const idPostfix = toggleOrder + 1;
      const toggleControl = document.createElement('div');
      toggleControl.setAttribute('class', 'slider__toggleControl');
      toggleControl.setAttribute('id', `slider__toggleControl-${this.info.idNum}-${idPostfix}`);

      const toggleValueField = this.createInput('slider__toggleValueField', 'text', '', '');
      toggleValueField.setAttribute('id', `${toggleValueField.getAttribute('id')}-${idPostfix}`);
      toggleValueField.setAttribute('data-toggleNum', `${toggleOrder}`);
      toggleValueField.setAttribute('value', value);

      const toggleValueFieldLabel = this.createLabel('slider__toggleValueFieldLabel', `${idPostfix}: `, toggleValueField.id);
      toggleValueFieldLabel.setAttribute('id', `${toggleValueFieldLabel.getAttribute('id')}-${idPostfix}`);

      this.toggleInputsContainer.append(toggleControl);
      toggleControl.append(toggleValueFieldLabel);
      toggleControl.append(toggleValueField);
      toggleValueField.addEventListener('change', listener);
    }

    reloadInputs() {
      const minInpLabel = this.minInput.parentElement as HTMLElement;
      this.minInput.remove();
      this.minInput = this.createInput('slider__input slider__input_min', 'text', '', `${this.info.minValue}`);
      minInpLabel.append(this.minInput);
      const maxInpLabel = this.maxInput.parentElement as HTMLElement;
      this.maxInput.remove();
      this.maxInput = this.createInput('slider__input slider__input_max', 'text', '', `${this.info.maxValue}`);
      maxInpLabel.append(this.maxInput);
      const stepInpLabel = this.stepInput.parentElement as HTMLElement;
      this.stepInput.remove();
      this.stepInput = this.createInput('slider__input slider__input_step', 'text', '', `${this.info.step}`);
      stepInpLabel.append(this.stepInput);
    }

    addAdditTextInput(): HTMLElement {
      this.additTextForm = this.createElement('form', 'slider__additTextForm', this.info.idNum) as HTMLElement;
      const label = this.createLabel('slider__additTextLabel slider__additTextLabel_common', 'Добавить текст ');
      this.textBeforeRadio = this.createInput('slider__additTextRadio slider__additTextRadio_before', 'radio', `slider__additTextRadio-${this.info.idNum}`, 'textBefore');
      this.textAfterRadio = this.createInput('slider__additTextRadio slider__additTextRadio_after', 'radio', `slider__additTextRadio-${this.info.idNum}`, 'textAfter');
      const textBeforeLabel = this.createLabel('slider__additTextLabel slider__additTextLabel_before', 'перед значением', this.textBeforeRadio.id);
      const textAfterLabel = this.createLabel('slider__additTextLabel slider__additTextLabel_after', 'после значения', this.textAfterRadio.id);
      this.additTextInput = this.createInput('slider__additTextInput', 'text');
      const labelSec = this.createLabel('slider__additTextLabel slider__additTextLabel_common', '/');

      this.additTextForm.append(label);
      this.additTextForm.append(this.textBeforeRadio);
      this.additTextForm.append(textBeforeLabel);
      this.additTextForm.append(labelSec);
      this.additTextForm.append(this.textAfterRadio);
      this.additTextForm.append(textAfterLabel);
      this.additTextForm.append(this.additTextInput);

      if (this.info.valType === 'latin' || this.info.valType === 'cyrillic') {
        this.toHideAdditTextInput(true);
      }

      if (this.info.additText) {
        // eslint-disable-next-line no-unused-expressions
        this.info.isAdditTextAfter
          ? this.textAfterRadio.setAttribute('checked', 'true')
          : this.textBeforeRadio.setAttribute('checked', 'true');
      } else {
        this.textBeforeRadio.setAttribute('checked', 'true');
      }

      return this.additTextForm;
    }

    toHideAdditTextInput(toHide: boolean) {
      if (toHide && !this.additTextForm.classList.contains('hidden')) {
        this.additTextForm.classList.add('hidden');
      } else if (!toHide && this.additTextForm.classList.contains('hidden')) {
        this.additTextForm.classList.remove('hidden');
      }
    }

    addValTypeSelection(): HTMLElement {
      const form = this.createElement('form', 'slider__valTypeForm', this.info.idNum) as HTMLElement;

      this.valTypeSelector = this.createElement('select', 'slider__valTypeSelect', this.info.idNum) as HTMLElement;
      this.valTypeSelector.setAttribute('form', form.id);
      this.valTypeSelector.setAttribute('name', `valTypeSelect-${this.info.idNum}`);
      const intOption = this.createElement('option', 'slider__valTypeOption slider__valTypeOption_int', `${this.info.idNum}-${1}`);
      intOption.setAttribute('value', 'integer');
      intOption.innerHTML = 'Целые числа';
      if (this.info.valType === 'integer') {
        intOption.setAttribute('selected', 'true');
      }
      const floatOption = this.createElement('option', 'slider__valTypeOption slider__valTypeOption_float', `${this.info.idNum}-${2}`);
      floatOption.setAttribute('value', 'float');
      floatOption.innerHTML = 'Десятичные дроби';
      if (this.info.valType === 'float') {
        floatOption.setAttribute('selected', 'true');
      }
      const latinOption = this.createElement('option', 'slider__valTypeOption slider__valTypeOption_latin', `${this.info.idNum}-${3}`);
      latinOption.setAttribute('value', 'latin');
      latinOption.innerHTML = 'Латиница';
      if (this.info.valType === 'latin') {
        latinOption.setAttribute('selected', 'true');
      }
      const cyrOption = this.createElement('option', 'slider__valTypeOption slider__valTypeOption_cyr', `${this.info.idNum}-${4}`);
      cyrOption.setAttribute('value', 'cyrillic');
      cyrOption.innerHTML = 'Кириллица';
      if (this.info.valType === 'cyrillic') {
        cyrOption.setAttribute('selected', 'true');
      }

      const label = this.createLabel('slider__selectLabel', 'Тип значения:', this.valTypeSelector.id);

      form.append(label);
      form.append(this.valTypeSelector);
      this.valTypeSelector.append(intOption);
      this.valTypeSelector.append(floatOption);
      this.valTypeSelector.append(latinOption);
      this.valTypeSelector.append(cyrOption);

      return form;
    }

    updateInfo(info: sliderInfo) {
      this.info = info;
    }
}

//*--------------------------------------------------------------------------------------------
//* ----VIEW------------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------

class View {
    // model: Model;
    info: sliderInfo;

    scale: Scale;

    controlPanel: ControlPanel;

    container: HTMLElement;

    observers: Array<Observer>;

    scaleObserver: Observer;

    constructor(info: sliderInfo, parentElement: Element) {
      this.info = info;
      this.observers = [];
      this.scale = new Scale(this.info);
      this.controlPanel = new ControlPanel(info);
      this.scaleObserver = new Observer(this.scaleObserverFunc.bind(this));
      this.render(parentElement);
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
    }

    render(parentElement: Element) {
      this.container = document.createElement('div');
      this.container.classList.add('slider__mainContainer');
      this.container.setAttribute('id', `slider__mainContainer-${this.info.idNum}`);

      this.container.append(this.scale.container);
      this.container.append(this.controlPanel.container);
      parentElement.append(this.container);
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
      const scaleDivs = this.scale.scale.children;
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
}

//*--------------------------------------------------------------------------------------------
//* ----CONTROLLER------------------------------------------------------------------------------
//*--------------------------------------------------------------------------------------------

class Controller {
    view: View;

    model: Model;

    viewObserver: Observer;

    constructor(model: Model, view: View) {
      this.model = model;
      this.view = view;
      this.viewObserver = new Observer(this.viewObserverFunc.bind(this));
      this.view.addObserver(this.viewObserver);
    }

    viewObserverFunc(newMsg: viewMsg) {
      this.model.updateInfo(newMsg);
      this.updateViewInfo();
    }

    updateViewInfo() {
      const newInfo = this.model.getSliderData();
      this.view.updateInfo(newInfo);
    }
}

function createSlider(info: sliderInfo, parentElement: Element) {
  const app = new Controller(new Model(info), new View(info, parentElement));
  console.log(app);
}

const container = document.querySelector('.slider-here');

createSlider({
  idNum: 1,
  minValue: 0,
  maxValue: 100,
  step: '5',
  isRange: false,
  togVals: [25],
  valType: 'integer',
  isVertical: false,
  smDivNum: 5,
  lDivNum: 4,
}, container);



export { Observer }
export { Observable }
export { InterfaceElement }
export { Model }
export { Toggle }
export { Scale }
export { ControlPanel }
export { View }
export { Controller }
export { createSlider }