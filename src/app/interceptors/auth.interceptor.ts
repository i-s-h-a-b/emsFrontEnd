import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RoleService } from '../services/common/role.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const roleService = inject(RoleService);
    const token = roleService.token;

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};
