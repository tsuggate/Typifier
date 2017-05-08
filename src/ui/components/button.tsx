import * as React from 'react';
import './button.less';


interface ButtonProps {
   onClick: React.MouseEventHandler<HTMLButtonElement>;
   children?: any;
   disabled?: boolean;
}

export default function Button(props: ButtonProps) {
   return (
      <button className="Button" onClick={props.onClick} disabled={props.disabled} >
         {props.children}
      </button>
   );
}

