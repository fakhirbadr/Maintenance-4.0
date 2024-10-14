import fs from "fs/promises";

// Utilisation de l'importation dynamique pour charger les données depuis un fichier ES module
const loadUniteData = async () => {
  const { rows: unite } = await import("../../src/pages/actifs/Data.js");
  return unite;
};

export const checkID = async (req, res, next) => {
  try {
    const unite = await loadUniteData(); // Load unite data

    console.log(`unite id is :${req.params.id}`);
    if (req.params.id * 1 > unite.length) {
      return res.status(404).json({
        status: "fail",
        message: "invalid ID",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error loading unit data",
    });
  }
};
export const checkBody = async (req, res, next) => {
  if (!req.body.Nom || !req.body.Docteur) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or Docteur",
    });
  }
  next();
};

export const getAllUnite = async (req, res) => {
  const unite = await loadUniteData();

  res.status(200).json({
    status: "success",
    requestedAT: req.requestTime,
    results: unite.length,
    data: {
      unite,
    },
  });
};

export const getUnite = async (req, res) => {
  const unite = await loadUniteData();
  const id = req.params.id * 1;
  const uniteId = unite.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      uniteId,
    },
  });
};

export const createUnite = async (req, res) => {
  const unite = await loadUniteData();
  const newId = unite[unite.length - 1].id + 1;
  const newUnite = Object.assign({ id: newId }, req.body);

  unite.push(newUnite);

  try {
    const updatedData = `export const rows = ${JSON.stringify(
      unite,
      null,
      2
    )};`;
    await fs.writeFile("../src/pages/actifs/Data.js", updatedData);

    res.status(201).json({
      status: "success",
      data: {
        unite: newUnite,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Impossible d'enregistrer les données",
    });
  }
};

export const updateUnite = async (req, res) => {
  const unite = await loadUniteData();

  res.status(200).json({
    status: "success",
    data: {
      uniteId: "<Unité mise à jour ici ...>",
    },
  });
};

export const deleteUnite = async (req, res) => {
  const unite = await loadUniteData();

  res.status(204).json({
    status: "success",
    data: null,
  });
};
