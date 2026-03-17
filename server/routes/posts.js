const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // The middleware we discussed
const Opportunity = require('../models/Opportunity');


router.post('/create', auth, async (req, res) => {
  try {
    const newPost = new Opportunity({
      ...req.body,
      ngoId: req.user.id
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all posts for a specific NGO
router.get('/my-posts', auth, async (req, res) => {
  try {
    const posts = await Opportunity.find({ ngoId: req.user.id }).populate('assignedVolunteer', 'name email');
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- APPLY FOR AN OPPORTUNITY ---
router.put('/apply/:id', auth, async (req, res) => {
  try {
    // 1. Find the opportunity by ID
    let post = await Opportunity.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Opportunity not found' });
    
    // 2. Check if already assigned
    if (post.assignedVolunteer) {
      return res.status(400).json({ msg: 'This position is already filled' });
    }

    // 3. Assign the volunteer (req.user.id comes from the Auth Middleware)
    post.assignedVolunteer = req.user.id;
    post.status = 'filled'; // Change status so others know it's taken

    await post.save();
    
    res.json({ msg: 'Application Successful!', post });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Get ALL opportunities for the "Explore" section
router.get('/all', auth, async (req, res) => {
  try {
    const posts = await Opportunity.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get MATCHED opportunities based on volunteer skills
router.get('/matched', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Find posts where at least one required skill is in the user's skill array
    const matchedPosts = await Opportunity.find({
      requiredSkills: { $in: user.skills },
      status: 'open'
    });
    res.json(matchedPosts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
// ALWAYS KEEP THIS AT THE VERY BOTTOM
module.exports = router;