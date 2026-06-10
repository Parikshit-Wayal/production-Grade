# Production-Grade Kubernetes Microservices Architecture
### GitOps | Automated CI/CD | High Availability & HPA | Zero-Trust TLS | Enterprise Observability

---

## 📌 Project Overview

This repository hosts a battle-tested, production-grade cloud-native e-commerce ecosystem named **MINIMAL.SHOP**. The primary objective of this project is to demonstrate an end-to-end operational lifecycle for containerized microservices. 

Instead of relying on managed cloud abstractions, this architecture features a multi-node, bare-metal-style cluster built completely from scratch using **kubeadm** on standalone cloud infrastructure. The deployment, configuration management, scaling, and self-healing behaviors are completely driven via **GitOps practices**—ensuring that the live cluster infrastructure is always a mirror image of the version-controlled declarative manifests.

### Core Architectural Pillars
* 🔄 **Declarative GitOps Continuous Delivery:** Zero manual `kubectl` application deployments. ArgoCD actively tracks Git repository drift to automatically sync, self-heal, and prune cluster states.
* 🛡️ **Automated Edge Security & TLS:** Dynamic, automated wildcard and domain-specific SSL/TLS certificate issuing via cert-manager leveraging Let’s Encrypt production ACME directories.
* 📈 **Elastic Horizontal Scaling:** Automated workload elasticity driven by cluster-resident Metrics Servers combined with Horizontal Pod Autoscalers (HPA) to scale application replicas under varying traffic spikes.
* 👁️ **Full-Stack Enterprise Telemetry:** Proactive, deep-cluster visibility utilizing Helm-deployed New Relic agents to orchestrate log forwarding, infrastructure tracking, and APM.

---

## 🏗️ System Architecture Blueprint

To capture the holistic view of traffic patterns, deployment pipelines, data management, and monitoring boundaries, the system is designed around the following architectural blueprint:

![System Architecture Blueprint](images/08-production-grade-kubernetes-architecture-v2.png)

---

## 🛠️ The Tech Stack Matrix

| Component | Technology Solution | Functional Purpose |
| :--- | :--- | :--- |
| **Cloud Infrastructure** | AWS EC2 (Ubuntu 22.04 LTS) | Hosted virtual machines acting as control-plane and worker nodes. |
| **Container Runtime** | `containerd` | Low-level industry-standard container runtime for executing pod lifecycles. |
| **Orchestration Platform** | Kubernetes (`kubeadm` bootstrap) | Core cluster architecture, networking control plane, and API controller. |
| **Cluster Networking (CNI)**| Calico | Layer-3 networking fabric providing secure pod-to-pod communications. |
| **GitOps Engine** | ArgoCD (v3.4.3) | Continuous delivery controller enforcing state declaration synchronization. |
| **Ingress Control** | NGINX Ingress Controller | Layer-7 reverse proxy routing public incoming HTTP/HTTPS traffic to services. |
| **Automated Security** | cert-manager + Let's Encrypt | Dynamic X.509 certificate provisioning, renewal, and secret injection. |
| **Application Layer** | React, Node.js Microservices | Polyglot microservices managing decoupled functional business tasks. |
| **Stateful Database Layer** | MongoDB (`StatefulSet` + PVC) | Persistent, stable network identity datastore backed by storage volumes. |
| **Scaling Engine** | K8s Metrics Server + HPA | Real-time resource metrics collector driving automated horizontal pod replication. |
| **Observability Estate** | New Relic Operator & DaemonSets | Log streaming, infrastructure metrics collector, and topology engine. |

---
## 🧩 Step 2: Decoupling the Monolith into a Distributed Microservices Architecture

Transitioning from a legacy monolithic design to a cloud-native model requires breaking apart single-binary dependencies into loosely coupled, bounded contexts. For **MINIMAL.SHOP**, the backend domain was split into five specialized, independent microservices to enable isolated development cycles, independent scaling boundaries, and fault isolation.

Below is the conceptual blueprint of the decoupled service domains, structural environment mappings, and database integration layer:

<img width="1180" height="927" alt="deicouple-conf-files" src="https://github.com/user-attachments/assets/b2b9d1b8-60f6-4207-ac78-88cdfaf16d2e" />


---

### 1. Functional Microservices Breakdown
Every service operates as an isolated application layer with its own dedicated dependencies, packaged inside lightweight Docker containers:

* **`frontend` (React):** The client-facing user interface. It is served via an NGINX static file server inside the cluster and handles dynamic web requests by communicating directly with the backend APIs via public ingress routes.
* **`auth-service` (Node.js/Express):** Manages user registration, session validation, and secure JWT (JSON Web Token) generation and parsing.
* **`products-service` (Node.js/Express):** Acts as the catalog engine. It manages product listings, item descriptions, pricing, and metadata.
* **`cart-service` (Node.js/Express):** Handles stateful, temporary user sessions containing active shopping carts and item quantities before checkout processing.
* **`orders-service` (Node.js/Express):** Manages the checkout state machine, permanent order placement records, and histories.

---

### 2. Containerization & Versioned Image Management
Each microservice is built using a optimized multi-stage `Dockerfile` to keep image sizes minimal and secure. The images are compiled, tagged with specific semantic versions, and pushed to a central repository on **Docker Hub**. 

This version management strategy ensures that the GitOps controller can execute targeted, zero-downtime rolling updates whenever a specific service manifest is updated.

Here is the verified list of custom versioned images stored on Docker Hub ready for cluster deployment:

<img width="717" height="361" alt="images-docker" src="https://github.com/user-attachments/assets/2c320ba0-7750-48bf-9d93-8b343339248e" />
<br>
<br>
<br>
<img width="999" height="176" alt="38-kubernetes-node-resource-usage" src="https://github.com/user-attachments/assets/02cb080e-2d3f-4924-ac18-534f9b3ac558" />

---
## 🚀 Step 3: Declarative Application Deployments & Internal Service Networking

With the microservices split into distinct codebases and their container versions pushed to Docker Hub, the next phase is establishing their runtime state within the cluster. This is managed under the dedicated `production` namespace using zero-downtime `Deployment` policies and stable internal `ClusterIP` network abstractions.

---

### 1. Pod Replica Configuration & Deployment Strategy
Each stateless microservice deployment (such as `auth-service`, `cart-service`, `products-service`, and `orders-service`) is configured with a baseline of **3 replicas** distributed across the cluster nodes to ensure high availability. 
<br>

<img width="951" height="213" alt="41-auth-service-environment-variables" src="https://github.com/user-attachments/assets/dfb6fd90-4987-4215-b5ce-b13a4d561adc" />

<br>
#### Sample Core Manifest Design (`auth/deployment.yaml`) and (auth/service.yml)
To give insight into the structural setup, the services utilize specific environment bindings to talk to the unified data tier safely:

<img width="706" height="789" alt="-n production" src="https://github.com/user-attachments/assets/261aaa58-9a5c-4573-b501-b342a92f811a" />
<br>
<br>
<br>
<img width="1115" height="525" alt="microarchi-dicouple" src="https://github.com/user-attachments/assets/c4ead85d-394c-4178-a059-e2b5b1c1836c" />
<br>


