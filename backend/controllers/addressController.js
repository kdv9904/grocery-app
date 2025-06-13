import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    // Get userId from req.userId (set by the authUser middleware)
    const userId = req.userId;

    const address = req.body.address;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required.  Authentication failed." }); // 401 Unauthorized
    }

    if (!address) {
      return res.status(400).json({ success: false, message: "Address data is required" }); // 400 Bad Request
    }

    await Address.create({ ...address, userId });

    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    // Get userId from req.userId (set by the authUser middleware)
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User ID is required. Authentication failed." });
    }

    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
