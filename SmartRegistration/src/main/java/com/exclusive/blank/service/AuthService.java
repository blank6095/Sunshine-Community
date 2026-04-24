package com.exclusive.blank.service;

import com.exclusive.blank.dto.UserLoginResponse;
import com.exclusive.blank.exception.BusinessException;
import com.exclusive.blank.exception.ErrorCode;
import com.exclusive.blank.model.User;
import com.exclusive.blank.repository.UserRepository;
import com.exclusive.blank.security.JwtTokenProvider;
import com.exclusive.blank.util.ValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> login(String username, String password) {
        logger.info("AuthService.login called for user: {}", username);
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            logger.info("Authentication successful for user: {}", username);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("SecurityContext set");

            String token = jwtTokenProvider.generateToken(authentication);
            logger.info("Token generated: {}", token.substring(0, Math.min(20, token.length())) + "...");

            logger.info("Querying user from database: {}", username);
            User user = userRepository.findByUsername(username).orElseThrow();
            logger.info("User found: {}", user.getUsername());

            UserLoginResponse userResponse = new UserLoginResponse(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getRole(),
                user.getStatus()
            );
            logger.info("UserLoginResponse created");

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userResponse);
            logger.info("Response map created");

            return response;
        } catch (Exception e) {
            logger.error("Error in AuthService.login: {} - {}", e.getClass().getName(), e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Map<String, Object> refreshToken(String token) {
        String username = jwtTokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username).orElseThrow();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
            user.getUsername(), user.getPassword()
        );

        String newToken = jwtTokenProvider.generateToken(authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("token", newToken);

        return response;
    }

    public User register(User user) {
        logger.info("开始用户注册: username={}", user.getUsername());

        validateUserRegistration(user);

        checkUniqueness(user);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus("ACTIVE");
        User savedUser = userRepository.save(user);

        logger.info("用户注册成功: userId={}, username={}", savedUser.getId(), savedUser.getUsername());
        return savedUser;
    }

    private void validateUserRegistration(User user) {
        if (ValidationUtil.isNullOrEmpty(user.getUsername())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "用户名不能为空");
        }
        if (user.getUsername().length() < 3 || user.getUsername().length() > 20) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "用户名长度应在3-20个字符之间");
        }

        if (ValidationUtil.isNullOrEmpty(user.getPassword())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "密码不能为空");
        }
        if (user.getPassword().length() < 6) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "密码长度不能少于6个字符");
        }

        if (ValidationUtil.isNullOrEmpty(user.getName())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "姓名不能为空");
        }
        if (user.getName().length() > 20) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "姓名长度不能超过20个字符");
        }

        if (ValidationUtil.isNullOrEmpty(user.getGender())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "性别不能为空");
        }
        if (!"男".equals(user.getGender()) && !"女".equals(user.getGender()) && 
            !"M".equals(user.getGender()) && !"F".equals(user.getGender())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "性别只能是'男'/'女'或'M'/'F'");
        }

        if (!ValidationUtil.isPositiveNumber(user.getAge())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "年龄必须是大于0的整数");
        }
        if (user.getAge() < 1 || user.getAge() > 150) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "年龄应在1-150之间");
        }

        if (ValidationUtil.isNullOrEmpty(user.getPhone())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "手机号码不能为空");
        }
        if (!ValidationUtil.isValidPhone(user.getPhone())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "手机号码格式不正确");
        }

        if (!ValidationUtil.isNullOrEmpty(user.getEmail()) && !ValidationUtil.isValidEmail(user.getEmail())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "邮箱格式不正确");
        }

        if (!ValidationUtil.isNullOrEmpty(user.getIdCard()) && !ValidationUtil.isValidIdCard(user.getIdCard())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "身份证号格式不正确");
        }

        if (ValidationUtil.isNullOrEmpty(user.getRole())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "角色不能为空");
        }
        if (!"ADMIN".equals(user.getRole()) && !"DOCTOR".equals(user.getRole()) && !"PATIENT".equals(user.getRole())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "角色只能是'ADMIN'、'DOCTOR'或'PATIENT'");
        }
    }

    private void checkUniqueness(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            logger.warn("用户名已存在: {}", user.getUsername());
            throw new BusinessException(ErrorCode.USERNAME_EXISTS);
        }

        if (userRepository.findByPhone(user.getPhone()).isPresent()) {
            logger.warn("手机号码已存在: {}", user.getPhone());
            throw new BusinessException(ErrorCode.PHONE_EXISTS);
        }

        if (!ValidationUtil.isNullOrEmpty(user.getEmail()) && userRepository.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("邮箱已存在: {}", user.getEmail());
            throw new BusinessException(ErrorCode.EMAIL_EXISTS);
        }

        if (!ValidationUtil.isNullOrEmpty(user.getIdCard()) && userRepository.findByIdCard(user.getIdCard()).isPresent()) {
            logger.warn("身份证号已存在: {}", user.getIdCard());
            throw new BusinessException(ErrorCode.ID_CARD_EXISTS);
        }
    }
}