const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const backupService = require('../services/backupService');

const router = express.Router();

// ========================================
// BACKUP MANAGEMENT ENDPOINTS
// ========================================

// POST /api/backup/create - Create database backup
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const backup = await backupService.createBackup();

    res.json({
      success: true,
      message: 'Backup created successfully',
      data: backup
    });

  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({
      success: false,
      error: 'BACKUP_CREATION_FAILED',
      message: error.message
    });
  }
});

// POST /api/backup/restore - Restore database from backup
router.post('/restore', authenticateToken, async (req, res) => {
  try {
    const { backupFileName } = req.body;

    if (!backupFileName) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_BACKUP_FILE',
        message: 'backupFileName is required'
      });
    }

    const result = await backupService.restoreBackup(backupFileName);

    res.json({
      success: true,
      message: 'Database restored successfully',
      data: result
    });

  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({
      success: false,
      error: 'BACKUP_RESTORE_FAILED',
      message: error.message
    });
  }
});

// GET /api/backup/list - List available backups
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const backups = await backupService.listBackups();

    res.json({
      success: true,
      data: {
        backups,
        total: backups.length
      }
    });

  } catch (error) {
    console.error('List backups error:', error);
    res.status(500).json({
      success: false,
      error: 'BACKUP_LIST_FAILED',
      message: error.message
    });
  }
});

// POST /api/backup/verify - Verify backup integrity
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { backupFileName } = req.body;

    if (!backupFileName) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_BACKUP_FILE',
        message: 'backupFileName is required'
      });
    }

    const result = await backupService.verifyBackup(backupFileName);

    res.json({
      success: true,
      message: 'Backup verification completed',
      data: result
    });

  } catch (error) {
    console.error('Verify backup error:', error);
    res.status(500).json({
      success: false,
      error: 'BACKUP_VERIFICATION_FAILED',
      message: error.message
    });
  }
});

// POST /api/backup/cleanup - Clean up old backups
router.post('/cleanup', authenticateToken, async (req, res) => {
  try {
    const result = await backupService.cleanupOldBackups();

    res.json({
      success: true,
      message: 'Backup cleanup completed',
      data: result
    });

  } catch (error) {
    console.error('Cleanup backups error:', error);
    res.status(500).json({
      success: false,
      error: 'BACKUP_CLEANUP_FAILED',
      message: error.message
    });
  }
});

// POST /api/backup/schedule - Schedule automatic backup
router.post('/schedule', authenticateToken, async (req, res) => {
  try {
    const backup = await backupService.scheduleBackup();

    res.json({
      success: true,
      message: 'Scheduled backup completed',
      data: backup
    });

  } catch (error) {
    console.error('Schedule backup error:', error);
    res.status(500).json({
      success: false,
      error: 'BACKUP_SCHEDULE_FAILED',
      message: error.message
    });
  }
});

module.exports = router; 