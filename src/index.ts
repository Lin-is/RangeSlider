/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
import './index.css';
// import { Model } from './code/Model/Model';
// import { View } from './code/View/View';
import { Presenter } from './code/Presenter/Presenter';
import { sliderInfo } from './code/base';

function getTogValsFromDataAttr(attr: string, valType: string) {
  if (!attr) {
    return {}
  }
  let val1: string | number, val2: string | number;
  [val1, val2] = attr.split(' ');
  console.log('splitted vals', val1, val2);
  if (valType === 'integer' || valType === 'float') {
    val1 = +val1;
    val2 = +val2;
  }
  console.log('plused vals', val1, val2);
  return {
    firstTog: val1,
    secTog: val2
  }
}

function createSlider(info: sliderInfo, parentElement: HTMLElement) {

  const maxVal = parentElement.getAttribute("data-maxValue") ? parentElement.getAttribute("data-maxValue") : null;
  let maxValNum : number | string = maxVal;
  if (parentElement.getAttribute("data-valType") === 'integer' || parentElement.getAttribute("data-valType") === 'float') {
    maxValNum = +maxVal;
  }

  const minVal = parentElement.getAttribute("data-minValue") ? parentElement.getAttribute("data-minValue") : null;
  let minValNum : number | string = minVal;
  if (minVal && (parentElement.getAttribute("data-valType") === 'integer' || parentElement.getAttribute("data-valType") === 'float')) {
    minValNum = +minVal;
  }

  const togVals = getTogValsFromDataAttr(parentElement.getAttribute("data-togVals"), parentElement.getAttribute("data-valType"));
  console.log('togVals', togVals);


  const collectedData = {
    idNum: parentElement.getAttribute("data-idNum") ? +parentElement.getAttribute("data-idNum") : null,
    minValue: minValNum,
    maxValue: maxValNum,
    step: parentElement.getAttribute("data-step") ? parentElement.getAttribute("data-step") : null,
    isVertical: parentElement.getAttribute("data-isVertical") ? Boolean(+parentElement.getAttribute("data-isVertical")) : null,
    isRange: parentElement.getAttribute("data-isRange") ? Boolean(+parentElement.getAttribute("data-isRange")) : null,
    togVals: [togVals ? togVals.firstTog : null, togVals ? togVals.secTog : null],
    valType: parentElement.getAttribute("data-valType") ? parentElement.getAttribute("data-valType") : null,
    smDivNum: parentElement.getAttribute("data-smDivNum") ? +parentElement.getAttribute("data-smDivNum") : null,
    lDivNum: parentElement.getAttribute("data-lDivNum") ? +parentElement.getAttribute("data-lDivNum") : null,
    additText: parentElement.getAttribute("data-additText") ? parentElement.getAttribute("data-additText") : null,
    isAdditTextAfter: parentElement.getAttribute("data-isAdditTextAfter") ? Boolean(+parentElement.getAttribute("data-isAdditTextAfter")) : null, 
  }

  const allInfo: sliderInfo = {
    idNum: info.idNum ? info.idNum : collectedData.idNum,
    minValue: info.minValue ? info.minValue : collectedData.minValue,
    maxValue: info.maxValue ? info.maxValue : collectedData.maxValue,
    step: info.step ? info.step : collectedData.step,
    isVertical: info.isVertical ? info.isVertical : collectedData.isVertical,
    isRange: info.isRange ? info.isRange : collectedData.isRange,
    togVals: info.togVals ? info.togVals : collectedData.togVals,
    valType: info.valType ? info.valType : collectedData.valType,
    lDivNum: info.lDivNum ? info.lDivNum : collectedData.lDivNum,
    smDivNum: info.smDivNum ? info.smDivNum : collectedData.smDivNum,
    additText: info.additText ? info.additText : collectedData.additText,
    isAdditTextAfter: info.isAdditTextAfter ? info.isAdditTextAfter : collectedData.isAdditTextAfter,
  } 

  console.log("createSlider allInfo", allInfo);

  // const app = new Presenter(new Model(allInfo, parentElement), new View(allInfo, parentElement));
  const app = new Presenter(allInfo, parentElement);
}

function startSliders (infoList: Array<sliderInfo>) {
  const containers = document.querySelectorAll('.slider-here');
  const containersArr = Array.from(containers);
  console.log('containersArr', containersArr);
  for (let i:number = 0; i < containersArr.length; i++) {
    createSlider(infoList[i] ? infoList[i] : {}, (containersArr[i]) as HTMLElement);
  }
}

const infoList = [
  {
    idNum: 1,
    minValue: -100,
    maxValue: 100,
    step: '1',
    isVertical: true,
    isRange: true,
    togVals: [25, 90],
    valType: 'integer',
    smDivNum: 2,
    lDivNum: 10,
  },
  {
    idNum: 2,
    minValue: 'A',
    maxValue: 'n',
    step: '1',
    isVertical: true,
    isRange: true,
    togVals: ['K', 'a'],
    valType: 'latin',
    smDivNum: 2,
    lDivNum: 10,
  }

]

startSliders(infoList);

export { createSlider }