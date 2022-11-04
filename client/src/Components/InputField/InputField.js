import React  from "react";

const InputField = ({label, name, placeholder, type, onChangeFunction, className, value }) => (
  <div className="form-group">
    {label && <label htmlFor="input-field">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      className={className}
      placeholder={placeholder}
      onChange={(e) => onChangeFunction(e.target.value)}
      required
      />
  </div>
);

export default InputField;