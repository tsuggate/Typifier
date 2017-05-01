import * as React from 'react';
import './button.less';

export type ButtonColour = 'blue' | 'transparent';

interface ButtonProps {
   colour: ButtonColour;
   onClick: React.MouseEventHandler<HTMLButtonElement>;
   children?: any;
   disabled?: boolean;
}

export default function Button(props: ButtonProps) {
   const className = [
      'Button',
      getColourClass(props.colour)
   ].join(' ');

   return (
      <button className={className} onClick={props.onClick} disabled={props.disabled} >
         {props.children}
      </button>
   );
}


function getColourClass(colour: ButtonColour) {
   switch (colour) {
      case 'blue':
         return 'Button-blue';
      case 'transparent':
         return 'Button-transparent';

      default:
         throw new Error(`Invalid colour name: ${colour}`);
   }
}
