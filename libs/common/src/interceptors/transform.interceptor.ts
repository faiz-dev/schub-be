import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Bypass interceptor for OpenAPI/Swagger JSON documents
        if (data && data.openapi) {
          return data;
        }

        // Handle PageDto pagination objects directly
        if (data && data.meta && Array.isArray(data.data)) {
          return {
            success: true as const,
            message: data.message || 'Success',
            data: data.data,
            meta: data.meta,
          };
        }

        return {
          success: true as const,
          message: data?.message || 'Success',
          data: data?.message ? data.data ?? data : data,
        };
      }),
    );
  }
}
