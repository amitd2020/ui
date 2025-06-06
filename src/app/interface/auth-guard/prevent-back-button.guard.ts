import { CanDeactivateFn } from '@angular/router';

export const preventBackButtonGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  if ( localStorage.getItem('access_token') ) {
    return true;
  }
  return false;
};
