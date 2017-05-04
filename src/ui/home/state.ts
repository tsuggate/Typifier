import {renderHome} from './home';


export type ViewMode = 'code' | 'log';

export interface State {
   viewMode: ViewMode;
}


let state: State = {
   viewMode: 'code'
};

export function getState(): State {
   return state;
}

export function setViewMode(viewMode: ViewMode): void {
   state.viewMode = viewMode;
   renderHome();
}

