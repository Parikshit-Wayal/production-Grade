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

<br>

<img width="762" height="505" alt="exampl-deployments-n-service-file" src="https://github.com/user-attachments/assets/a8579ab0-779c-4fe4-af16-e492870a3f4c" />
<img width="706" height="789" alt="-n production" src="https://github.com/user-attachments/assets/261aaa58-9a5c-4573-b501-b342a92f811a" />
<br>
<br>
<img width="1115" height="525" alt="microarchi-dicouple" src="https://github.com/user-attachments/assets/c4ead85d-394c-4178-a059-e2b5b1c1836c" />
<br>

---

## 🌐 Step 4: External Ingress Routing, FreeDNS, & Automated HTTPS via Let's Encrypt

Exposing internal `ClusterIP` services securely to the public internet requires an edge management plane. This architecture utilizes FreeDNS for public domain resolution, an **NGINX Ingress Controller** for Layer-7 traffic routing, and **cert-manager** linked with **Let's Encrypt** to automate end-to-end TLS termination.

---

### 1. Public DNS Record Configuration
To bridge public internet traffic to our AWS cluster gateway, custom dynamic Type A records were configured using the FreeDNS registry framework. These point directly to the public IP address of the cluster ingress entry-point:

* **E-Commerce Application URL:** `myshoppakshya.mooo.com`
* **GitOps Dashboard URL:** `argocd-pakshya.mooo.com`

Below is the active DNS zones panel routing configuration:


<img width="473" height="87" alt="11-dns-records-configuration" src="https://github.com/user-attachments/assets/29ee60d3-9cc9-49fc-ba28-51529e85667d" />

<br>
---

### 2. Layer-7 Traffic Routing with NGINX Ingress Controller

After external traffic enters the Kubernetes cluster through the cloud Load Balancer, the **NGINX Ingress Controller** serves as the centralized Layer-7 (Application Layer) gateway. It inspects incoming HTTP/HTTPS requests and intelligently routes them to the appropriate backend microservices based on the requested **hostname** and **URL path**.

Unlike traditional Layer-4 load balancing that routes traffic only using IP addresses and ports, the Ingress Controller performs **content-aware routing**, enabling multiple services to be exposed through a single domain while maintaining a clean and scalable architecture.

#### Key Responsibilities of the NGINX Ingress Controller

- Acts as the single entry point for external traffic.
- Routes requests using host-based and path-based rules.
- Provides SSL/TLS termination for secure HTTPS communication.
- Reduces the need for exposing individual services publicly.
- Simplifies traffic management across multiple microservices.
- Integrates seamlessly with Cert-Manager for automated certificate management.

---

### Production Traffic Flow

The following diagram represents the logical request flow:

```text
Client Browser
       │
       ▼
Cloud Load Balancer
       │
       ▼
NGINX Ingress Controller
       │
       ├── /               → Frontend Service
       ├── /api/auth       → Auth Service
       ├── /api/products   → Products Service
       ├── /api/cart       → Cart Service
       └── /api/orders     → Orders Service
```

For example:

- `https://myshoppakshya.mooo.com/` → Frontend Application
- `https://myshoppakshya.mooo.com/api/auth/login` → Authentication Service
- `https://myshoppakshya.mooo.com/api/products` → Products Service
- `https://myshoppakshya.mooo.com/api/cart` → Cart Service
- `https://myshoppakshya.mooo.com/api/orders` → Orders Service

This approach allows all application components to be accessed through a single domain while keeping the backend services isolated within the Kubernetes cluster.

---

#### Production Traffic Path Definitions (`production-ingress.yaml`)

```yaml
apiVersion: networking.k8s.io/v1

# Defines the Kubernetes resource type
kind: Ingress

metadata:
  # Name of the Ingress resource
  name: shop-ingress

  # Namespace where the Ingress resource exists
  namespace: production

spec:
  # Specifies that the NGINX Ingress Controller should manage this resource
  ingressClassName: nginx

  # Host and path-based routing rules
  rules:
  - host: myshoppakshya.mooo.com
    http:
      paths:

      # Frontend Application Route
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80

      # Authentication Service Route
      - path: /api/auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 5001

      # Products Service Route
      - path: /api/products
        pathType: Prefix
        backend:
          service:
            name: products-service
            port:
              number: 5002

      # Cart Service Route
      - path: /api/cart
        pathType: Prefix
        backend:
          service:
            name: cart-service
            port:
              number: 5003

      # Orders Service Route
      - path: /api/orders
        pathType: Prefix
        backend:
          service:
            name: orders-service
            port:
              number: 5004
```

