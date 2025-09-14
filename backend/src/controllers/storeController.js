const prisma = require('../utils/prisma');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name) => {
  return name && name.length >= 20 && name.length <= 60;
};

const validateAddress = (address) => {
  return address && address.length <= 400;
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!validateName(name)) {
      return res.status(400).json({ message: 'Store name must be between 20 and 60 characters' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ message: 'Address is required and must be less than 400 characters' });
    }

    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID is required' });
    }

    const existingStore = await prisma.stores.findUnique({
      where: { email }
    });

    if (existingStore) {
      return res.status(400).json({ message: 'Store with this email already exists' });
    }

    const owner = await prisma.users.findUnique({
      where: { id: ownerId }
    });

    if (!owner) {
      return res.status(400).json({ message: 'Owner not found' });
    }

    await prisma.users.update({
      where: { id: ownerId },
      data: { role: 'STORE_OWNER' }
    });

    const store = await prisma.stores.create({
      data: {
        name,
        email,
        address,
        owner_id: ownerId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });

  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const stores = await prisma.stores.findMany({
      where,
      orderBy,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        ratings: {
          select: {
            rating: true
          }
        }
      }
    });

    const storesWithRatings = stores.map(store => {
      const averageRating = store.ratings.length > 0 
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length 
        : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        rating: Math.round(averageRating * 10) / 10,
        totalRatings: store.ratings.length,
        created_at: store.created_at
      };
    });

    res.json(storesWithRatings);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoresForUser = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const userId = req.user.userId;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const stores = await prisma.stores.findMany({
      where,
      orderBy,
      include: {
        ratings: {
          select: {
            rating: true,
            user_id: true
          }
        }
      }
    });

    const storesForUser = stores.map(store => {
      const allRatings = store.ratings;
      const userRating = allRatings.find(r => r.user_id === userId);
      const averageRating = allRatings.length > 0 
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length 
        : 0;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: Math.round(averageRating * 10) / 10,
        userRating: userRating ? userRating.rating : null,
        totalRatings: allRatings.length
      };
    });

    res.json(storesForUser);
  } catch (error) {
    console.error('Get stores for user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoreOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const store = await prisma.stores.findFirst({
      where: { owner_id: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const averageRating = store.ratings.length > 0 
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length 
      : 0;

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address
      },
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: store.ratings.length,
      ratings: store.ratings.map(rating => ({
        id: rating.id,
        rating: rating.rating,
        user: rating.user,
        createdAt: rating.created_at
      }))
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoresForUser,
  getStoreOwnerDashboard
};