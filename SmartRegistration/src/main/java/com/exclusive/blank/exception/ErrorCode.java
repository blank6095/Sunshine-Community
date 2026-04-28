package com.exclusive.blank.exception;

public enum ErrorCode {
    // 通用错误
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务不可用"),

    // 用户相关错误
    USER_NOT_FOUND(1001, "用户不存在"),
    PASSWORD_ERROR(1002, "密码错误"),
    USERNAME_EXISTS(1003, "用户名已存在"),
    PHONE_EXISTS(1004, "手机号码已存在"),
    ID_CARD_EXISTS(1005, "身份证号已存在"),
    EMAIL_EXISTS(1006, "邮箱已存在"),

    // 科室相关错误
    DEPARTMENT_NOT_FOUND(2001, "科室不存在"),
    DEPARTMENT_NAME_EXISTS(2002, "科室名称已存在"),

    // 医生相关错误
    DOCTOR_NOT_FOUND(3001, "医生不存在"),
    USER_NOT_DOCTOR(3002, "用户不是医生"),

    // 排班相关错误
    SCHEDULE_NOT_FOUND(4001, "排班不存在"),
    SCHEDULE_CANCELLED(4002, "排班已取消"),
    SCHEDULE_FULL(4003, "排班已满"),

    // 预约相关错误
    APPOINTMENT_NOT_FOUND(5001, "预约不存在"),
    APPOINTMENT_COMPLETED(5002, "预约已完成，无法操作"),
    APPOINTMENT_CANCELLED(5003, "预约已取消，无法操作"),
    APPOINTMENT_TIME_PASSED(5004, "预约时间已过，无法操作"),

    // 权限相关错误
    PERMISSION_DENIED(6001, "权限不足，无法执行此操作");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}