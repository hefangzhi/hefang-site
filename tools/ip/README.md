# IP 与网速测试工具

## 当前 IP

进入页面后会自动获取并显示：

- 当前公网 IPv4 或 IPv6
- 粗略国家、省/州和城市
- 网络运营组织
- ASN

自动检测复用 `ip.ssss.fun` 页面采用的公开 JSONP 接口：先由 `api-ipv4.ip.sb` 获取当前 IP，再由 `api.ssss.fun/ip/info.php` 查询地区和运营商，并通过 IPIP 接口补充 ASN。由于 `ip.ssss.fun` 不允许被其他网页直接嵌入，完整的 IPv4、IPv6、ISP、反向 DNS 和 DNS 连通性检测需要点击：

- <https://ip.ssss.fun/>

## 网速测试合集

页面采用桌面端三列布局，当前顺序如下：

1. [Speedtest by Ookla](https://www.speedtest.net/)：首选综合测速，提供下载、上传和 Ping。
2. [FAST.com](https://fast.com/)：快速查看下载速度，也可展开上传与延迟。
3. [Cloudflare Speed Test](https://speed.cloudflare.com/)：提供延迟、抖动和丢包等详细指标。
4. [SpeedOf.Me](https://speedof.me/)：浏览器 HTML5 测速与历史图表。
5. [nPerf](https://www.nperf.com/en/)：综合测速及运营商网络数据。
6. [OpenSpeedTest](https://openspeedtest.com/)：适合作为备用和交叉验证。

## 添加测速链接

在 `index.html` 中找到 `speedTools` 数组，复制一个对象并填写名称、网址、特点、说明和适用场景。

## 注意事项

- 外部网站能够看到访问者的公网 IP。
- IP 地理位置是网络数据库估算，不代表精确住址。
- 测速会产生真实下载和上传流量。
- 不同服务的节点、线路和算法不同，结果存在差异属于正常现象。


