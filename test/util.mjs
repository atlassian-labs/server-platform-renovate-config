import fs from 'fs';
import { extname } from 'path';

export const configFiles = async () => {
    const dirEntries = await fs.promises.readdir(process.cwd(), { withFileTypes: true });
    const dirFiles = dirEntries.filter(dirent => dirent.isFile());
    return dirFiles
        .filter(dirent => extname(dirent.name) === ".json")
        .map(dirent => dirent.name)
        .filter(name => name !== "package.json" && name !== "package-lock.json");
}
