import { useState, useEffect } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import "./Members.css";
import { addMember, deleteMember, fetchMembers } from "../api/api";

const Members = ({ listId, user }) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) return;
    const loadMembers = async () => {
      try {
        const fetchedMembers = await fetchMembers(listId);
        if (!fetchedMembers || !Array.isArray(fetchedMembers)) {
          throw new Error("Invalid members data.");
        }
        setMembers(fetchedMembers);
      } catch (error) {
        console.error("Error loading members:", error);
        setMembers([]);
      }
    };
    loadMembers();
  }, [listId, isSubmitting]);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const newMember = {
      userName: value.trim(),
      userId: Date.now(),
      role: "member",
    };

    if (!newMember.userName) {
      alert(t("emptyMemberNameAlert"));
      setIsSubmitting(false);
      return;
    }

    const isDuplicate = members.some(
      (member) =>
        member.userName.toLowerCase() === newMember.userName.toLowerCase()
    );
    if (isDuplicate) {
      alert(t("duplicateMemberAlert"));
      setIsSubmitting(false);
      return;
    }

    try {
      const addedMember = await addMember(listId, newMember, user);
      setMembers((prev) => [...prev, addedMember]);
      setValue("");
    } catch (error) {
      console.error("Error adding member:", error);
      alert(t("addMemberError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const clickHandler = async (userId) => {
    try {
      await deleteMember(listId, userId, user);
      setMembers((prev) => prev.filter((member) => member.userId !== userId));
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <div>
      <section className="detail-container2">
        <h1>{t("members")}</h1> {/* Přeložený nadpis */}
        {members.map((user, index) => {
          if (!user || !user.userId) return null;
          return (
            <div key={`${user.userId}-${index}`} className="item">
              <p>
                {user.userName} {user.isOwner ? t("ownerTag") : ""}
              </p>
              {!user.isOwner && (
                <IconButton onClick={() => clickHandler(user.userId)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          );
        })}
        <form onSubmit={submitFormHandler} className="form">
          <TextField
            placeholder={t("addUserPlaceholder")}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Button type="submit">{t("add")}</Button>
        </form>
      </section>
    </div>
  );
};

export default Members;
