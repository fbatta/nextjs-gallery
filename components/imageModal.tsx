import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, ModalFooter, Button } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

interface ImageModalProps {
    imagePath: string;
    previousImagePath?: string;
    nextImagePath?: string;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export function ImageModal({ imagePath, previousImagePath, nextImagePath, isOpen, onOpen, onClose }: ImageModalProps) {
    const [imageToShow, setImageToShow] = useState(imagePath);

    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            size="full"
            isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Image
                        src={imagePath}
                        layout="fill"
                        objectFit="contain" />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose} colorScheme="purple">Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}