---

### Verifying Service Endpoints

After deploying the services, Kubernetes automatically creates corresponding endpoints that map each Service to the underlying application Pods.

The following output confirms that all production services have active endpoints and are ready to receive traffic routed through the Ingress Controller.

<br>

<img width="969" height="97" alt="40-production-service-endpoints" src="https://github.com/user-attachments/assets/d98535d4-09cb-49d2-9af8-2cd44dbf33a7" />

---

### Verifying Ingress Configuration

The following command can be used to inspect the deployed Ingress resource:

```bash
kubectl get ingress -n production
```

This confirms:

- The configured hostname.
- The assigned external IP address.
- Active routing rules.
- Successful association with the NGINX Ingress Controller.

<br>

<img width="949" height="249" alt="-n ingress" src="https://github.com/user-attachments/assets/feaaa51a-9612-4bb8-a411-32dfd57632df" />

---

### Automated TLS Certificate Management with Cert-Manager

To secure application traffic, **Cert-Manager** is deployed within the cluster and configured with a **ClusterIssuer** resource.

The ClusterIssuer is responsible for:

- Requesting TLS certificates from Let's Encrypt.
- Performing domain ownership validation.
- Automatically issuing certificates.
- Renewing certificates before expiration.
- Eliminating manual certificate management.

This ensures all application traffic is encrypted using HTTPS.

<br>

<img width="549" height="233" alt="cluster-issuer" src="https://github.com/user-attachments/assets/95cf5d58-6e81-4dc2-a1d0-016b79ab4803" />

<br>

<img width="1009" height="477" alt="43-argocd-production-application-sync" src="https://github.com/user-attachments/assets/fbe76df7-62c1-4430-b88f-09d86baf8638" />

---

### Cert-Manager Operational Verification

The following output confirms that all Cert-Manager components are running successfully within the cluster.

Healthy Cert-Manager pods indicate that:

- Certificate issuance is operational.
- Automatic certificate renewals are active.
- HTTPS traffic can be maintained without manual intervention.

<br>

<img width="1102" height="228" alt="05-cert-manager-pods-running" src="https://github.com/user-attachments/assets/6b1b365f-4f9a-4b4f-8a87-42d442cdd000" />

---

### Outcome

At this stage, the production environment has a fully functional Layer-7 routing architecture where:

- External traffic enters through a single public endpoint.
- NGINX Ingress Controller performs intelligent path-based routing.
- Backend microservices remain private inside the cluster.
- TLS certificates are automatically managed by Cert-Manager.

<br>









## 📈 Step 5: High Availability Validation & Dynamic Scaling (HPA & Metrics Server)

To handle unexpected traffic spikes without manual operations, the system relies on automated workload elasticity. This section documents configuring the core cluster metrics aggregation plane and establishing Horizontal Pod Autoscalers (HPA) to scale microservice replicas dynamically based on resource constraints.

---

### 1. Deploying the Kubernetes Metrics Server
The Horizontal Pod Autoscaler relies on the cluster-resident **Metrics Server** to collect resource usage telemetry (CPU and Memory dimensions) from container runtimes via local kubelets. 

Because our multi-node cluster uses self-signed control-plane certificates via `kubeadm`, the standard Metrics Server manifest must be adjusted to bypass TLS validation metrics temporarily during internal scraping:

```bash
# Download the official stable metrics server release components
wget [https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml](https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml)

# Modify the container arguments to include --kubelet-insecure-tls for local authorization
# Apply the updated manifest to the cluster
kubectl apply -f components.yaml

```
<img width="1074" height="564" alt="03-hpa-autoscaling-demonstration" src="https://github.com/user-attachments/assets/da2d850d-35c0-46eb-87f6-742e31234a4c" />






































