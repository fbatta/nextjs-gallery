import { NextApiRequest, NextApiResponse } from "next";
import { promises, lstatSync } from "fs";
import { join } from "path";
import { cwd } from "process";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // base path is assumed to be 'public'
    const basePath = join(cwd(), 'public');
    // get the path of the directory we want to list files for
    const { directoryPath, password } = req.body;

    // error if directoryPath is not a string
    if (!directoryPath || typeof directoryPath !== 'string') {
        res.status(400).send('directoryPath_not_string');
        return;
    }
    // list all files in the selected directory
    try {
        // full path
        const fullPath = join(basePath, directoryPath);
        // do not allow listing parent directories with ..
        const isParent = (/\.{2}/g).test(directoryPath);
        // if it's a directory and it's not hidden...
        if (isParent) {
            res.json({ error: 'cannot_list_parent_directories' });
            return;
        }
        const filesList = await promises.readdir(fullPath);
        // check if fodler contains a .password file
        if (filesList.indexOf('.password') !== - 1) {
            // send a request for password if no password provided
            if (!password) {
                res.json({
                    passwordRequired: true,
                });
                return;
            }
            // read contents of .password file
            const folderPassword = await promises.readFile(filesList[filesList.indexOf('.password')], { encoding: 'utf8' });
            console.log(folderPassword);
            if (password !== folderPassword) {
                res.json({
                    passwordRequired: true,
                    error: 'invalid_password',
                });
                return;
            }
        }
        // filter only directories
        const directoriesList = filesList.filter((file) => {
            const fileStat = lstatSync(join(fullPath, file));
            const isDirectory = fileStat.isDirectory();
            const isHidden = (/(^|\/)\.[^\/\.]/g).test(file);
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
