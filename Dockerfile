# 使用官方Node.js的基础镜像，指定版本
FROM node:lts as builder

# 设置工作目录
WORKDIR /app

# 复制项目文件到工作目录
COPY . /app

# 安装项目依赖
RUN npm install

# 构建Vue.js项目
RUN npm run build

# 选择一个更小的基础镜像用于生产环境
FROM nginx:stable-alpine

# 复制构建好的文件到nginx的html目录下
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
