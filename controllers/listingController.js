const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
    const { foodName, quantity, location } = req.body;
    try {
        const listing = new Listing({
            foodName,
            quantity,
            location,
            listedBy: req.user.id
        });
        await listing.save();
        res.json(listing);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getListings = async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'available' }).populate('listedBy', 'name');
        res.json(listings);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
