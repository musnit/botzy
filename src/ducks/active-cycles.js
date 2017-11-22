const ADD = 'app/active-cycles/add';

export default function reducer(state = [], action) {
  switch (action.type) {
    case ADD:
      return state.concat([action.cycle]);
    default:
      return state;
  }
}

export function addActiveCycle(cycle) {
  return { type: ADD, cycle };
}
