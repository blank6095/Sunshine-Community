package com.exclusive.blank.controller;

import com.exclusive.blank.dto.ApiResponse;
import com.exclusive.blank.dto.UserResponse;
import com.exclusive.blank.model.User;
import com.exclusive.blank.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsers() {
        List<UserResponse> users = userService.getUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == @userService.getUserById(#id).getId()")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or #id == @userService.getUserById(#id).getId()")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id, @RequestBody User user) {
        UserResponse updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(ApiResponse.success("更新成功", updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
