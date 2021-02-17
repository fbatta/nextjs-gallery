import { GridItem, Box, Heading, Center, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { FcFolder } from "react-icons/fc";

interface FolderGridItemProps {
    currentDirectoryPath: string;
    directoryPath: string;
}

export function FolderGridItem(props: FolderGridItemProps) {
    const href = `/?directoryPath=${props.currentDirectoryPath}${props.directoryPath}/`;

    return (
        <Link href={href}>
            <Box bg="purple.50" p={4} borderWidth="1px" borderRadius="lg" shadow="md" cursor="pointer" h="full">
                <Center>
                    <Icon h={20} w={20} display="block">
                        <FcFolder></FcFolder>
                    </Icon>
                </Center>
                <Center>
                    <Heading as="h2" size="md">
                        {props.directoryPath}
                    </Heading>
                </Center>
            </Box>
        </Link>
    );
}