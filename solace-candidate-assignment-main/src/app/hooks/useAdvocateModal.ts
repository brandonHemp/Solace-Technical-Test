import { useState, useCallback } from "react";
import { Advocate } from "./useAdvocates";

export const useAdvocateModal = () => {
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | undefined>();
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = useCallback((advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedAdvocate(undefined);
  }, []);

  return {
    selectedAdvocate,
    modalVisible,
    openModal,
    closeModal,
  };
}; 