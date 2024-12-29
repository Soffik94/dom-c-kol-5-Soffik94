import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddListModal from "./AddListModal";
import DeleteListModal from "./DeleteListModal";
import "./AllLists.css";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { fetchLists, createList, deleteList } from "../api/api";

const currentUser = { userId: 2, userName: "Matěj", role: "member" };

const AllLists = () => {
  const { t } = useTranslation();
  const [lists, setLists] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  useEffect(() => {
    const getLists = async () => {
      try {
        const fetchedLists = await fetchLists(currentUser);
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };
    getLists();
  }, []);

  const addListHandler = async (newList) => {
    console.log("Adding new list:", newList);
    try {
      const createdList = await createList(newList, currentUser);
      console.log("List created successfully:", createdList);
      setLists((prev) => [...prev, createdList]);
    } catch (error) {
      console.error("Error adding list:", error);
    }
  };

  const deleteHandler = async (listId) => {
    console.log("Attempting to delete list with ID:", listId);
    try {
      await deleteList(listId, currentUser);
      console.log("List deleted successfully.");
      setLists((prev) => prev.filter((list) => list.listId !== listId));
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setModalOpen(true)}
        sx={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          fontSize: "18px",
        }}
      >
        {t("addList")}
      </Button>
      <section className="all-lists">
        {lists.map((oneList) => (
          <div className="list-and-delete" key={oneList.listId}>
            <Link
              to={`/listdetail/${oneList.listId}`}
              className="link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="detail-container3">
                <h1>{oneList.listName}</h1>
              </div>
            </Link>
            <IconButton
              aria-label={t("deleteList")}
              onClick={() => {
                setListToDelete(oneList.listId);
                setConfirmModalOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <AddListModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onAddList={addListHandler}
          user={currentUser}
        />
        <DeleteListModal
          isOpen={isConfirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={() => deleteHandler(listToDelete)}
        />
      </section>
    </div>
  );
};

export default AllLists;
