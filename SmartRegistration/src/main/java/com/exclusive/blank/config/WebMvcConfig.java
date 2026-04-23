package com.exclusive.blank.config;

import com.exclusive.blank.middleware.LoggingMiddleware;
import com.exclusive.blank.middleware.RateLimitMiddleware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private LoggingMiddleware loggingMiddleware;

    @Autowired
    private RateLimitMiddleware rateLimitMiddleware;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册日志中间件
        registry.addInterceptor(loggingMiddleware)
                .addPathPatterns("/**");

        // 注册限流中间件
        registry.addInterceptor(rateLimitMiddleware)
                .addPathPatterns("/**");
    }
}
