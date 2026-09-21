import express from 'express';
import bcrypt from 'bcryptjs';
import { dbStore } from '../db/store.js';
import { generateToken, authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, preferredLanguage, favoriteGenres, favoriteContentTypes } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = dbStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = dbStore.createUser({
      name,
      email,
      password: hashedPassword,
      preferredLanguage: preferredLanguage || 'English',
      favoriteGenres: favoriteGenres || [],
      favoriteContentTypes: favoriteContentTypes || ['anime', 'manga', 'donghua', 'manhwa', 'manhua'],
      onboardingCompleted: false,
    });

    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = dbStore.findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    res.json({
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/auth/profile
router.get('/profile', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, preferredLanguage, favoriteGenres, favoriteContentTypes, onboardingCompleted, avatar } = req.body;

  const updatedUser = dbStore.updateUser(req.user.id, {
    ...(name && { name }),
    ...(preferredLanguage && { preferredLanguage }),
    ...(favoriteGenres && { favoriteGenres }),
    ...(favoriteContentTypes && { favoriteContentTypes }),
    ...(onboardingCompleted !== undefined && { onboardingCompleted }),
    ...(avatar && { avatar }),
  });

  if (!updatedUser) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }

  const { password: _, ...safeUser } = updatedUser;
  res.json({ message: 'Profile updated successfully', user: safeUser });
});

export default router;
