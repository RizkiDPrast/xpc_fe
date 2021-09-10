/*
export function someMutation (state) {
}
*/

export function printDepositOnSave(state, val = false) {
  state.autoPrintDepositOnSave = val;
}

export function printSalesOnSave(state, val = false) {
  state.autoPrintSalesOnSave = val;
}

export function updateDefaultShowAllClients(state, val = false) {
  state.defaultShowClientFromAllBranches = val;
}
