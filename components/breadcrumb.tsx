import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Link from "next/link";

interface GalleryBreadcrumbProps {
    directoryPath: string;
}

export function GalleryBreadcrumb({ directoryPath }: GalleryBreadcrumbProps) {
    // split path by /
    const paths = directoryPath.split('/').filter(path => {
        if (path.length > 0) {
            return path;
        }
    });
    // add home path
    paths.unshift('Home');

    // function to reconstruct breadcrumb path for link
    const reconstructPath = (idx: number) => {
        let reconstructedPath = '/?directoryPath=/';
        if (idx > 0) {
            for (let i = 1; i <= idx; i++) {
                reconstructedPath += `${paths[i]}/`;
            }
        }
        return reconstructedPath;
    };

    return (
        <Breadcrumb colorScheme="purple">
            {paths.map((path, idx) => {
                const href = reconstructPath(idx);
                return (
                    <BreadcrumbItem key={idx}>
                        <BreadcrumbLink as={Link} href={href} isCurrentPage={idx === paths.length - 1 ? true : false}>{path}</BreadcrumbLink>
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumb>
    );
}