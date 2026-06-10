# ============================================================
# Dockerfile for Frontend (React + Vite Application)
#
# Purpose:
# This Dockerfile builds the React/Vite frontend and serves
# the static files using Nginx.
#
# Architecture:
# User
#   ↓
# Nginx (Port 80)
#   ↓
# React Static Files
#
# Why Nginx?
# - Fast static file serving
# - Lower memory usage than Node.js
# - Production ready
# - Supports reverse proxy and caching
#
# Multi-stage build is used to:
# - Keep final image small
# - Remove unnecessary build tools
# - Improve security
# ============================================================

# ============================================================
# STAGE 1: BUILD STAGE
# ============================================================

# Use Node.js image for building React application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency files first
# Helps Docker layer caching
COPY package*.json ./

# Install frontend dependencies
# Example:
# react
# vite
# axios
# tailwindcss
RUN npm install

# Copy complete frontend source code
COPY . .

# Build optimized production files
# Generates static files inside /app/dist
#
# NODE_OPTIONS increases memory limit during build
# Useful when build process consumes more memory
RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build


# ============================================================
# STAGE 2: PRODUCTION STAGE
# ============================================================

# Use lightweight Nginx image
# Final image will only contain:
# - Nginx
# - Compiled frontend files
#
# Node.js is NOT included in final image
# This makes image smaller and more secure
FROM nginx:alpine

# Copy custom Nginx configuration
#
# Purpose:
# - Route frontend traffic
# - Handle React SPA routing
# - Configure caching
# - Configure reverse proxy if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files from build stage
#
# Source:
# /app/dist
#
# Destination:
# Nginx default web root
COPY --from=build /app/dist /usr/share/nginx/html

# Frontend application served on port 80
EXPOSE 80

# Start Nginx in foreground mode
#
# daemon off keeps Nginx attached to container process
# If omitted, container would immediately stop
CMD ["nginx", "-g", "daemon off;"]
