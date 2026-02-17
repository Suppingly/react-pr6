import { prisma } from '../app.js'

class MediaService {
  async create({ title, desc, category, type, userId, author, filePath }) {
    return prisma.mediaItem.create({
      data: { title, desc, category, type, userId, author, filePath },
    })
  }

  async getAll(filters = {}) {
    const { category, type, search } = filters
    const where = {
      ...(category ? { category } : {}),
      ...(type ? { type } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { desc: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    return prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getAllByUser(userId, filters = {}) {
    const { category, type, search } = filters
    const where = {
      userId,
      ...(category ? { category } : {}),
      ...(type ? { type } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { desc: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }

    return prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getById(id) {
    return prisma.mediaItem.findUnique({
      where: { id: Number(id) },
    })
  }

  async update({ id, title, desc, category, type, author, filePath }) {
    const updateData = { title, desc, category, type, author }
    if (filePath !== undefined) {
      updateData.filePath = filePath
    }
    return prisma.mediaItem.update({
      where: { id: Number(id) },
      data: updateData,
    })
  }

  async delete(id) {
    return prisma.mediaItem.delete({
      where: { id: Number(id) },
    })
  }

  async getRating({mediaId,userId}) {
    return await prisma.rating.findUnique(
      where: { userId: Number(userId),mediaId: Number(mediaId) },
    )
  }
  
  async set_rating({ratingScore,mediaId,userId}) {
    await prisma.rating.upsert({
      where: {postId_userId:{userId,userId}},
      update: {ratingScore},
      create: {ratingScore,mediaId,userId}
    })
    const stats = await prisma.rating.aggregate({
      where: { userId },
      avg: { value: true },
      count: { value: true },
    })
    const newAverage = stats.avg.value || 0
    const newCount = stats.count.value || 0
    const updated = await prisma.mediaItem.update({
        where: { id: userId },
        data: {
          averageRating: newAverage,
          ratingCount: newCount,
        },
    })
    return {
      average: updated.averageRating,
      count: updated.ratingCount,
    }
  }
}


export default new MediaService()
