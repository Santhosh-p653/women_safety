# ☁️ AWS Backend Setup Guide

This guide explains how to set up AWS services for the project using:

- S3 Bucket (storage & hosting)
- Bucket Permissions & Policy
- Event Notifications
- API Gateway

---

## 📌 Prerequisites

- AWS Account  
- Basic knowledge of AWS Console  
- IAM user with required permissions  

---

## 🪣 Step 1: Create S3 Bucket

1. Go to **AWS Console**
2. Navigate to **S3**
3. Click **Create bucket**
4. Enter:
   - Bucket name (must be unique)
   - Region (choose nearest)
5. Uncheck:
   - **Block all public access** (if hosting frontend)
6. Click **Create bucket**

---

## 🔓 Step 2: Configure Bucket Permissions

1. Open your bucket  
2. Go to **Permissions** tab  
3. Under **Block public access**:
   - Disable all (only if needed for public access)
4. Save changes  

---

## 📜 Step 3: Add Bucket Policy

1. Go to **Permissions → Bucket Policy**
2. Add the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadAccess",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```
Replace YOUR-BUCKET-NAME with your actual bucket name
Save changes
🌐 Step 4: Enable Static Website Hosting
Go to Properties tab
Scroll to Static website hosting
Click Enable
Set:
Index document: index.html
Save changes
Step 5: Add Event Notification
Go to Properties tab
Scroll to Event notifications
Click Create event notification
Configure:
Name: file-upload-event
Event types: PUT (Object Created)
Choose destination:
SNS / SQS / Lambda (based on use case)
Save
🚪 Step 6: Setup API Gateway
Go to API Gateway
Click Create API
Choose:
HTTP API (recommended for simplicity)
Configure API:
Add Integration
Lambda / HTTP endpoint
Create Routes
Example:
GET /posts
POST /sos
Deploy API:
Create a stage (e.g., dev)
Copy the Invoke URL
🔗 Step 7: Connect Frontend to API
Open your script.js
Use fetch:
JavaScript
fetch('https://your-api-id.execute-api.region.amazonaws.com/dev/posts')
  .then(res => res.json())
  .then(data => console.log(data));
🧪 Step 8: Test the Setup
Open S3 hosted site
Trigger API requests
Upload file to S3 → check notification trigger
