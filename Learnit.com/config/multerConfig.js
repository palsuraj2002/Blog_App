const upload = {
  none: () => (req, res, next) => {
  
    req.body.imageUrl = req.body.imageUrl; // Simply pass through the imageUrl if it exists
    next();
  },
};


module.exports = upload;
