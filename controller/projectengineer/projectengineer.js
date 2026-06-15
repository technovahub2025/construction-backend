const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const STATIC_MANAGER = {
      
      phone: "9876543210",
      password: "123456",
    };

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    const isValidLogin =
      password === STATIC_MANAGER.password &&
      phone === STATIC_MANAGER.phone;

    if (!isValidLogin) {
      return res.status(401).json({
        success: false,
        message: "Invalid project manager credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        phone: STATIC_MANAGER.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { login };
