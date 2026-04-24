package com.exclusive.blank.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private int code;
    private String message;
    private String error;
    private String errorType;
    private String requestPath;
    private String requestMethod;
    private LocalDateTime timestamp;
    private String suggestion;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(int code, String message, String error) {
        this.code = code;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }

    public static ErrorResponse tokenMissing() {
        ErrorResponse response = new ErrorResponse();
        response.setCode(401);
        response.setMessage("认证失败");
        response.setError("TOKEN_MISSING");
        response.setErrorType("TOKEN_MISSING");
        response.setSuggestion("请在请求头中添加有效的Authorization令牌，格式：Authorization: Bearer <token>");
        return response;
    }

    public static ErrorResponse tokenInvalid() {
        ErrorResponse response = new ErrorResponse();
        response.setCode(401);
        response.setMessage("认证失败");
        response.setError("TOKEN_INVALID");
        response.setErrorType("TOKEN_INVALID");
        response.setSuggestion("提供的令牌无效或已过期，请重新登录获取新的令牌");
        return response;
    }

    public static ErrorResponse tokenExpired() {
        ErrorResponse response = new ErrorResponse();
        response.setCode(401);
        response.setMessage("认证失败");
        response.setError("TOKEN_EXPIRED");
        response.setErrorType("TOKEN_EXPIRED");
        response.setSuggestion("令牌已过期，请使用refresh接口获取新的访问令牌，或重新登录");
        return response;
    }

    public static ErrorResponse accessDenied() {
        ErrorResponse response = new ErrorResponse();
        response.setCode(403);
        response.setMessage("访问被拒绝");
        response.setError("ACCESS_DENIED");
        response.setErrorType("ACCESS_DENIED");
        response.setSuggestion("您没有权限访问此资源，请联系管理员申请相应权限");
        return response;
    }

    public static ErrorResponse unauthorized(String message) {
        ErrorResponse response = new ErrorResponse();
        response.setCode(401);
        response.setMessage(message != null ? message : "未授权访问");
        response.setError("UNAUTHORIZED");
        response.setErrorType("UNAUTHORIZED");
        response.setSuggestion("请先登录或提供有效的认证凭证");
        return response;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getErrorType() {
        return errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }

    public String getRequestPath() {
        return requestPath;
    }

    public void setRequestPath(String requestPath) {
        this.requestPath = requestPath;
    }

    public String getRequestMethod() {
        return requestMethod;
    }

    public void setRequestMethod(String requestMethod) {
        this.requestMethod = requestMethod;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }
}
