package com.exclusive.blank.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ApiResponse<T> {
    @JsonProperty("code")
    private int code;

    @JsonProperty("message")
    private String message;

    @JsonProperty("data")
    private T data;

    @JsonProperty("error")
    private String error;

    public ApiResponse() {
    }

    public ApiResponse(int code, String message, T data, String error) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "成功", data, null);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data, null);
    }

    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(201, "创建成功", data, null);
    }

    public static <T> ApiResponse<T> badRequest(String message, String error) {
        return new ApiResponse<>(400, message, null, error);
    }

    public static <T> ApiResponse<T> unauthorized(String message, String error) {
        return new ApiResponse<>(401, message, null, error);
    }

    public static <T> ApiResponse<T> forbidden(String message, String error) {
        return new ApiResponse<>(403, message, null, error);
    }

    public static <T> ApiResponse<T> notFound(String message, String error) {
        return new ApiResponse<>(404, message, null, error);
    }

    public static <T> ApiResponse<T> internalServerError(String message, String error) {
        return new ApiResponse<>(500, message, null, error);
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

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
