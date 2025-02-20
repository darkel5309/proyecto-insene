import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

// componente para entradas de texto
const EntradaTexto = ({ label, name, value, onChange, type, placeholder, disabled, error }) => {
    const valorInput = type === "number" ? (value === 0 ? "" : value) : value;
    return (
        <div>
            <label className="nombreCampo">{label}</label>
            <input
                className="campoTexto"
                name={name}
                value={valorInput}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
            />
            {error && <div className="error">{error}</div>}
        </div>
    );
};

EntradaTexto.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
};

EntradaTexto.defaultProps = {
    type: "text",
    placeholder: "",
    disabled: false,
    error: "",
};

// componente para entradas de texto de varias lineas
const EntradaTextoArea = ({ label, name, value, onChange, placeholder, error }) => {
    const entradaTextoInicial = useRef(null);

    useEffect(() => {
        if (entradaTextoInicial.current) {
            entradaTextoInicial.current.style.height = 'auto';
            entradaTextoInicial.current.style.height = `${entradaTextoInicial.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <div>
            <label className="nombreCampo">{label}</label>
            <textarea
                ref={entradaTextoInicial}
                className="campoTexto"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows="3"
                style={{ resize: "vertical", overflowY: "hidden", width: "100%" }}
            />
            {error && <div className="error">{error}</div>}
        </div>
    );
};

EntradaTextoArea.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
};

EntradaTextoArea.defaultProps = {
    placeholder: "",
    error: "",
};

// componente para entradas de radio
const EntradaRadio = ({ label, name, options, value, onChange, error }) => {
    return (
        <div>
            <label className="nombreCampo">{label}</label>
            <div className="opciones">
                {options.map((option) => (
                    <div key={option.value} className="opcion">
                        <input
                            type="radio"
                            id={`${name}_${option.value}`}
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                        />
                        <label htmlFor={`${name}_${option.value}`}>{option.label}</label>
                    </div>
                ))}
            </div>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

EntradaRadio.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};

// componente para entradas de select
const EntradaSelect = ({ label, name, value, onChange, error, options }) => {
    return (
        <div>
            <label className="nombreCampo">{label}</label>
            <select name={name} onChange={onChange} value={value}>
                <option value="">Selecciona una opción</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

EntradaSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export { EntradaTexto, EntradaTextoArea, EntradaRadio, EntradaSelect };