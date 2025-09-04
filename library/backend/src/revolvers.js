const { PubSub } = require('graphql-subscriptions')
const BookModel = require('./models/book')
const AuthorModel = require('./models/author')
const User = require('./models/user')
const pubSub = new PubSub()
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => BookModel.collection.countDocuments(),
    authorCount: async () => AuthorModel.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.genre) {
        return BookModel.find({}).populate('author')
      }
      return BookModel.find({ genres: args.genre }).populate('author')
    },
    allAuthors: async () => AuthorModel.find({}),
    me: async (root, args, context) => context.currentUser,
    favoriteBooks: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      return BookModel.find({ genres })
    }
  },
  Author: {
    bookCount: root => root.books.length
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      let author = await AuthorModel.findOne({ name: args.author })

      if (!author) {
        author = new AuthorModel({ name: args.author })
      }

      const newBook = new BookModel({ ...args, author })

      await newBook.save().catch(error => {
        throw new GraphQLError('Creating the book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      })

      author.books = author.books.concat(newBook)

      await author.save().catch(error => {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        })
      })

      pubSub.publish('BOOK_ADDED', { bookAdded: newBook })

      return newBook
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await AuthorModel.findOne({ name: args.name })
      if (!author) return null

      author.born = args.setBornTo
      try {
        return author.save()
      } catch (error) {
        throw new GraphQLError('Saving born failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save().catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterableIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers
