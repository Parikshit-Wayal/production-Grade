# Production-Grade Kubernetes Microservices Platform

A complete cloud-native microservices platform deployed on Kubernetes using GitOps principles with ArgoCD.

The project demonstrates how a production-grade application can be deployed, secured, monitored, scaled, and continuously delivered using modern DevOps practices.

## Key Highlights

- Kubernetes Cluster (kubeadm)
- AWS EC2 Infrastructure
- GitOps Deployment using ArgoCD
- NGINX Ingress Controller
- HTTPS with Let's Encrypt
- cert-manager Integration
- Horizontal Pod Autoscaling (HPA)
- Metrics Server
- MongoDB Database
- New Relic Monitoring
- Centralized Logging
- Self-Healing Deployments
- Namespace Isolation
- Production-ready Microservices Architecture

---

## Tech Stack

| Layer | Technology |
|---------|------------|
| Cloud | AWS EC2 |
| Container Runtime | containerd |
| Orchestration | Kubernetes |
| GitOps | ArgoCD |
| Ingress | NGINX Ingress Controller |
| TLS | cert-manager + Let's Encrypt |
| Monitoring | New Relic |
| Database | MongoDB |
| Scaling | HPA + Metrics Server |
| Registry | DockerHub |


# Architecture

The platform follows a GitOps-driven microservices architecture.

![Architecture](images/architecture.png)

## Components

### Developers

Developers push code to GitHub.

### CI/CD

GitHub Actions:

- Build Images
- Run Tests
- Push Images to DockerHub
- Update Kubernetes Manifests

### GitOps

ArgoCD continuously monitors the manifest repository and automatically synchronizes Kubernetes resources.

### Kubernetes Cluster

The application runs inside a kubeadm-based Kubernetes cluster hosted on AWS EC2.

### Monitoring

New Relic provides:

- Infrastructure Monitoring
- Kubernetes Monitoring
- Log Aggregation
- Application Insights
