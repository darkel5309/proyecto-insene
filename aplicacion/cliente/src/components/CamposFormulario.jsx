import { React, useRef, useEffect } from "react";

const EntradaTexto = ({ label, name, value, onChange, type, placeholder, disabled, error }) => {
    return (
        <div>
            <label className="nombreCampo">{label}</label>
            <input
                className="campoTexto"
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
            />
            {error && <div className="error">{error}</div>}
        </div>
    );
};

const EntradaTextoArea = ({ label, name, value, onChange, placeholder, error }) => {
    const entradaTextoInicial = useRef(null);

    // ajustamos la altura dinamicamente
    useEffect(() => {
        if (entradaTextoInicial.current) {
            entradaTextoInicial.current.style.height = 'auto';
            entradaTextoInicial.current.style.height = `${entradaTextoInicial.current.scrollHeight}px`;
        }
    }, [value]);

    const handleChange = (e) => { onChange(e); };

    return (
        <div>
            <label className="nombreCampo">{label}</label>
            <textarea
                ref={entradaTextoInicial}
                className="campoTexto"
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                rows="3"
                style={{ resize: "none", overflowY: "hidden", width: "100%" }}
            />
            {error && <div className="error">{error}</div>}
        </div>
    );
};

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

export { EntradaTexto, EntradaTextoArea, EntradaRadio, EntradaSelect };