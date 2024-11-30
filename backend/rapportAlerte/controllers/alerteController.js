import Alert from "../models/alerteModel.js";

export const getAllAlert = async (req, res) => {
  try {
    const alerte = await Alert.find();
    res.status(200).json({
      status: "success",
      results: alerte.length, // Correction du typo
      data: {
        alerte, // Correction de la variable
      },
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des alertes :", err.message); // Log précis
    res.status(500).json({
      status: "fail",
      message: "Erreur serveur lors de la récupération des alertes",
    });
  }
};

export const getAlert = async (req, res) => {
  try {
    const alerte = await Alert.findById(req.params.id);

    if (!alerte) {
      // Correction du mauvais nom de variable
      return res.status(404).json({
        status: "fail",
        message: "Alerte introuvable",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        alerte,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la récupération de l'alerte :", err.message); // Log précis
    res.status(400).json({
      status: "fail",
      message: "Erreur de requête : " + err.message,
    });
  }
};

export const createAlert = async (req, res) => {
  try {
    const newAlert = await Alert.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        alert: newAlert,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la création de l'alerte :", err.message); // Log précis
    res.status(400).json({
      status: "fail",
      message: "Erreur de création : " + err.message,
    });
  }
};
