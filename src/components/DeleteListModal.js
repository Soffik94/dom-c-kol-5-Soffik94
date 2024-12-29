import React from "react";
import "./DeleteListModal.css";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t("deleteConfirmation")}</h2>
        <div className="modal-buttons">
          <Button variant="contained" color="error" onClick={onConfirm}>
            {t("delete")}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            {t("cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
