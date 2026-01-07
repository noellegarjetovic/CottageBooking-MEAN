// admin.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  const user = localStorage.getItem("user");
  
  if (!user) {
    router.navigate(['/loginAdmin']);
    return false;
  }
  
  return userService.getUser(user).toPromise().then(userData => {
    if (!userData) {
      return true;
    } else {
      router.navigate(['/loginAdmin']);
      return false;
    }
  }).catch(() => {
    router.navigate(['/loginAdmin']);
    return false;
  });
};