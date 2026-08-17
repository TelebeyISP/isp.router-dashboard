import { Component } from 'react';
import PropTypes from 'prop-types';
import JsonSchemaForm from 'react-jsonschema-form';
import Modal from './Modal';
import Spinner from './Spinner';
import Confirm from './Confirm';

const REQUIRED_FIELD_SYMBOL = "*";

const CustomTitleField = props => {
  const { id, title, required } = props;
  const legend = required ? title + REQUIRED_FIELD_SYMBOL : title;
  return <legend id={id} style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem' }}>{legend}</legend>;
};

const fields = {
  TitleField: CustomTitleField,
};

function Label(props) {
  const { label, id } = props;
  if (!label) return <div />;
  return (
    <label className="telebey-label" htmlFor={id}>
      {label}
    </label>
  );
}

const CustomFieldTemplate = props => {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    displayLabel,
  } = props;

  if (hidden) return children;

  return (
    <div className={classNames} style={{ marginBottom: '1rem' }}>
      {displayLabel && <Label label={label} id={id} />}
      {displayLabel && description ? <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.35rem' }}>{description}</div> : null}
      {children}
      {errors}
      {help}
    </div>
  );
};

const transformErrors = errors => {
  return errors.map(error => {
    if (error.schema.messages && error.schema.messages[error.name]) {
      return {
        ...error,
        message: error.schema.messages[error.name]
      };
    }
    return error;
  });
};

class Form extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    schema: PropTypes.object,
    uiSchema: PropTypes.object,
    formData: PropTypes.object,
    isLoading: PropTypes.bool,
    validate: PropTypes.func,
    onHide: PropTypes.func,
    onSubmit: PropTypes.func,
    onError: PropTypes.func
  };

  static defaultProps = {
    visible: false,
    title: ""
  };

  state = {};

  componentWillReceiveProps(nextProps) {
    if (this.props.visible === false && nextProps.visible === true) {
      this.setState({ 
        formData: nextProps.formData,
        disabled: false,
        editing: false,
        confirm: false,
        disableSubmitButton: true
      });
    }
  }

  handleChange = data => {
    const { onChange } = this.props;
    let formDataChanged = null;  
    if (onChange) {
       formDataChanged = onChange(data.formData);
    }
    this.setState({
      editing: true,
      disableSubmitButton: (Object.keys(data.errors).length > 0),
      formData: formDataChanged ? formDataChanged : data.formData
    });
  };

  handleSubmit = data => {
    const { onSubmit } = this.props;
    onSubmit(data.formData);
  };

  handleSubmitButton = () => {
    this.setState({
      disabled: true,
      disableSubmitButton: true
    });
    if (this.submitButton) {
      this.submitButton.click();
    }
  };

  handleOutside = () => {
    const { onHide } = this.props;
    if (this.state.editing === true) {
      this.setState({ confirm: true });
    } else {
      onHide();
    }
  };

  handleClose = () => {
    const { onHide } = this.props;
    this.setState({ confirm: false });
    onHide();
  };

  render() {
    const {
      handleChange,
      handleSubmit,
      handleSubmitButton,
      handleOutside,
      handleClose
    } = this;

    const {
      visible,
      title,
      schema,
      uiSchema,
      isLoading,
      validate,
      onError
    } = this.props;

    const {
      disabled,
      disableSubmitButton,
      formData
    } = this.state;

    if (!visible) return null;

    return (
      <div>
        <Modal 
          visible={visible} 
          onOutside={handleOutside}
          disableOnClickOutside={this.state.confirm}
        >
          <div className="telebey-card" style={{ width: this.props.width || '40rem', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div className="telebey-card-header">
              <h3 className="telebey-card-title">{title}</h3>
              <button 
                onClick={handleOutside} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.25rem', padding: '0.25rem' }}
              >
                ×
              </button>
            </div>
            
            <div className="telebey-card-body" style={{ overflowY: 'auto', maxHeight: this.props.height || '60vh' }} id="nprogress-base-form">
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <Spinner />
                </div>
              )}
              {!isLoading && (
                <JsonSchemaForm
                  schema={schema}
                  uiSchema={
                    disabled ? { "ui:disabled": true, ...uiSchema } : { ...uiSchema }
                  }
                  formData={formData}
                  disableSubmitButton={disableSubmitButton}
                  fields={fields}
                  FieldTemplate={CustomFieldTemplate}
                  liveValidate
                  validate={validate}
                  showErrorList={false}
                  transformErrors={transformErrors}
                  autocomplete="off"
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onError={onError}
                >
                  <div>
                    <button type="submit" ref={(el => this.submitButton = el)} style={{ display: 'none' }} />
                  </div>
                </JsonSchemaForm>
              )}
            </div>

            <div className="telebey-card-footer">
              <button 
                className="telebey-btn telebey-btn-secondary" 
                disabled={disabled} 
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                className="telebey-btn telebey-btn-primary" 
                disabled={disabled || disableSubmitButton} 
                onClick={handleSubmitButton}
              >
                Save Configuration
              </button>
            </div>
          </div>  
        </Modal>

        <Confirm 
          visible={this.state.confirm} 
          message="You have unsaved changes. Are you sure you want to close?"
          buttons={[
            { text: "DISCARD CHANGES", action: handleClose, danger: true },
            { text: "KEEP EDITING", action: () => this.setState({ confirm: false }), info: true }
          ]}
        />
      </div>
    );
  }
}

export default Form;
