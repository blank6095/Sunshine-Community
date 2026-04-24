package com.exclusive.blank.service;

import com.exclusive.blank.dto.UserResponse;
import com.exclusive.blank.exception.BusinessException;
import com.exclusive.blank.exception.ErrorCode;
import com.exclusive.blank.model.User;
import com.exclusive.blank.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public List<UserResponse> getUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("用户不存在: id={}", id);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });
        return toUserResponse(user);
    }

    public UserResponse updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("用户不存在: id={}", id);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });

        if (user.getName() != null) {
            if (user.getName().trim().isEmpty()) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "姓名不能为空");
            }
            if (user.getName().length() > 20) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "姓名不能超过20个字符");
            }
            existingUser.setName(user.getName());
        }

        if (user.getGender() != null) {
            if (!"男".equals(user.getGender()) && !"女".equals(user.getGender()) &&
                !"M".equals(user.getGender()) && !"F".equals(user.getGender())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "性别只能是'男'/'女'或'M'/'F'");
            }
            existingUser.setGender(user.getGender());
        }

        if (user.getAge() != null) {
            if (user.getAge() < 1 || user.getAge() > 150) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "年龄应在1-150之间");
            }
            existingUser.setAge(user.getAge());
        }

        if (user.getPhone() != null) {
            if (user.getPhone().trim().isEmpty()) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "手机号码不能为空");
            }
            if (!user.getPhone().matches("^1[3-9]\\d{9}$")) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "手机号码格式不正确");
            }
            Optional<User> phoneExists = userRepository.findByPhone(user.getPhone());
            if (phoneExists.isPresent() && !phoneExists.get().getId().equals(id)) {
                logger.warn("手机号码已存在: {}", user.getPhone());
                throw new BusinessException(ErrorCode.PHONE_EXISTS);
            }
            existingUser.setPhone(user.getPhone());
        }

        if (user.getEmail() != null) {
            if (!user.getEmail().trim().isEmpty()) {
                if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                    throw new BusinessException(ErrorCode.BAD_REQUEST, "邮箱格式不正确");
                }
                Optional<User> emailExists = userRepository.findByEmail(user.getEmail());
                if (emailExists.isPresent() && !emailExists.get().getId().equals(id)) {
                    logger.warn("邮箱已存在: {}", user.getEmail());
                    throw new BusinessException(ErrorCode.EMAIL_EXISTS);
                }
                existingUser.setEmail(user.getEmail());
            } else {
                existingUser.setEmail(null);
            }
        }

        if (user.getIdCard() != null) {
            if (!user.getIdCard().trim().isEmpty()) {
                if (!user.getIdCard().matches("^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$")) {
                    throw new BusinessException(ErrorCode.BAD_REQUEST, "身份证号格式不正确");
                }
                Optional<User> idCardExists = userRepository.findByIdCard(user.getIdCard());
                if (idCardExists.isPresent() && !idCardExists.get().getId().equals(id)) {
                    logger.warn("身份证号已存在: {}", user.getIdCard());
                    throw new BusinessException(ErrorCode.ID_CARD_EXISTS);
                }
                existingUser.setIdCard(user.getIdCard());
            } else {
                existingUser.setIdCard(null);
            }
        }

        if (user.getStatus() != null) {
            if (!"ACTIVE".equals(user.getStatus()) && !"INACTIVE".equals(user.getStatus())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "状态只能是ACTIVE或INACTIVE");
            }
            existingUser.setStatus(user.getStatus());
        }

        User updated = userRepository.save(existingUser);
        logger.info("用户更新成功: id={}", updated.getId());
        return toUserResponse(updated);
    }

    public void deleteUser(Long id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("用户不存在: id={}", id);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });

        userRepository.deleteById(id);
        logger.info("用户删除成功: id={}", id);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getGender(),
                user.getAge(),
                user.getPhone(),
                user.getEmail(),
                user.getIdCard(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
