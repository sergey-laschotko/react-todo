// @flow
import React from 'react';
import './Button.css';

type ButtonProps = {
  submit?: boolean,
  iconButton?: boolean,
  classes?: string[],
  onClick: () => any,
  children: any,
  dataTestId?: string
};

const Button = ({
  submit = false,
  iconButton = false,
  classes = [],
  onClick = () => undefined,
  children = '',
  dataTestId = ''
}: ButtonProps) => {
  const buttonClasses = ['button', ...classes];
  const buttonType = submit ? 'submit' : 'button';

  if (iconButton) {
    buttonClasses.push('icon-button');
  }

  return (
    <button
      type={buttonType}
      className={buttonClasses.join(' ')}
      data-testid={dataTestId}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  submit: false,
  iconButton: false,
  dataTestId: '',
  classes: []
};

export default Button;
