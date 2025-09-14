const prisma = require('../utils/prisma');

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.userId;

    if (!storeId || !rating) {
      return res.status(400).json({ message: 'Store ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const store = await prisma.stores.findUnique({
      where: { id: storeId }
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const existingRating = await prisma.ratings.findUnique({
      where: {
        user_id_store_id: {
          user_id: userId,
          store_id: storeId
        }
      }
    });

    let result;

    if (existingRating) {
      result = await prisma.ratings.update({
        where: {
          user_id_store_id: {
            user_id: userId,
            store_id: storeId
          }
        },
        data: { rating },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.json({
        message: 'Rating updated successfully',
        rating: result
      });
    } else {
      result = await prisma.ratings.create({
        data: {
          user_id: userId,
          store_id: storeId,
          rating
        },
        include: {
          store: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.status(201).json({
        message: 'Rating submitted successfully',
        rating: result
      });
    }

  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const ratings = await prisma.ratings.findMany({
      where: { user_id: userId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json(ratings);
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.userId;

    const rating = await prisma.ratings.findUnique({
      where: {
        user_id_store_id: {
          user_id: userId,
          store_id: parseInt(storeId)
        }
      }
    });

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    await prisma.ratings.delete({
      where: {
        user_id_store_id: {
          user_id: userId,
          store_id: parseInt(storeId)
        }
      }
    });

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitRating,
  getUserRatings,
  deleteRating
};