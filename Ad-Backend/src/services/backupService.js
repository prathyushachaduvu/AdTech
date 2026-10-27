const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const sequelize = require('../config/database');

class BackupService {
  constructor() {
    this.backupDir = process.env.BACKUP_DIR || './backups';
    this.retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;
  }

  // Create database backup
  async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup_${timestamp}.sql`;
      const backupPath = path.join(this.backupDir, backupFileName);

      // Ensure backup directory exists
      await fs.mkdir(this.backupDir, { recursive: true });

      // Database connection details
      const dbConfig = sequelize.config;
      const { database, username, password, host, port } = dbConfig;

      // Create pg_dump command
      const pgDumpCmd = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -f ${backupPath}`;

      console.log('Creating database backup...');
      await execAsync(pgDumpCmd);

      // Create metadata file
      const metadata = {
        timestamp: new Date().toISOString(),
        database,
        version: '1.0',
        size: (await fs.stat(backupPath)).size,
        checksum: await this.calculateChecksum(backupPath)
      };

      const metadataPath = backupPath.replace('.sql', '.json');
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

      console.log(`Backup created successfully: ${backupFileName}`);
      return {
        success: true,
        backupFile: backupFileName,
        metadata
      };

    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }

  // Restore database from backup
  async restoreBackup(backupFileName) {
    try {
      const backupPath = path.join(this.backupDir, backupFileName);
      
      // Check if backup file exists
      await fs.access(backupPath);

      // Database connection details
      const dbConfig = sequelize.config;
      const { database, username, password, host, port } = dbConfig;

      // Create psql restore command
      const psqlCmd = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${username} -d ${database} -f ${backupPath}`;

      console.log('Restoring database from backup...');
      await execAsync(psqlCmd);

      console.log(`Database restored successfully from: ${backupFileName}`);
      return {
        success: true,
        message: 'Database restored successfully'
      };

    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw error;
    }
  }

  // List available backups
  async listBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = [];

      for (const file of files) {
        if (file.endsWith('.sql')) {
          const backupPath = path.join(this.backupDir, file);
          const metadataPath = backupPath.replace('.sql', '.json');
          
          const stats = await fs.stat(backupPath);
          let metadata = null;

          try {
            const metadataContent = await fs.readFile(metadataPath, 'utf8');
            metadata = JSON.parse(metadataContent);
          } catch (error) {
            // Metadata file doesn't exist, create basic info
            metadata = {
              timestamp: stats.mtime.toISOString(),
              size: stats.size
            };
          }

          backups.push({
            fileName: file,
            size: stats.size,
            createdAt: stats.mtime,
            metadata
          });
        }
      }

      // Sort by creation date (newest first)
      backups.sort((a, b) => b.createdAt - a.createdAt);

      return backups;

    } catch (error) {
      console.error('Failed to list backups:', error);
      throw error;
    }
  }

  // Clean up old backups
  async cleanupOldBackups() {
    try {
      const backups = await this.listBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      const backupsToDelete = backups.filter(backup => 
        backup.createdAt < cutoffDate
      );

      let deletedCount = 0;
      for (const backup of backupsToDelete) {
        try {
          const backupPath = path.join(this.backupDir, backup.fileName);
          const metadataPath = backupPath.replace('.sql', '.json');

          await fs.unlink(backupPath);
          
          try {
            await fs.unlink(metadataPath);
          } catch (error) {
            // Metadata file doesn't exist, ignore
          }

          deletedCount++;
          console.log(`Deleted old backup: ${backup.fileName}`);
        } catch (error) {
          console.error(`Failed to delete backup ${backup.fileName}:`, error);
        }
      }

      return {
        success: true,
        deletedCount,
        message: `Cleaned up ${deletedCount} old backups`
      };

    } catch (error) {
      console.error('Backup cleanup failed:', error);
      throw error;
    }
  }

  // Calculate file checksum
  async calculateChecksum(filePath) {
    const crypto = require('crypto');
    const content = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Verify backup integrity
  async verifyBackup(backupFileName) {
    try {
      const backupPath = path.join(this.backupDir, backupFileName);
      const metadataPath = backupPath.replace('.sql', '.json');

      // Check if files exist
      await fs.access(backupPath);
      await fs.access(metadataPath);

      // Read metadata
      const metadataContent = await fs.readFile(metadataPath, 'utf8');
      const metadata = JSON.parse(metadataContent);

      // Verify file size
      const stats = await fs.stat(backupPath);
      if (stats.size !== metadata.size) {
        throw new Error('Backup file size mismatch');
      }

      // Verify checksum
      const currentChecksum = await this.calculateChecksum(backupPath);
      if (currentChecksum !== metadata.checksum) {
        throw new Error('Backup file checksum mismatch');
      }

      return {
        success: true,
        message: 'Backup verification passed',
        metadata
      };

    } catch (error) {
      console.error('Backup verification failed:', error);
      throw error;
    }
  }

  // Schedule automatic backups
  async scheduleBackup() {
    try {
      // Create backup
      const backup = await this.createBackup();

      // Clean up old backups
      await this.cleanupOldBackups();

      return backup;

    } catch (error) {
      console.error('Scheduled backup failed:', error);
      throw error;
    }
  }
}

module.exports = new BackupService(); 