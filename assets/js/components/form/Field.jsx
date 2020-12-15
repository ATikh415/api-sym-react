import React from 'react';


const Field = ({ name, label, value, onChange, type = "text", placeholder = "", error = "" }) => {
    return ( 
        <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input 
            value={value}
            onChange={onChange}
            type={type} 
            id={name} 
            name={name} 
            className={"form-control " + (error && "is-invalid")}
            placeholder={placeholder || label}
        />
        {error && <p className="invalid-feedback">{error}</p>}
    </div>
     );
}
 
export default Field;