# 智能挂号预约系统 API 测试脚本
$baseUrl = "http://localhost:8080/api/v1"
$token = $null
$testUserToken = $null

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  智能挂号预约系统 API 测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Test-Endpoint {
    param(
        [string]$Description,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [bool]$ExpectError = $false
    )

    Write-Host "`n[测试] $Description" -ForegroundColor Yellow
    Write-Host "  $Method $Url" -ForegroundColor Gray

    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            UseBasicParsing = $true
        }

        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }

        if ($Body -ne $null) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
        }

        $response = Invoke-WebRequest @params
        $statusCode = $response.StatusCode
        $content = $response.Content

        if (-not $ExpectError -and ($statusCode -ge 200 -and $statusCode -lt 300)) {
            Write-Host "  ✅ 成功! Status: $statusCode" -ForegroundColor Green
            if ($content) {
                Write-Host "  响应: $content" -ForegroundColor DarkGray
            }
            return @{ Success = $true; Content = $content; StatusCode = $statusCode }
        } elseif ($ExpectError -and ($statusCode -ge 400)) {
            Write-Host "  ✅ 预期错误! Status: $statusCode" -ForegroundColor Green
            Write-Host "  响应: $content" -ForegroundColor DarkGray
            return @{ Success = $true; Content = $content; StatusCode = $statusCode }
        } else {
            Write-Host "  ❌ 意外结果! Status: $statusCode" -ForegroundColor Red
            Write-Host "  响应: $content" -ForegroundColor DarkGray
            return @{ Success = $false; Content = $content; StatusCode = $statusCode }
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $content = $_.ErrorDetails.Message

        if ($ExpectError) {
            Write-Host "  ✅ 预期错误! Status: $statusCode" -ForegroundColor Green
            Write-Host "  响应: $content" -ForegroundColor DarkGray
            return @{ Success = $true; Content = $content; StatusCode = $statusCode }
        } else {
            Write-Host "  ❌ 失败! Status: $statusCode" -ForegroundColor Red
            Write-Host "  错误: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  响应: $content" -ForegroundColor DarkGray
            return @{ Success = $false; Content = $content; StatusCode = $statusCode }
        }
    }
}

# ========== 1. 健康检查测试 ==========
Write-Host "`n========== 1. 健康检查测试 ==========" -ForegroundColor Cyan
Test-Endpoint "健康检查" "GET" "$baseUrl/health"
Test-Endpoint "Ping测试" "GET" "$baseUrl/health/ping"

# ========== 2. 认证接口测试 ==========
Write-Host "`n========== 2. 认证接口测试 ==========" -ForegroundColor Cyan

Write-Host "`n--- 2.1 注册接口测试 ---" -ForegroundColor Magenta
Test-Endpoint "注册 - 缺少参数" "POST" "$baseUrl/auth/register" -Body @{username=""} -ExpectError $true

$newUser = @{
    username = "testpatient001"
    password = "123456"
    name = "测试患者"
    gender = "男"
    age = 30
    phone = "13900139999"
    email = "test001@example.com"
    idCard = "110101199001011234"
    role = "PATIENT"
}
$registerResult = Test-Endpoint "注册 - 正常注册" "POST" "$baseUrl/auth/register" -Body $newUser

Test-Endpoint "注册 - 用户名重复" "POST" "$baseUrl/auth/register" -Body $newUser -ExpectError $true

$invalidPhoneUser = $newUser.PSObject.Copy()
$invalidPhoneUser.username = "testpatient002"
$invalidPhoneUser.phone = "12345"
Test-Endpoint "注册 - 手机号格式错误" "POST" "$baseUrl/auth/register" -Body $invalidPhoneUser -ExpectError $true

Write-Host "`n--- 2.2 登录接口测试 ---" -ForegroundColor Magenta
$loginBody = @{
    username = "admin"
    password = "123456"
}
$loginResult = Test-Endpoint "登录 - 管理员登录" "POST" "$baseUrl/auth/login" -Body $loginBody
if ($loginResult.Success) {
    $loginData = $loginResult.Content | ConvertFrom-Json
    $token = $loginData.data.token
    Write-Host "  🔑 获取到Token: $($token.Substring(0, [Math]::Min(30, $token.Length)))..." -ForegroundColor Cyan
}

Test-Endpoint "登录 - 密码错误" "POST" "$baseUrl/auth/login" -Body @{username="admin"; password="wrongpass"} -ExpectError $true

$testLoginBody = @{
    username = "testpatient001"
    password = "123456"
}
$testLoginResult = Test-Endpoint "登录 - 新用户登录" "POST" "$baseUrl/auth/login" -Body $testLoginBody
if ($testLoginResult.Success) {
    $testLoginData = $testLoginResult.Content | ConvertFrom-Json
    $testUserToken = $testLoginData.data.token
}

# ========== 3. 科室接口测试 ==========
Write-Host "`n========== 3. 科室接口测试 ==========" -ForegroundColor Cyan

$headers = @{}
if ($token) {
    $headers.Authorization = "Bearer $token"
}

Test-Endpoint "获取科室列表 - 无需认证" "GET" "$baseUrl/departments"

$newDept = @{
    name = "测试科室"
    description = "这是一个测试科室"
    status = "ACTIVE"
}
Test-Endpoint "创建科室 - 需要认证" "POST" "$baseUrl/departments" -Body $newDept -Headers $headers

Test-Endpoint "创建科室 - 无认证(应该失败)" "POST" "$baseUrl/departments" -Body $newDept -ExpectError $true

# ========== 4. 医生接口测试 ==========
Write-Host "`n========== 4. 医生接口测试 ==========" -ForegroundColor Cyan

Test-Endpoint "获取医生列表 - 无认证" "GET" "$baseUrl/doctors" -ExpectError $true
Test-Endpoint "获取医生列表 - 有认证" "GET" "$baseUrl/doctors" -Headers $headers

# ========== 5. 用户接口测试 ==========
Write-Host "`n========== 5. 用户接口测试 ==========" -ForegroundColor Cyan

Test-Endpoint "获取用户列表 - 无认证(应该失败)" "GET" "$baseUrl/users" -ExpectError $true
Test-Endpoint "获取用户列表 - 有认证" "GET" "$baseUrl/users" -Headers $headers

# ========== 6. 其他公开接口测试 ==========
Write-Host "`n========== 6. 其他接口测试 ==========" -ForegroundColor Cyan

Test-Endpoint "获取系统信息" "GET" "$baseUrl/health/info"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  测试完成!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
