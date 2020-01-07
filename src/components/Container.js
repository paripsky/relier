import React from 'react';
import PropTypes from 'prop-types';
import styles from './Container.module.scss';

function Container({ children, direction, justify, fillHeight }) {
  return (
    <div
      className={`${styles.container} ${styles['display-inline-flex']} ${
        styles['flex-' + direction]
      } ${styles['justify-' + justify]} ${
        fillHeight ? styles['fill-height'] : ''
      }`}
    >
      {children}
    </div>
  );
}

Container.propTypes = {
  direction: PropTypes.oneOf(['row', 'column']),
  justify: PropTypes.oneOf(['center', 'start', 'end']),
  fillHeight: PropTypes.bool
};

Container.defaultProps = {
  direction: 'row',
  justify: 'start',
  fillHeight: false
};

export default Container;
