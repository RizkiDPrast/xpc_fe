export function loaded(state) {
  state.loaded = true;
}

export function selectedRoom(state, room) {
  state.selectedRoom = Object.assign({}, room);
}

export function toggleMiniLeft(state) {
  state.miniLeft = !state.miniLeft;
}

export function hubRoom(state, model) {
  state.hubRoom = JSON.parse(JSON.stringify(model));
}

export function inPatientCount(state, count){
  state.inPatientCount = count || 0
}
