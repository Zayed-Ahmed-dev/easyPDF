const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

// Clear file helper
const clearFile = (filePath) => {
  fs.unlink(filePath).catch(() => {});
};

// Encrypt any file
exports.encryptFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'File not found' });

    const { password } = req.body;
    if (!password) return res.status(400).json({ msg: 'Password required' });

    const inputPath = req.file.path;
    const outputFileName = `${Date.now()}-encrypted`;
    const outputPath = path.join(__dirname, '../output', outputFileName);

    // AES-256 key + random IV
    const key = crypto.createHash('sha256').update(password).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    // Prepend IV to encrypted file
    output.write(iv);
    input.pipe(cipher).pipe(output);

    output.on('finish', () => {
      // Clear original upload
      clearFile(inputPath);

      res.download(outputPath, `${req.file.originalname}.encrypted`, () => {
        clearFile(outputPath); // clear encrypted file after sending
      });
    });

  } catch (err) {
    console.error('Error encrypting file:', err);
    res.status(500).json({ msg: 'Failed to encrypt file' });
  }
};

// Decrypt any file
exports.decryptFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'File not found' });
    const { password } = req.body;
    if (!password) return res.status(400).json({ msg: 'Password required' });

    const inputPath = req.file.path;
    const outputFileName = `${Date.now()}-decrypted`;
    const outputPath = path.join(__dirname, '../output', outputFileName);

    const fileBuffer = await fs.readFile(inputPath);

    // Extract IV + encrypted content
    const iv = fileBuffer.slice(0, 16);
    const encryptedData = fileBuffer.slice(16);

    const key = crypto.createHash('sha256').update(password).digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted;
    try {
      decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    } catch (err) {
      // Wrong password → return original encrypted file
      res.download(inputPath, `${req.file.originalname}`, () => {
        clearFile(inputPath);
      });
      return;
    }

    await fs.writeFile(outputPath, decrypted);

    // Clear original encrypted file
    clearFile(inputPath);

    res.download(outputPath, `${req.file.originalname}`, () => {
      clearFile(outputPath);
    });

  } catch (err) {
    console.error('Error decrypting file:', err);
    res.status(500).json({ msg: 'Failed to decrypt file' });
  }
};
