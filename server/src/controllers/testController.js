const protectedTest = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user
  });
};

module.exports = {
  protectedTest
};