/**
 * GoanFlow Knowledge Base Utility
 * 
 * Provides unified access to all 7 domains in product.md
 */

import * as fs from 'fs';
import * as path from 'path';

const KB_DIR = path.join(__dirname, '../../knowledge');

export interface KBSection {
    domain: string; // Now using string identifiers like 'beaches', 'transport'
    title: string;
    content: string;
}

/**
 * Reads all files in the knowledge directory
 */
export function loadKB(): KBSection[] {
    if (!fs.existsSync(KB_DIR)) return [];

    const files = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.md'));

    return files.map(file => {
        const filePath = path.join(KB_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const domain = file.replace('.md', '');

        return {
            domain: domain,
            title: domain.charAt(0).toUpperCase() + domain.slice(1).replace('_', ' '),
            content: content.trim()
        };
    });
}

/**
 * Gets a specific domain content by name
 */
export function getDomain(domainName: string): string {
    const kb = loadKB();
    return kb.find(s => s.domain === domainName)?.content || "";
}

/**
 * Simple parser to extract key-value pairs from markdown lists/bullet points
 */
export function extractData(content: string, key: string): string[] {
    const regex = new RegExp(`${key}:\\s*(.*)`, 'gi');
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push(match[1].trim());
    }
    return matches;
}
