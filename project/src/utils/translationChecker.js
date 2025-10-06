/**
 * Translation Checker Utility
 * Scans components for hardcoded English text and suggests translation keys
 */

import fs from 'fs';
import path from 'path';

// Common English words that should be translated
const ENGLISH_PATTERNS = [
  /\b(Home|Login|Logout|Dashboard|Profile|Settings|Help|About|Contact)\b/g,
  /\b(Submit|Cancel|Save|Delete|Edit|View|Back|Next|Previous)\b/g,
  /\b(Loading|Error|Success|Warning|Info|Notice|Alert)\b/g,
  /\b(Search|Filter|Sort|Export|Import|Download|Upload)\b/g,
  /\b(Name|Email|Phone|Address|Date|Time|Status|Type)\b/g,
  /\b(Welcome|Hello|Thank you|Please|Sorry|Confirm)\b/g,
  /\b(Yes|No|OK|Cancel|Close|Open|Start|Stop|Pause)\b/g,
  /\b(New|Old|Latest|Recent|Popular|Featured|Recommended)\b/g,
  /\b(All|None|Some|Many|Few|More|Less|Most|Least)\b/g,
  /\b(Today|Yesterday|Tomorrow|Week|Month|Year|Hour|Minute)\b/g
];

// JSX patterns that likely contain hardcoded text
const JSX_TEXT_PATTERNS = [
  />([^<{]*[a-zA-Z][^<{]*)</g, // Text between JSX tags
  /title="([^"]*[a-zA-Z][^"]*)"/g, // title attributes
  /placeholder="([^"]*[a-zA-Z][^"]*)"/g, // placeholder attributes
  /alt="([^"]*[a-zA-Z][^"]*)"/g, // alt attributes
  /aria-label="([^"]*[a-zA-Z][^"]*)"/g // aria-label attributes
];

const scanFileForHardcodedText = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Skip if file already uses translation hooks
    if (content.includes('useTranslation') || content.includes('import { t }')) {
      return issues;
    }
    
    let lineNumber = 1;
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      lineNumber = index + 1;
      
      // Check for JSX text patterns
      JSX_TEXT_PATTERNS.forEach(pattern => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const text = match[1] || match[0];
          
          // Skip if it's a variable, function call, or already translated
          if (text.includes('{') || text.includes('t(') || text.includes('${') || 
              text.trim().length < 2 || /^\d+$/.test(text.trim())) {
            continue;
          }
          
          // Check if it contains English words
          const hasEnglishWords = ENGLISH_PATTERNS.some(englishPattern => 
            englishPattern.test(text)
          );
          
          if (hasEnglishWords || /^[A-Z][a-z\s]+/.test(text.trim())) {
            issues.push({
              file: filePath,
              line: lineNumber,
              text: text.trim(),
              suggestion: generateTranslationKey(text.trim()),
              context: line.trim()
            });
          }
        }
      });
    });
    
    return issues;
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error.message);
    return [];
  }
};

const generateTranslationKey = (text) => {
  // Convert text to a translation key format
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
};

const scanDirectory = (dirPath, extensions = ['.jsx', '.tsx', '.js', '.ts']) => {
  const allIssues = [];
  
  const scanRecursively = (currentPath) => {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', 'build', 'dist', '.git'].includes(item)) {
          scanRecursively(itemPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        const issues = scanFileForHardcodedText(itemPath);
        allIssues.push(...issues);
      }
    });
  };
  
  scanRecursively(dirPath);
  return allIssues;
};

const generateReport = (issues) => {
  if (issues.length === 0) {
    console.log('✅ No hardcoded English text found!');
    return;
  }
  
  console.log(`🔍 Found ${issues.length} potential hardcoded text issues:\n`);
  
  // Group by file
  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = [];
    }
    acc[issue.file].push(issue);
    return acc;
  }, {});
  
  Object.entries(groupedIssues).forEach(([file, fileIssues]) => {
    console.log(`📄 ${file}:`);
    fileIssues.forEach(issue => {
      console.log(`  Line ${issue.line}: "${issue.text}"`);
      console.log(`    Suggested key: ${issue.suggestion}`);
      console.log(`    Context: ${issue.context}`);
      console.log('');
    });
  });
  
  // Generate suggested translation additions
  console.log('\n📝 Suggested translation keys to add:');
  const uniqueKeys = [...new Set(issues.map(issue => issue.suggestion))];
  uniqueKeys.forEach(key => {
    const example = issues.find(issue => issue.suggestion === key);
    console.log(`"${key}": "${example.text}",`);
  });
};

// Main execution
const checkTranslations = (targetDir = './src') => {
  console.log('🌐 Scanning for hardcoded English text...\n');
  
  const issues = scanDirectory(targetDir);
  generateReport(issues);
  
  return issues.length === 0;
};

export { checkTranslations, scanFileForHardcodedText, generateTranslationKey };

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetDir = process.argv[2] || './src';
  checkTranslations(targetDir);
}