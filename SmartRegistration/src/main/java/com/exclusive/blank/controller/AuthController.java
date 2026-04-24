package com.exclusive.blank.controller;

import com.exclusive.blank.dto.ApiResponse;
import com.exclusive.blank.model.User;
import com.exclusive.blank.service.AuthService;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.badRequest("用户名不能为空", null));
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.badRequest("密码不能为空", null));
        }
        logger.info("Attempting login for user: {}", request.getUsername());
        Map<String, Object> response = authService.login(request.getUsername(), request.getPassword());
        logger.info("Login successful for user: {}", request.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refreshToken(@RequestBody RefreshRequest request) {
        try {
            if (request.getToken() == null || request.getToken().trim().isEmpty()) {
                return ResponseEntity.ok(ApiResponse.badRequest("令牌不能为空", null));
            }
            Map<String, Object> response = authService.refreshToken(request.getToken());
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.unauthorized("令牌刷新失败", null));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.badRequest("用户名不能为空", null));
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.badRequest("密码不能为空", null));
        }
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.badRequest("姓名不能为空", null));
        }
        if (user.getGender() == null || user.getGender().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.badRequest("性别不能为空", null));
        }
        if (user.getAge() == null || user.getAge() <= 0) {
            return ResponseEntity.ok(ApiResponse.badRequest("年龄必须大于0", null));
        }
        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.badRequest("手机号码不能为空", null));
        }
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.badRequest("角色不能为空", null));
        }
        User registeredUser = authService.register(user);
        return ResponseEntity.ok(ApiResponse.created(registeredUser));
    }

    public static class LoginRequest {
        @JsonProperty("username")
        private String username;

        @JsonProperty("password")
        private String password;

        public LoginRequest() {
        }

        public LoginRequest(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class RefreshRequest {
        @JsonProperty("token")
        private String token;

        public RefreshRequest() {
        }

        public RefreshRequest(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}