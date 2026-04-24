package com.exclusive.blank.security;

import com.exclusive.blank.dto.ErrorResponse;
import com.exclusive.blank.service.AuthExemptionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private AuthExemptionService authExemptionService;

    public JwtAuthenticationFilter() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String contextPath = request.getContextPath();
        String requestPath = request.getRequestURI();

        if (contextPath != null && !contextPath.isEmpty() && requestPath.startsWith(contextPath)) {
            requestPath = requestPath.substring(contextPath.length());
        }

        String httpMethod = request.getMethod();

        if (authExemptionService.isExempt(requestPath, httpMethod)) {
            logger.debug("请求路径 {} (方法: {}) 豁免认证", requestPath, httpMethod);
            filterChain.doFilter(request, response);
            return;
        }

        String token = getTokenFromRequest(request);

        if (token == null || token.trim().isEmpty()) {
            logger.warn("认证失败 - TOKEN_MISSING | 请求路径: {} | 请求方法: {} | 原因: 请求中未提供令牌",
                requestPath, httpMethod);
            sendErrorResponse(request, response, ErrorResponse.tokenMissing());
            return;
        }

        try {
            if (jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.debug("认证成功 | 用户: {} | 请求路径: {} | 请求方法: {}",
                    username, requestPath, httpMethod);
                filterChain.doFilter(request, response);
            } else {
                logger.warn("认证失败 - TOKEN_INVALID | 请求路径: {} | 请求方法: {} | 原因: 令牌验证失败",
                    requestPath, httpMethod);
                sendErrorResponse(request, response, ErrorResponse.tokenInvalid());
            }
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("Expired")) {
                logger.warn("认证失败 - TOKEN_EXPIRED | 请求路径: {} | 请求方法: {} | 原因: 令牌已过期",
                    requestPath, httpMethod);
                sendErrorResponse(request, response, ErrorResponse.tokenExpired());
            } else {
                logger.warn("认证失败 - TOKEN_INVALID | 请求路径: {} | 请求方法: {} | 原因: {}",
                    requestPath, httpMethod, e.getMessage());
                sendErrorResponse(request, response, ErrorResponse.tokenInvalid());
            }
        }
    }

    private void sendErrorResponse(HttpServletRequest request, HttpServletResponse response, ErrorResponse errorResponse) throws IOException {
        if (response.isCommitted()) {
            logger.warn("响应已提交，无法发送错误响应 | 路径: {} | 方法: {}",
                request.getRequestURI(), request.getMethod());
            return;
        }

        String contextPath = request.getContextPath();
        String requestPath = request.getRequestURI();
        if (contextPath != null && !contextPath.isEmpty() && requestPath.startsWith(contextPath)) {
            requestPath = requestPath.substring(contextPath.length());
        }

        errorResponse.setRequestPath(requestPath);
        errorResponse.setRequestMethod(request.getMethod());

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String jsonResponse = objectMapper.writeValueAsString(errorResponse);
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();

        logger.info("发送认证错误响应 | 路径: {} | 方法: {} | 错误类型: {} | 错误码: {}",
            requestPath, request.getMethod(), errorResponse.getErrorType(), errorResponse.getCode());
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
