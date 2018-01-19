import {Middleware} from 'redux'


export const actionToPlainObject: Middleware = api => next => action => {
   if (isObjectLike(action)) {
      const a = action as any
      return next({ ...a })
   }
   throw new Error(`action must be an object`)
}

function isObjectLike(val: any): boolean {
   return isPresent(val) && typeof val === 'object'
}

function isPresent(obj: any): boolean {
   return obj !== undefined && obj !== null
}
