// turista.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './services/user.service';

export const turistaGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  const user = localStorage.getItem("user");
  
  if (!user) {
    router.navigate(['']);
    return false;
  }
  
  return userService.getUser(user).toPromise().then(userData => {
    if (userData && userData.tip === 'turista' && userData.status === 'odobren') {
      return true;
    } else {
      router.navigate(['']);
      return false;
    }
  }).catch(() => {
    router.navigate(['']);
    return false;
  });
};