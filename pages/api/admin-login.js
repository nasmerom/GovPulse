 // pages/api/admin-login.js

export default function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { email, password } = req.body;
  
    // Securely stored admin credentials (in production, use env vars)
    const ADMIN_EMAIL = 'anoah4049@gmail.com';
    const ADMIN_PASSWORD = 'Noahchurch';
  
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, isAdmin: true });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  }
  