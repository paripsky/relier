import React from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.scss';

function Input({ placeholder }) {
  return <input className={styles.input} placeholder={placeholder} />;
}

Input.propTypes = {
  placeholder: PropTypes.string
};

Input.defaultProps = {
  placeholder: ''
};

export default Input;
