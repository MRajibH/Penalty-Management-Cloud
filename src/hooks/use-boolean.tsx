import { useState } from "react";

const useBoolean = (bool: boolean = false) => {
  const [open, setOpen] = useState(bool);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onToggle = () => setOpen((prev) => !prev);

  return { open, setOpen, onOpen, onClose, onToggle };
};

export default useBoolean;
