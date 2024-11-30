import Fourniture from "../models/ticketFournitureModel.js";

// Get all Fournitures
export const getAllFournitures = async (req, res) => {
  try {
    const fournitures = await Fourniture.find();
    res.status(200).json(fournitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Fourniture by ID
export const getFournitureById = async (req, res) => {
  try {
    const fourniture = await Fourniture.findById(req.params.id);
    if (!fourniture) {
      return res.status(404).json({ message: "Fourniture not found" });
    }
    res.status(200).json(fourniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new Fourniture
export const createFourniture = async (req, res) => {
  const { name, categorie, besoin, quantite, technicien } = req.body;

  try {
    // Create a new Fourniture with the provided fields
    const newFourniture = new Fourniture({
      name,
      categorie,
      besoin,
      quantite,
      technicien,
    });

    await newFourniture.save();
    res.status(201).json(newFourniture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a Fourniture by ID
export const updateFourniture = async (req, res) => {
  const { name, categorie, besoin, quantite } = req.body;

  try {
    // Update the Fourniture with the provided fields
    const updatedFourniture = await Fourniture.findByIdAndUpdate(
      req.params.id,
      { name, categorie, besoin, quantite },
      { new: true }
    );

    if (!updatedFourniture) {
      return res.status(404).json({ message: "Fourniture not found" });
    }

    res.status(200).json(updatedFourniture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Fourniture by ID
export const deleteFourniture = async (req, res) => {
  try {
    const deletedFourniture = await Fourniture.findByIdAndDelete(req.params.id);

    if (!deletedFourniture) {
      return res.status(404).json({ message: "Fourniture not found" });
    }

    res.status(200).json({ message: "Fourniture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
