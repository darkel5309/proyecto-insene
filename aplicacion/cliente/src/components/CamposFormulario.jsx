import { memo } from 'react';
import { Field, ErrorMessage } from 'formik';
import { Form as BootstrapForm, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CamposFormulario = ({ label, name, type = 'text', as, children, placeholder, disabled = false, tooltip, errors, touched, }) => {
    const fieldId = `field-${name}`;
    const hasError = Boolean(errors[name] && touched[name]);

    return (
        <BootstrapForm.Group controlId={fieldId}>
            {tooltip ? (
                <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-${name}`}>{tooltip}</Tooltip>} >
                    <BootstrapForm.Label>{label}</BootstrapForm.Label>
                </OverlayTrigger>
            ) : (
                <BootstrapForm.Label>{label}</BootstrapForm.Label>
            )}

            <Field
                id={fieldId}
                name={name}
                type={type}
                as={as}
                className={`form-control${hasError ? ' is-invalid' : ''}`}
                placeholder={placeholder}
                disabled={disabled}
                aria-label={label}
                aria-invalid={hasError}
                aria-describedby={hasError ? `error-${name}` : undefined}
            >
                {children}
            </Field>

            <ErrorMessage name={name} component="div" className="text-danger" id={`error-${name}`} role="alert" />
        </BootstrapForm.Group>
    );
};

CamposFormulario.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
    children: PropTypes.node,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    tooltip: PropTypes.string,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
};

export default memo(CamposFormulario);
