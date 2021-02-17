import { GridItem, Box, Heading, useDisclosure } from "@chakra-ui/react";
import next from "next";
import Image from "next/image";
import { ImageModal } from "./imageModal";

interface ImageGridItemProps {
    directoryPath: string;
    imageName: string;
    previousImageName?: string;
    nextImageName?: string;
}

export function ImageGridItem(props: ImageGridItemProps) {
    // get the full image path
    const imagePath = `${props.directoryPath}${props.imageName}`;
    const previousImagePath = props.previousImageName ? `${props.directoryPath}${props.previousImageName}` : undefined;
    const nextImagePath = props.nextImageName ? `${props.directoryPath}${props.nextImageName}` : undefined;

    // stuff for modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box bg="purple.50" borderWidth="1px" borderRadius="lg" shadow="md" cursor="pointer" overflow="hidden" onClick={onOpen}>
                {/* need position: relative to make layout=fill work */}
                <Box w="100%" h="200px" position="relative">
                    <Image src={imagePath} layout="fill" quality={70} objectFit="cover"></Image>
                </Box>
                <Box p={2}>
                    <Heading as="h3" size="sm">{props.imageName}</Heading>
                </Box>
            </Box>
            <ImageModal
                imagePath={imagePath}
                previousImagePath={previousImagePath}
                nextImagePath={nextImagePath}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose} />
        </>
    );
}