import Ticket from "../models/ticketModel.js";

// Récupérer tous les tickets
export const getalltickets = async (req, res) => {
  try {
    const tickets = await Ticket.find(); // Trouver tous les tickets dans la base de données
    res.status(200).json({
      status: "success",
      results: tickets.length,
      data: {
        tickets,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des tickets:", err); // Message d'erreur dans la console
    res.status(500).json({
      status: "fail",
      message: "Erreur serveur lors de la récupération des tickets",
    });
  }
};

//get TICKET by id
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        status: "fail",
        message: "ticket not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        ticket,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Créer un ticket
export const createTicket = async (req, res) => {
  try {
    const newTicket = await Ticket.create(req.body); // Création d'un nouveau ticket avec les données de la requête
    res.status(201).json({
      status: "success",
      data: {
        ticket: newTicket,
      },
    });
  } catch (err) {
    // Gestion des erreurs avec message détaillé
    res.status(400).json({
      status: "fail",
      message: err.message, // Affichage du message d'erreur
    });
  }
};

// Update TICKET by id

export const updateTicket = async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTicket) {
      return res.status(404).json({
        status: "fail",
        message: "ticket not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        ticket: updatedTicket,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete TICKET by id

export const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({
        status: "fail",
        message: "ticket not found for delete",
      });
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};


