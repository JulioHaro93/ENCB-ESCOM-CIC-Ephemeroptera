import fs from 'fs/promises'
import path from 'path'

const copyAndRenameFile = async (urlPre, newDir) => {
    const newName = Array.from({ length: 10 }, () =>
        Math.random().toString(36)[2]
        ).join('')
    try {
      const ext = path.extname(urlPre)
      const newPath = path.join(newDir, newName + ext)
      await fs.mkdir(newDir, { recursive: true })
      await fs.copyFile(urlPre, newPath)
      console.log(newPath)
      console.log('Archivo copiado y renombrado correctamente')

      await fs.unlink(urlPre)
      console.log('Archivo original eliminado')
      

      return {success: true, newPath: newPath, key: newName}
    } catch (err) {
      console.error('Error al copiar/renombrar archivo:', err)
          const error ={success:false}
      return error
    }
}

export default copyAndRenameFile