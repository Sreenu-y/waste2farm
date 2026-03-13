# Waste2Farm — Deployment Guide

## Local Development

```bash
# 1. Start infrastructure
docker-compose up mongo redis -d

# 2. Start services individually
cd services/auth-service && npm install && npm run dev
cd services/waste-service && npm install && npm run dev
# ... repeat for each service

# 3. Start API Gateway
cd services/api-gateway && npm install && npm run dev

# 4. Seed data
node scripts/seed.js
```

## Docker Deployment

```bash
# Full stack
docker-compose up --build -d

# View logs
docker-compose logs -f api-gateway
docker-compose logs -f auth-service
```

## AWS Production Deployment

### Architecture
```
CloudFront → ALB → ECS Fargate (services)
                 → DocumentDB (MongoDB)
                 → ElastiCache (Redis)
                 → S3 (images/uploads)
```

### Steps

1. **Create ECR repositories** for each service
2. **Push Docker images** to ECR
3. **Create ECS cluster** with Fargate capacity
4. **Create task definitions** for each service
5. **Create services** behind an Application Load Balancer
6. **Configure DocumentDB** as MongoDB replacement
7. **Configure ElastiCache** for Redis
8. **Set up S3 bucket** for image uploads
9. **Configure Route 53** for DNS
10. **Enable CloudFront** for CDN

### Environment Variables
Set all variables from `.env.example` in ECS task definitions.

### Scaling
- ECS auto-scaling based on CPU/memory
- DocumentDB read replicas for analytics queries
- ElastiCache cluster mode for high throughput
- S3 + CloudFront for static assets and image serving

### Monitoring
- CloudWatch for logs and metrics
- X-Ray for distributed tracing
- SNS alerts for service health
