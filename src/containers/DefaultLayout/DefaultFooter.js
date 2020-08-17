import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ambalait from '../../assets/img/brand/ambalait.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span> <a href="http://banijjo.com.bd/">Banijjo.com.bd</a>&nbsp;&#9400; 2019 &nbsp; </span>
        <span className="ml-auto">Developed by <a href="http://www.ambalait.com/"><img src={ambalait} alt="AMBALA IT" height="40" width="90"/></a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
