import { NextApiRequest, NextApiResponse } from "next";
import { promises, lstatSync } from "fs";
import { join } from "path";
import { cwd } from "process";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // base path is assumed to be 'public'
    const basePath = join(cwd(), 'public');
    // get the path of the directory we want to list files for
    const { directoryPath } = req.body;

    // error if directoryPath is not a string
    if (!directoryPath || typeof directoryPath !== 'string') {
        res.status(400).send('directoryPath_not_string');
        return;
    }
    // list all files in the selected directory
    try {
        // full path
        const fullPath = join(basePath, directoryPath);
        const filesList = await promises.readdir(fullPath);
        // filter only directories
        const directoriesList = filesList.filter((file) => {
            const fileStat = lstatSync(join(fullPath, file));
            const isDirectory = fileStat.isDirectory();
            const isHidden = (/(^|\/)\.[^\/\.]/g).test(file);
            // if it's a directory and it's not hidden...
            if (isDirectory && !isHidden) {
                return file;
            }
        });
        // filter only images
        const imagesList = filesList.filter((file) => {
            // check for file extensions and ignore hidden files
            if (/^(?!\.).+\.(jpg|jpeg|bmp|png|webp)$/.test(file)) {
                return file;
            }
        });

        // send lists back to page
        res.json({
            directories: directoriesList,
            images: imagesList,
        });
    }
    catch (err) {
        // most likely ENOENT
        res.json({
            error: 'directory_missing'
        });
    }
}