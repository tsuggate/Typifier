import * as React from 'react';
import './button.less';


interface ButtonProps {
   onClick: React.MouseEventHandler<HTMLButtonElement>;
   on?: boolean;
   children?: any;
   disabled?: boolean;
   moreClasses?: string;
}

export default function Button(props: ButtonProps) {
   let classes = ['Button'];

   if (props.on) {
      classes.push('on');
   }

   if (props.disabled) {
      classes.push('disabled');
   }

   if (props.moreClasses) {
      classes = classes.concat(props.moreClasses.split(' '));
   }

   return (
      <button className={classes.join(' ')} onClick={props.onClick} disabled={props.disabled} >
         {props.children}
      </button>
   );
}

