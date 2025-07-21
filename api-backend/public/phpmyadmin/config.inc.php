<?php
/**
 * phpMyAdmin configuration file
 */

// Servers configuration
$i = 0;

// First server
$i++;

/* Authentication type */
$cfg['Servers'][$i]['auth_type'] = 'config';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = '';
$cfg['Servers'][$i]['host'] = '127.0.0.1';
$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['AllowNoPassword'] = true;

// Directories for saving/loading files from server
$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';

// Default server
$cfg['ServerDefault'] = 1;

// Enable central columns
$cfg['EnableCSVImport'] = true;
$cfg['EnableLintChecking'] = true;

/**
 * phpMyAdmin configuration storage settings.
 */

// End of configuration file