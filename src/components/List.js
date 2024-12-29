import { useEffect, useState } from "react";
import { Button, Checkbox, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import "./List.css";
import {
  fetchLists,
  addItemToList,
  deleteItem,
  updateItem,
  archiveList,
  updateListName,
} from "../api/api";

const List = ({ listId, user }) => {
  const { t } = useTranslation();
  const [list, setList] = useState(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const getList = async () => {
      try {
        const fetchedLists = await fetchLists(user);
        const currentList = fetchedLists.find((list) => list.listId === listId);
        setList(currentList || null);
        setNewName(currentList?.listName || "");
      } catch (error) {
        console.error("Error fetching list:", error);
      } finally {
        setLoading(false);
      }
    };
    getList();
  }, [listId, user]);

  const handleNameChange = async () => {
    if (!newName.trim()) {
      alert(t("emptyListNameAlert"));
      return;
    }

    try {
      const updatedList = await updateListName(listId, newName, user);
      setList(updatedList);
      alert(t("listNameUpdated"));
    } catch (error) {
      console.error("Error updating list name:", error);
    }
  };

  const archiveHandler = async () => {
    try {
      const archivedList = await archiveList(listId, user);
      setList((prev) => ({ ...prev, ...archivedList }));
      alert(t("listArchived"));
    } catch (error) {
      console.error("Error archiving list:", error);
    }
  };

  const addItemHandler = async (event) => {
    event.preventDefault();
    if (!value.trim()) return;

    const newItem = { name: value.trim(), amount: 1, resolved: false };
    try {
      const updatedItems = await addItemToList(listId, newItem, user);
      setList((prev) => ({
        ...prev,
        items: updatedItems,
      }));
      setValue("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteItemHandler = async (itemName) => {
    try {
      await deleteItem(listId, itemName, user);
      setList((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.name !== itemName),
      }));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const toggleResolvedHandler = async (itemName) => {
    const item = list.items.find((item) => item.name === itemName);
    const updatedItem = { ...item, resolved: !item.resolved };
    try {
      await updateItem(listId, itemName, updatedItem, user);
      setList((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.name === itemName ? updatedItem : item
        ),
      }));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const toggleFilter = () => {
    setShowOnlyUnresolved((prev) => !prev);
  };

  if (loading) return <p>{t("loadingList")}</p>;

  if (!list) {
    return <p>{t("listNotFound")}</p>;
  }

  const filteredItems = showOnlyUnresolved
    ? list.items.filter((item) => !item.resolved)
    : list.items;

  return (
    <div>
      <section className="detail-container1">
        {list.ownerID === user.userId ? (
          <div className="edit-name">
            <TextField
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              label={t("listName")}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleNameChange}
              style={{ marginTop: "10px" }}
            >
              {t("rename")}
            </Button>
          </div>
        ) : (
          <h1>{list.listName}</h1>
        )}
        {list.ownerID === user.userId && (
          <Button
            variant="contained"
            color="secondary"
            onClick={archiveHandler}
            style={{ marginBottom: "20px" }}
          >
            {t("archiveList")}
          </Button>
        )}
        <form onSubmit={addItemHandler} className="form">
          <TextField
            placeholder={t("addItemPlaceholder")}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Button type="submit" variant="contained">
            {t("add")}
          </Button>
        </form>

        <Button className="filter-button" onClick={toggleFilter}>
          {showOnlyUnresolved ? t("showAll") : t("showUnresolvedOnly")}
        </Button>

        {filteredItems.map((item) => (
          <div key={item.name} className="item">
            <p>
              {item.name} - {item.amount}
            </p>
            <IconButton
              aria-label="delete"
              onClick={() => deleteItemHandler(item.name)}
            >
              <DeleteIcon />
            </IconButton>
            <Checkbox
              checked={item.resolved}
              onChange={() => toggleResolvedHandler(item.name)}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default List;
