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
        id={props.id}
        name={props.name}
        accept={props.accept}
        type='file'
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
        id={props.id}
        name={props.name}
        accept={props.accept}
        type='text'
        value={props.value}
        onChange={handleChange}
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
};

export default {
  FileInput,
  TextInput,
};
