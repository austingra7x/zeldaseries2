const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let startIndex = content.indexOf('<main');
let endIndex = content.indexOf('</main>');

let mainContent = content.substring(startIndex, endIndex);

// A simple stack-based parser to find the unmatched tag.
// We remove all JSX strings, comments, and `{ ... }` blocks first to avoid false positives.

let cleaned = mainContent;

let stack = [];
let regex = /<([a-zA-Z0-9\.]+)([^>]*?)>|<\/([a-zA-Z0-9\.]+)([^>]*?)>/g;
let match;
let errors = [];

while ((match = regex.exec(mainContent)) !== null) {
  if (match[3]) {
    // Closing tag
    if (stack.length === 0) {
      console.log('Extra closing tag:', match[3], 'at index', match.index);
    } else {
      let last = stack.pop();
      if (last.tag !== match[3]) {
        errors.push(`Mismatch! Opened ${last.tag} at ${last.index} but closed ${match[3]} at index ${match.index}`);
        break; // stop on first mismatch
      }
    }
  } else if (match[1]) {
    // Opening tag
    // check if it's self closing (ends with / or string ends with / before >)
    let inner = match[2].trim();
    if (inner.endsWith('/')) continue;
    if (['input', 'img', 'br', 'hr', 'meta', 'link'].includes(match[1])) continue;
    
    // Check if it actually self closes without a space: e.g. <textarea.../> 
    // The regex might capture the / in match[2]
    
    stack.push({tag: match[1], index: match.index});
  }
}
console.log(errors);
if (errors.length === 0) {
    console.log('Stack at end:', stack.map(x => x.tag));
}
