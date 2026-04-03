# 日志规范

本文档定义了 dingtalk-sender 包的日志输出规范，确保不泄露敏感信息。

---

## 禁止输出的敏感信息

以下信息**严禁**在日志中输出：

| 类型 | 示例 | 风险等级 |
|------|------|----------|
| API Token | `API_TOKEN=xxx` | 🔴 高 |
| Secret/Key | `secret=xxx`, `api_key=xxx` | 🔴 高 |
| Webhook URL | `https://oapi.dingtalk.com/robot/send?access_token=xxx` | 🔴 高 |
| 认证 Headers | `Authorization: Bearer xxx` | 🔴 高 |
| 密码 | `password=xxx` | 🔴 高 |
| Response Data | 可能包含 token 或敏感数据 | 🟡 中 |
| Response Headers | 可能包含认证信息 | 🟡 中 |

---

## 安全的日志内容

以下内容可以安全输出：

| 类型 | 示例 |
|------|------|
| 状态码 | `Response status: 200` |
| 平台名称 | `Platform: baidu` |
| 数据条数 | `Items sent: 4` |
| 错误类型 | `Error: Network timeout` |
| 配置状态 | `Token status: configured` |
| 操作结果 | `✅ 钉钉消息发送成功` |

---

## 日志示例

### ❌ 错误示例（泄露敏感信息）

```typescript
// 输出具体的环境变量名
console.error('❌ API_TOKEN 环境变量未设置');

// 输出 Response 数据（可能包含敏感信息）
console.error('Response data:', JSON.stringify(data));

// 输出 Response Headers（可能包含认证信息）
console.error('Response headers:', error.response.headers);

// 输出完整 URL（可能包含 token 参数）
console.error('Request URL:', apiUrl);
```

### ✅ 正确示例（安全输出）

```typescript
// 通用错误提示
console.error('❌ 必要的环境变量未设置');

// 仅输出状态码
console.error('Response status:', error.response?.status);

// 输出安全的元信息
console.log('Platform:', platform);
console.log('Items sent:', feedItems.length);

// 配置状态（不暴露具体值）
console.log('Token status:', token ? 'configured' : 'missing');
```

---

## 代码审查清单

在提交代码前，请确认：

- [ ] 无 API Token/Secret 输出
- [ ] 无 Webhook URL 输出
- [ ] 无 Response Data/Headers 输出
- [ ] 环境变量错误使用通用提示
- [ ] URL 不包含 token 参数

---

## 处理敏感数据

### 环境变量验证

```typescript
// ❌ 错误
if (!process.env.API_TOKEN) {
  console.error('❌ API_TOKEN 环境变量未设置');
}

// ✅ 正确
if (!process.env.API_TOKEN) {
  console.error('❌ 必要的环境变量未设置');
}
```

### 错误处理

```typescript
// ❌ 错误
catch (error: any) {
  console.error('Response data:', error.response.data);
  console.error('Response headers:', error.response.headers);
}

// ✅ 正确
catch (error: any) {
  console.error('Request failed:', error.message);
  if (error.response) {
    console.error('Response status:', error.response.status);
  }
}
```

---

**最后更新**: 2026-04-03  
**维护者**: DailyHotApi Team