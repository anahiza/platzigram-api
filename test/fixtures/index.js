export default {
  getImage () {
    return {
      id: '6e0ccd2d-f55c-4e66-82ed-ad168213fe39',
      publicId: '3lF0o4vhbGVVfHuCN58MNH',
      userId: 'platzigram',
      src: 'http://platzigram.test/3lF0o4vhbGVVfHuCN58MNH.jpg',
      description: '#awesome',
      tags: ['awesome'],
      createdAt: new Date().toString(),
      liked: false,
      likes: 0
    }
  },
  getImages () {
    return [
      this.getImage(),
      this.getImage(),
      this.getImage()
    ]
  },
  getImagesByTag () {
    return [
      this.getImage(),
      this.getImage()
    ]
  }
}
