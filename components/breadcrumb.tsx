import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@chakra-ui/react";
import Link from "next/link";

interface GalleryBreadcrumbProps {
    directoryPath: string;
}

export function GalleryBreadcrumb({ directoryPath }: GalleryBreadcrumbProps) {
    // split path by /
    console.log(directoryPath);
    const paths = directoryPath.split('/').filter(path => {
        if (path.length > 0) {
            return path;
        }
    });
    paths.unshift('Home');
    console.log(paths);

    return (
        <Breadcrumb>
            {paths.map((path, idx) => {
                return (
                    <BreadcrumbItem key={idx}>
                        <BreadcrumbLink href="#">{path}</BreadcrumbLink>
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumb>
    );
}