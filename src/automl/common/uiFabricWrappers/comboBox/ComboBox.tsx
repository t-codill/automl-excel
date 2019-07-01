import * as _ from "lodash";
import * as React from "react";

import { ComboBox as FabricComboBox, DirectionalHint, IComboBox, IComboBoxOption, IComboBoxOptionStyles, IIconProps, SelectableOptionMenuItemType } from "office-ui-fabric-react";
import "./ComboBox.scss";

export interface IProps {
  allowFreeform?: boolean;
  buttonIconProps?: IIconProps;
  className?: string;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
  text?: string;
  placeholder?: string;
  options: IComboBoxOption[];
  initialSelectedKey?: string;
  asSearchBox?: boolean;
  focusOnInitially?: boolean;
  id?: string;
  required?: boolean;
  errorMessage?: string;
  comboBoxOptionStyles?: Partial<IComboBoxOptionStyles>;
  onOptionSelection(selectedKey?: string): void;
  onBlur?(): void;
  onClick?(event: React.MouseEvent<IComboBox, MouseEvent>): void;
}

interface IState {
  options: IComboBoxOption[];
  selectedKey?: string;
}

export class ComboBox extends React.Component<IProps, IState> {
  private readonly comboBoxCalloutId: string;
  private readonly comboBoxRef: React.RefObject<IComboBox> = React.createRef<IComboBox>();

  constructor(props: IProps) {
    super(props);
    this.comboBoxCalloutId = `combobox-callout-${_.uniqueId()}`;

    this.state = {
      options: this.props.options,
      selectedKey: this.props.initialSelectedKey,
    };
  }

  public componentDidMount(): void {
    if (this.props.focusOnInitially) {
      this.openComboBox();
    }
  }

  public componentWillReceiveProps(nextProps: IProps): void {
    if (nextProps.options !== this.props.options) {
      this.setState({
        options: nextProps.options
      });
    }
  }

  public render(): React.ReactNode {

    const placeholder = this.props.loading ? "Loading..." : (this.props.placeholder || "Select or search by name");
    const cssClass = this.props.asSearchBox ? "as-search-box" : "";
    const selectedKey = this.state.selectedKey || this.props.initialSelectedKey;

    return (
      <div className={`combo-box user-input-box ${cssClass}`} id={`${this.props.id || ""}`}>
        <FabricComboBox
          comboBoxOptionStyles={this.props.comboBoxOptionStyles}
          label={this.props.label}
          buttonIconProps={this.props.buttonIconProps}
          className={this.props.className}
          disabled={this.props.disabled}
          placeholder={placeholder}
          options={this.state.options}
          selectedKey={selectedKey}
          text={this.props.text}
          onChange={this.onOptionSelection}
          onPendingValueChanged={_.debounce(this.onValueChange, 100)}
          errorMessage={this.props.errorMessage}
          allowFreeform={true}
          autoComplete={this.props.allowFreeform ? "off" : "on"}
          useComboBoxAsMenuWidth={true}
          onClick={this.handleOnClick}
          onFocus={this.openComboBox}
          onMenuDismissed={this.props.onBlur}
          required={this.props.required}
          calloutProps={{ id: this.comboBoxCalloutId, directionalHint: DirectionalHint.bottomLeftEdge, directionalHintFixed: true }}
          componentRef={this.comboBoxRef}
          styles={{ optionsContainerWrapper: { maxHeight: 400 } }}
        />
      </div>
    );
  }

  private readonly handleOnClick = (event: React.MouseEvent<IComboBox, MouseEvent>) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    this.openComboBox();
  }

  private readonly onOptionSelection = (_e: React.FormEvent<IComboBox>, selectedOption?: IComboBoxOption, _index?: number, typedText?: string): void => {
    let selectedKey: string | undefined;

    if (selectedOption && !selectedOption.disabled) {
      selectedKey = selectedOption.key as string;
    } else if (typedText) {
      if (this.props.allowFreeform) {
        selectedKey = typedText.trim();
      } else if (this.state.options.length > 0) {
        const matchOption = this.state.options.find((option) =>
          !option.disabled &&
          option.itemType !== SelectableOptionMenuItemType.Header &&
          option.itemType !== SelectableOptionMenuItemType.Divider
        );
        if (matchOption) {
          selectedKey = matchOption.key as string;
        }
      }
    }

    this.setState(
      { selectedKey, options: this.props.options },
      () => { this.props.onOptionSelection(selectedKey); }
    );
  }

  private readonly onValueChange = (_option?: IComboBoxOption, _index?: number, typedText?: string): void => {
    if (typedText === undefined) { return; }
    this.openComboBox();

    const regEx = new RegExp(`(.*?)(${_.escapeRegExp(typedText)})(.*)`, "i");
    let newOptions = [];

    for (const option of this.props.options) {
      if (option.itemType === SelectableOptionMenuItemType.Header) {
        newOptions.push(option);
        continue;
      }

      const match = option.text.match(regEx);
      if (match) {
        const newOption = { ...option };
        newOption.data = `<span>${match[1] || ""}<span class="match">${match[2]}</span>${match[3] || ""}</span>`;
        newOptions.push(newOption);
      }
    }

    // Remove headers with no selected options beneath them
    newOptions = newOptions.filter((option, index, _newOptions) => {
      const nextOption = _newOptions[index + 1];

      return option.itemType !== SelectableOptionMenuItemType.Header || (
        option.itemType === SelectableOptionMenuItemType.Header &&
        nextOption && nextOption.itemType !== SelectableOptionMenuItemType.Header
      );
    });

    this.setState({ options: newOptions });
  }

  private readonly openComboBox = (): void => {
    if (this.comboBoxRef.current) {
      this.comboBoxRef.current.focus(true);
    }
  }
}
