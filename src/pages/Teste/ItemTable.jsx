import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemTable = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/items");
      setItems(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des éléments", error);
    }
  };

  const handleAdd = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/items/${editId}`, { name });
      } else {
        await axios.post("http://localhost:5000/api/items", { name });
      }
      setName("");
      setEditId(null);
      fetchItems();
    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la mise à jour", error);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>{editId ? "Update" : "Add"}</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
