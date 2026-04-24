package com.exclusive.blank.exception;

import com.exclusive.blank.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, WebRequest request) {
        logger.error("业务异常 | 错误码: {} | 消息: {} | 请求路径: {}",
            e.getErrorCode().getCode(), e.getMessage(), request.getDescription(false));

        ErrorResponse response = new ErrorResponse();
        response.setCode(e.getErrorCode().getCode());
        response.setMessage(e.getMessage());
        response.setError(e.getErrorCode().getMessage());
        response.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException e, WebRequest request) {
        logger.error("访问被拒绝 | 消息: {} | 请求路径: {}",
            e.getMessage(), request.getDescription(false));

        ErrorResponse response = ErrorResponse.accessDenied();
        response.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException e, WebRequest request) {
        logger.error("认证异常 | 消息: {} | 请求路径: {}",
            e.getMessage(), request.getDescription(false));

        ErrorResponse response = ErrorResponse.unauthorized(e.getMessage());
        response.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorResponse> handleException(Exception e, WebRequest request) {
        logger.error("服务器内部错误 | 异常类型: {} | 消息: {} | 请求路径: {}",
            e.getClass().getName(), e.getMessage(), request.getDescription(false), e);

        ErrorResponse response = new ErrorResponse();
        response.setCode(500);
        response.setMessage("服务器内部错误");
        response.setError("INTERNAL_SERVER_ERROR");
        response.setSuggestion("请联系系统管理员或稍后重试");
        response.setTimestamp(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
