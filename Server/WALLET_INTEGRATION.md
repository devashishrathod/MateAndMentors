# Wallet & Razorpay Integration Manual

## Environment Variables Required
Add these to your `.env` file:
```bash
# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard

# Optional: ensure existing
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongo_uri
PORT=8090
```

## API Endpoints (Base: /mateandmentors/wallet)

### 1. Create Wallet Topup Order (User)
- **POST** `/order/create`
- **Headers:** `Authorization: Bearer <JWT>`
- **Body:**
```json
{
  "amount": 5000,
  "currency": "INR"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "razorpayOrderId": "order_...",
    "amount": 5000,
    "currency": "INR",
    "keyId": "rzp_..."
  }
}
```

### 2. Verify Wallet Topup (User)
- **POST** `/verify`
- **Headers:** `Authorization: Bearer <JWT>`
- **Body:**
```json
{
  "razorpayOrderId": "order_...",
  "razorpayPaymentId": "pay_...",
  "razorpaySignature": "..."
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Payment verified and wallet credited",
  "data": {
    "walletTransactionId": "...",
    "amount": 5000,
    "currency": "INR",
    "closingBalance": 5000
  }
}
```

### 3. Get Wallet (User)
- **GET** `/`
- **Headers:** `Authorization: Bearer <JWT>`
- **Response:**
```json
{
  "success": true,
  "message": "Wallet fetched successfully",
  "data": {
    "walletId": "...",
    "balances": {
      "INR": 5000,
      "USD": 0
    },
    "isActive": true
  }
}
```

### 4. Get Wallet History (User)
- **GET** `/history?page=1&limit=10&currency=INR&status=SUCCESS`
- **Headers:** `Authorization: Bearer <JWT>`
- **Response:** paginated list of wallet transactions with opening/closing balances.

### 5. Get Admin Wallet History (Admin)
- **GET** `/admin/history?page=1&limit=10&userId=...`
- **Headers:** `Authorization: Bearer <JWT>` (role: ADMIN)
- **Response:** paginated list with user details.

### 6. Razorpay Webhook
- **POST** `/webhook/razorpay`
- **Headers:** `x-razorpay-signature: <signature>`
- **Body:** Razorpay webhook payload (payment.captured event)
- No auth required.

## Manual Testing Steps

### Prerequisites
- Ensure Razorpay keys are set in `.env`.
- Create a test user (JWT token needed).

### 1. Create Order
```bash
curl -X POST http://localhost:8090/mateandmentors/wallet/order/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{"amount":5000,"currency":"INR"}'
```

### 2. Simulate Payment (Razorpay Test Mode)
Use Razorpay Test Card on frontend or Razorpay Checkout SDK to complete payment. You’ll get `razorpayPaymentId` and `razorpaySignature`.

### 3. Verify Payment
```bash
curl -X POST http://localhost:8090/mateandmentors/wallet/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{
    "razorpayOrderId":"order_...",
    "razorpayPaymentId":"pay_...",
    "razorpaySignature":"..."
  }'
```

### 4. Check Wallet
```bash
curl -X GET http://localhost:8090/mateandmentors/wallet/ \
  -H "Authorization: Bearer <JWT>"
```

### 5. Check History
```bash
curl -X GET "http://localhost:8090/mateandmentors/wallet/history?page=1&limit=5" \
  -H "Authorization: Bearer <JWT>"
```

## Webhook Testing (Optional)
Use ngrok to expose local server to Razorpay:
```bash
ngrok http 8090
```
Set the ngrok URL in Razorpay Dashboard > Webhooks with endpoint: `https://<ngrok-id>.ngrok.io/mateandmentors/wallet/webhook/razorpay`.

## Idempotency & Safety
- Duplicate verification with same `razorpayPaymentId` is rejected.
- Webhook also checks for already processed payments.
- Wallet balance updates are atomic with transaction records.

## Notes
- Currency conversion is not implemented; balances are stored per currency.
- Amounts are stored as major units (e.g., 5000 INR), not smallest units.
- Ensure your Razorpay account is in Test Mode for testing.
