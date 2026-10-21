const fs = require('fs');

const targetWords = ['汽车', '新能源', '发展', '工作', '车企'];
const contextLength = 5; 

function findKWIC(inputFile, label) {
  const text = fs.readFileSync(inputFile, 'utf8');
  const matches = [];

  targetWords.forEach(word => {
    let index = text.indexOf(word);
    while (index !== -1) {
      const start = Math.max(0, index - contextLength);
      const end = Math.min(text.length, index + word.length + contextLength);

      let before = text.slice(start, index).replace(/\s+/g, ' ');
      let after = text.slice(index + word.length, end).replace(/\s+/g, ' ');
      let snippet = `...${before}【${word}】${after}...`;

      matches.push({
        word: word,
        source: label,
        snippet: snippet,
        before: before,
        after: after
      });

      index = text.indexOf(word, index + 1);
    }
  });

  return matches;
}

const resultsA = findKWIC('people.txt', 'PEOPLE');
const resultsB = findKWIC('whynot.txt', 'WHYNOT');
const allResults = [...resultsA, ...resultsB];

let csvContent = "\uFEFFWord,Source,Context_Snippet,Before,After\n";

allResults.forEach(item => {
  const cleanWord = item.word.replace(/"/g, '""');
  const cleanSource = item.source.replace(/"/g, '""');
  const cleanSnippet = item.snippet.replace(/"/g, '""');
  const cleanBefore = item.before.replace(/"/g, '""');
  const cleanAfter = item.after.replace(/"/g, '""');

  csvContent += `"${cleanWord}","${cleanSource}","${cleanSnippet}","${cleanBefore}","${cleanAfter}"\n`;
});

fs.writeFileSync('kwic_comparison.csv', csvContent);
console.log(`kwic_comparison.csv generated ${allResults.length}`);