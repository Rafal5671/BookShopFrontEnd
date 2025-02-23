"use client"; 
import { useAuth } from "@/hooks/useAuth";
import { Modal, Button, ModalHeader, ModalContent, ModalBody, ModalFooter } from "@nextui-org/react";

export default function GlobalSessionModal() {
  const { sessionExpired, logout } = useAuth();


  return (
    <Modal
      isOpen={sessionExpired}
      onOpenChange={() => {}}
      isDismissable={false} 
    >
      <ModalContent>
        <ModalHeader>Twoja sesja wygasła</ModalHeader>
        <ModalBody>
          Zaloguj się ponownie, aby kontynuować korzystanie z aplikacji.
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
