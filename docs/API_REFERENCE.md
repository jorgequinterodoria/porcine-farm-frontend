# PorciFarm API Reference

Welcome to the PorciFarm API documentation. This guide is designed to help frontend developers integrate with the backend system effectively.

## 🚀 General Information

- **Base URL**: `http://localhost:3000/api` (Development)
- **Content-Type**: `application/json`
- **Authentication**: JWT via Bearer Token
  - Header: `Authorization: Bearer <your_token>`

### Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

---

## 🔐 Authentication Module (`/auth`)

### POST `/auth/login`
Authenticates a user and returns a token.
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "super_admin", "tenantId": null },
    "tenant": null,
    "token": "eyJhbG...",
    "expiresIn": "24h"
  }
}
```

### POST `/auth/register`
Creates a new tenant and its administrator.
- **Body**: `{ "email": "...", "password": "...", "firstName": "...", "lastName": "...", "tenantName": "...", "subdomain": "..." }`

### GET `/auth/profile`
Returns current user information.
- **Headers**: `Authorization: Bearer <token>`

---

## 🏢 Tenants Module (`/tenants`)
*Requires `super_admin` role.*

### GET `/tenants`
List all organizations in the system.

### POST `/tenants`
Create a new farm/organization.
- **Body**: `{ "name": "...", "subdomain": "...", "email": "...", "subscriptionPlan": "free|pro|enterprise" }`

---

## 🐖 Animals & Batches Modules (`/animals`, `/batches`)

### GET `/animals`
List all active animals for the current tenant.
- **Query Params**: `?status=active`, `?breedId=...`

### POST `/animals`
Register a new animal.
- **Body**: `{ "internalCode": "P001", "sex": "female", "birthDate": "2023-10-01", "purpose": "breeding" }`

### GET `/batches`
List all animal batches.

---

## 🏗️ Infrastructure Module (`/infrastructure`)

### GET `/infrastructure/facilities`
List barns, buildings, or designated areas.

### POST `/infrastructure/pens`
Create a pen within a facility.
- **Body**: `{ "facilityId": "...", "code": "C1", "name": "Corral 1", "capacity": 20 }`

---

## 🩺 Health & Sanity (`/health`)

### GET `/health/medications` | `/health/vaccines` | `/health/diseases`
Retrieve master catalogs.

### POST `/health/records`
Register a clinical event for an animal or batch.
- **Body**:
```json
{
  "recordType": "individual",
  "animalId": "...",
  "diseaseId": "...",
  "diagnosis": "...",
  "treatmentPlan": "..."
}
```

---

## 🔄 Reproduction Cycle (`/reproduction`)

### POST `/reproduction/breeding`
Register a breeding service (AI or natural).
- **Body**: `{ "femaleId": "...", "serviceDate": "2024-01-21", "serviceType": "ai" }`

### POST `/reproduction/farrowing`
Register a farrowing (birth event).
- **Body**:
```json
{
  "pregnancyId": "...",
  "motherId": "...",
  "pigletsBornAlive": 12,
  "pigletsBornDead": 1,
  "farrowingDate": "2024-05-15"
}
```

---

## 🍽️ Feeding & Inventory (`/feeding`)

### POST `/feeding/movements`
Add stock to inventory (e.g., purchasing soy or corn).
- **Body**: `{ "feedTypeId": "...", "movementType": "purchase", "quantityKg": 500, "unitCost": 0.5 }`

### POST `/feeding/consumption`
Log daily consumption for a pen or batch.
- **Body**: `{ "feedTypeId": "...", "quantityKg": 45, "penId": "...", "consumptionDate": "2024-01-21" }`

---

## 💰 Financials & Sales (`/financial`)

### POST `/financial/transactions`
Register general income or expenses.

### POST `/financial/sales`
Sell animals to a customer. **Automatically updates animal status to 'sold'**.
- **Body**:
```json
{
  "saleDate": "2024-01-21",
  "customerName": "Meat Processor Inc.",
  "totalAmount": 2500,
  "details": [
    { "animalId": "...", "subtotal": 1250 },
    { "animalId": "...", "subtotal": 1250 }
  ]
}
```

---

## ⚙️ Operations (`/operations`)

### GET `/operations/tasks`
List assigned work tasks.

### PATCH `/operations/tasks/:id/status`
Update task progress.
- **Body**: `{ "status": "completed" }`

### GET `/operations/notifications`
Retrieve real-time alerts for the user.
