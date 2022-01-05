interface sliderInfo {
  idNum?: number,
  minValue?: number | string,
  maxValue?: number | string,
  step?: string,
  isVertical?: boolean,
  isRange?: boolean,
  togVals?: Array<number | string>,
  valType?: string,
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
    if (!(tag && className)) {
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

export { Observer }
export { Observable }
export { InterfaceElement }
export { sliderInfo }
export { toggleMsg }
export { scaleMsg }
export { viewMsg }