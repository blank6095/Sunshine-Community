package com.exclusive.blank.middleware;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Enumeration;

@Component
public class LoggingMiddleware implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(LoggingMiddleware.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);

        StringBuilder requestInfo = new StringBuilder();
        requestInfo.append("[REQUEST] ")
                .append(request.getMethod())
                .append(" ")
                .append(request.getRequestURI());

        if (request.getQueryString() != null) {
            requestInfo.append("?").append(request.getQueryString());
        }

        requestInfo.append(" - IP: ").append(getClientIp(request));

        // 记录请求头
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            // 不记录敏感信息
            if (!headerName.equals("Authorization")) {
                String headerValue = request.getHeader(headerName);
                requestInfo.append(" | " + headerName + ": " + headerValue);
            }
        }

        logger.info(requestInfo.toString());
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // 无需实现
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        long startTime = (Long) request.getAttribute("startTime");
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;

        StringBuilder responseInfo = new StringBuilder();
        responseInfo.append("[RESPONSE] ")
                .append(request.getMethod())
                .append(" ")
                .append(request.getRequestURI())
                .append(" - Status: ")
                .append(response.getStatus())
                .append(" - Time: ")
                .append(executionTime)
                .append("ms");

        if (ex != null) {
            responseInfo.append(" - Error: " + ex.getMessage());
            logger.error(responseInfo.toString(), ex);
        } else {
            logger.info(responseInfo.toString());
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
