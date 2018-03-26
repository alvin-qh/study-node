import fs from "fs";
import path from "path";

export default (dir) => {
    return fs.readdirSync(dir).filter((file) => {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}