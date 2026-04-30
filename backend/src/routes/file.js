import express from 'express';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';

const router = express.Router();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

router.post('/upload', authMiddleware, async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  try {
    const data = await s3.upload(params).promise();
    res.json({ url: data.Location });
  } catch (e) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

router.post('/upload', (req, res) => {
  // No real upload, just return a mock URL
  res.json({ url: 'https://mock-s3.amazonaws.com/fake-bucket/' + Date.now() + '.jpg' });
});

export default router;
