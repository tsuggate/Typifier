import * as _ from 'underscore';

function maker() {
   return 'hi';
}

// export { maker };

export default _.extend({}, {
   num: 5
});