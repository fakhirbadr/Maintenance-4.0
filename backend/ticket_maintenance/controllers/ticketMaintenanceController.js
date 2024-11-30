import TicketMaintenance from "../models/TicketMaintenancemodel.js";

// Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await TicketMaintenance.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await TicketMaintenance.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new ticket
export const createTicket = async (req, res) => {
  const { name, site, province, technicien, categorie, description } = req.body;

  try {
    // Créez un nouveau ticket avec les nouveaux champs
    const newTicket = new TicketMaintenance({
      name,
      site,
      province,
      technicien,
      categorie,
      description,
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a ticket by ID
export const updateTicket = async (req, res) => {
  const { name } = req.body;
  try {
    const updatedTicket = await TicketMaintenance.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a ticket by ID
export const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await TicketMaintenance.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
