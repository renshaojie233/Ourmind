# 手动安装 ngrok 到当前目录

由于自动下载遇到问题，请按以下步骤手动安装：

## 方法一：从官网下载（推荐）

1. **访问下载页面**：
   - 打开浏览器访问：https://ngrok.com/download
   - 或者直接访问：https://dashboard.ngrok.com/get-started/setup/linux

2. **下载 Linux 版本**：
   - 点击下载按钮，下载 `ngrok` 文件
   - 或者使用命令行：
     ```bash
     wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip
     unzip ngrok-stable-linux-amd64.zip
     ```

3. **移动到当前目录**：
   ```bash
   mv ngrok /home/rsj/Ourmind/
   chmod +x /home/rsj/Ourmind/ngrok
   ```

## 方法二：使用官方安装脚本

```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
sudo apt update && sudo apt install ngrok
```

安装后复制到当前目录：
```bash
cp /usr/bin/ngrok /home/rsj/Ourmind/ngrok
```

## 配置 authtoken

下载完成后，运行：

```bash
cd /home/rsj/Ourmind
./ngrok config add-authtoken 361dahWGe8oaPER5fVcDeVwicnm_7GH7hTRCbCbKk7HKdJJt
```

## 验证安装

```bash
./ngrok version
```

如果显示版本号，说明安装成功！






