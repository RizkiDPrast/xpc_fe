export function login(state, user) {
  state.id = user.id;
  state.userName = user.userName;
  state.displayName = user.displayName;
  state.email = user.email;
  state.avatar = user.avatar;
  state.role = user.role;
}

export function logout(state) {
  state.id = undefined;
  state.userName = undefined;
  state.displayName = undefined;
  state.email = undefined;
  state.avatar = undefined;
  state.role = undefined;
}
