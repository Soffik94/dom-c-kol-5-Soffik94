import { TextField } from "@mui/material";
import "./Modal.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const AddListModal = ({ isOpen, onClose, onAddList, user }) => {
  const { t } = useTranslation();
  const [listName, setListName] = useState("");

  if (!isOpen) return null;

  const addShoppingList = async (event) => {
    event.preventDefault();

    if (!listName.trim()) {
      alert(t("emptyListNameAlert"));
      return;
    }

    const newList = {
      listName: listName.trim(),
      items: [],
      ownerID: user.userId,
    };

    console.log("Creating new list with data:", newList);

    try {
      onAddList(newList);
      setListName("");
      onClose();
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t("addNewList")}</h2>
        <form onSubmit={addShoppingList}>
          <TextField
            label={t("listName")}
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
            fullWidth
          />
          <button type="submit" className="close-btn">
            {t("add")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListModal;
