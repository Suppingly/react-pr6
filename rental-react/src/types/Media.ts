export interface Media {
  id: number
  title: string
  desc: string
  category: string
  type: string
  filePath?: string | null
  author: string
  createdAt?: string
}

export interface UpdateMedia {
  media: Media
  authors: Authors[]
  onSave: () => void
  onClose: () => void
}
export interface DeleteMedia {
  id: Number
  onSave: () => void
  onClose: () => void
}
export interface Authors {
  id: number
  name: string
}
export interface MediaExtend extends Media {
  ratingAvgScore: number
  count: number
}