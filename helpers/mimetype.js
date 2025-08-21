import fs from 'fs'
import { fileTypeFromBuffer } from 'file-type'
const mimes = JSON.parse(fs.readFileSync(new URL('../lib/mimetype.json', import.meta.url)))

const getMimeType = async (path) => {
  const buffer = fs.readFileSync(path)
  const type = await fileTypeFromBuffer(buffer)
  console.log(type)
  return type.mime
}

const validateMimeType = async (mimeType) => {
  console.log(mimeType)
  if (!mimeType) {
    return { valid: false, error: 'No se pudo determinar el tipo de archivo' }
  }

  if (mimes.mimetypes.includes(mimeType)) {
    return { valid: true, mimeType }
  } else {
    return { valid: false, error: 'Tipo de archivo no permitido', mimeType }
  }
}

const validateFileExists = async (filePath) => {
  try {
    await fs.access(filePath)
    return { success: true }
  } catch (err) {
    return {
      success: false,
      httpCode: 404,
      error: 'Not found',
      message: 'El archivo no se encontró en la ruta especificada'
    }
  }
}

export { getMimeType, validateMimeType,validateFileExists }