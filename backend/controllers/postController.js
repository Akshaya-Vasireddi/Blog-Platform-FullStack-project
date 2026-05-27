const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();
    const tag = req.query.tag?.trim();

    const query = { published: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name email')
        .populate('commentCount')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content'),
      Post.countDocuments(query),
    ]);

    res.json({
      success: true,
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email bio')
      .populate('commentCount');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment views
    await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, tags, coverImage, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      tags: tags?.map((t) => t.toLowerCase().trim()) || [],
      coverImage,
      published: published !== undefined ? published : true,
      author: req.user._id,
    });

    await post.populate('author', 'name email');

    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (owner only)
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    const { title, content, excerpt, tags, coverImage, published } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(tags && { tags: tags.map((t) => t.toLowerCase().trim()) }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && { published }),
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json({ success: true, post: updatedPost });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (owner only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete post and all its comments
    await Promise.all([
      Post.findByIdAndDelete(req.params.id),
      Comment.deleteMany({ post: req.params.id }),
    ]);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
