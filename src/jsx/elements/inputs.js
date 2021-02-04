import React from 'react';
import PropTypes from 'prop-types';

export const FileInput = (props) => {
  const handleChange = (event) => {
    // Send current file to parent component
    const file = event.target.files[0] ? event.target.files[0] : '';
    props.onUserInput(props.id, file);
  };
  return (
    <>
      <label htmlFor={props.id}><b>{props.label}</b></label>
      <input
        type='file'
        id={props.id}
        name={props.name}
        accept={props.accept}
        onChange={handleChange}
      />
    </>
  );
};
FileInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  accept: PropTypes.string,
  onUserInput: PropTypes.func,
};

export const TextInput = (props) => {
  const handleChange = (event) => {
    // Send current file to parent component
    const value = event.target.value;
    props.onUserInput(props.id, value);
  };
  return (
    <>
      <label htmlFor={props.id}><b>{props.label}</b></label>
      <input
        type='text'
        id={props.id}
        name={props.name}
        accept={props.accept}
        value={props.value}
        onChange={handleChange}
        placeholder={props.placeholder}
      />
    </>
  );
};
TextInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onUserInput: PropTypes.func,
  placeholder: PropTypes.string,
};

export default {
  FileInput,
  TextInput,
};
