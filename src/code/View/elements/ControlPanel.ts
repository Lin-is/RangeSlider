import { InterfaceElement } from '../../base';
import { sliderInfo } from '../../base';

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


    this.container.append(this.addAdditTextInput());
    // if (this.info.valType === 'integer' || this.info.valType === 'float') {
      
    // }

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

export { ControlPanel }