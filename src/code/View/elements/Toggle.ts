import { InterfaceElement } from '../../base';
import { Observer } from '../../base';
import { toggleMsg } from '../../base';
import { sliderInfo } from '../../base';

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

    function onDown (event: MouseEvent | TouchEvent) {
      let shift: number;
      let newCoord: number;
      let eventClient: number;
      let msg: toggleMsg;

      event.preventDefault();

      if (that.info.isVertical) {
        if (event instanceof MouseEvent) {
          shift = event.clientY - toggle.getBoundingClientRect().top;
        } else {
          shift = event.targetTouches[0].clientY - toggle.getBoundingClientRect().top;
        }
      } else {
        if (event instanceof MouseEvent) {
          shift = event.clientX - toggle.getBoundingClientRect().left;
        } else {
          shift = event.targetTouches[0].clientX - toggle.getBoundingClientRect().left;
        }
      }

      function onMouseMove(e: MouseEvent | TouchEvent) {
        if (that.info.isVertical) {
          if (e instanceof MouseEvent) {
            eventClient = e.clientY;
          } else {
            eventClient = e.targetTouches[0].clientY;
          }
        } else {
          if (e instanceof MouseEvent) {
            eventClient = e.clientX;
          } else {
            eventClient = e.targetTouches[0].clientX;
          }
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
        document.removeEventListener('touchend', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchmove', onMouseMove);
        that.sendMessage(msg);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchend', onMouseUp);
    };
    toggle.addEventListener('mousedown', onDown);
    toggle.addEventListener('touchstart', onDown);
    this.container.addEventListener('ondragstart', () => false);
  }
}

export { Toggle }