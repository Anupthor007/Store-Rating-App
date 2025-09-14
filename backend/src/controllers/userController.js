const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
  return passwordRegex.test(password);
};

const validateName = (name) => {
  return name && name.length >= 20 && name.length <= 60;
};

const validateAddress = (address) => {
  return address && address.length <= 400;
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.users.count();
    const totalStores = await prisma.stores.count();
    const totalRatings = await prisma.ratings.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!validateName(name)) {
      return res.status(400).json({ message: 'Name must be between 20 and 60 characters' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' 
      });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ message: 'Address is required and must be less than 400 characters' });
    }

    if (!['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role) where.role = role;

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const users = await prisma.users.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        created_at: true,
        ownedStores: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: {
                rating: true
              }
            }
          }
        }
      }
    });

    const usersWithRatings = users.map(user => {
      if (user.role === 'STORE_OWNER' && user.ownedStores.length > 0) {
        const store = user.ownedStores[0];
        const ratings = store.ratings;
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
          : 0;
        
        return {
          ...user,
          storeRating: Math.round(averageRating * 10) / 10,
          ownedStores: undefined
        };
      }
      return {
        ...user,
        ownedStores: undefined
      };
    });

    res.json(usersWithRatings);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        created_at: true,
        ownedStores: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: {
                rating: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let userWithRating = { ...user };

    if (user.role === 'STORE_OWNER' && user.ownedStores.length > 0) {
      const store = user.ownedStores[0];
      const ratings = store.ratings;
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
      
      userWithRating.storeRating = Math.round(averageRating * 10) / 10;
    }

    userWithRating.ownedStores = undefined;

    res.json(userWithRating);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
  createUser,
  getAllUsers,
  getUserById
};