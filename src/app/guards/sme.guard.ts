
import { CanMatchFn, Router } from '@angular/router';
import { RoleService } from '../services/common/role.service';
import { inject } from '@angular/core';

export const smeGuard: CanMatchFn = () => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  const allowed = roleService.role === 'SME';

  if (!allowed) {
    router.navigate(['/access-denied']);
    return false;
  }
  return true;
};