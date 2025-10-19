import fs from 'fs/promises'
import path from 'path'

const copyAndRenameFile = async (srcPath, destDir) => {

    const newName = Array.from({ length: 10 }, () => Math.random().toString(36)[2]).join('')
    const ext = path.extname(srcPath)
    const newPath = path.join(destDir, newName + ext)

    try {
        await fs.mkdir(destDir, { recursive: true })

        await fs.copyFile(srcPath, newPath)

        return { success: true, newPath, key: newName }
    } catch (err) {
        return { success: false }
    }
}

export default copyAndRenameFile
