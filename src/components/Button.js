import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.scss';

function Button({ children, onClick, varient }) {
  return (
    <button className={styles['button-' + varient]} onClick={onClick}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  small: PropTypes.bool,
  varient: PropTypes.oneOf(['regular', 'outline'])
};

Button.defaultProps = {
  varient: 'regular'
};

export default Button;
