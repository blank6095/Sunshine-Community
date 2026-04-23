package com.exclusive.blank.middleware;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitMiddleware implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitMiddleware.class);
    private final Map<String, RateLimit> rateLimits = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 100; // 每分钟最大请求数
    private static final long WINDOW_MS = 60000; // 时间窗口（毫秒）

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = getClientIp(request);
        String key = clientIp + ":" + request.getRequestURI();

        RateLimit rateLimit = rateLimits.computeIfAbsent(key, k -> new RateLimit());

        synchronized (rateLimit) {
            long now = System.currentTimeMillis();

            // 重置时间窗口
            if (now - rateLimit.getLastReset() > WINDOW_MS) {
                rateLimit.reset(now);
            }

            // 检查是否超过限制
            if (rateLimit.getCount() >= MAX_REQUESTS) {
                logger.warn("Rate limit exceeded for IP: {}", clientIp);
                response.setStatus(429); // SC_TOO_MANY_REQUESTS
                response.setContentType("application/json");
                response.getWriter().write("{\"code\": 429, \"message\": \"Too many requests\", \"error\": \"Rate limit exceeded\", \"retryAfter\": 60}");
                return false;
            }

            rateLimit.increment();
        }

        return true;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RateLimit {
        private AtomicInteger count = new AtomicInteger(0);
        private long lastReset;

        public RateLimit() {
            this.lastReset = System.currentTimeMillis();
        }

        public void reset(long now) {
            count.set(0);
            lastReset = now;
        }

        public void increment() {
            count.incrementAndGet();
        }

        public int getCount() {
            return count.get();
        }

        public long getLastReset() {
            return lastReset;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // 无需实现
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 无需实现
    }
}
