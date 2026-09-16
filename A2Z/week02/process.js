const fs = require('fs');
const { Segment, useDefault } = require('segmentit');

const segmentit = useDefault(new Segment());

// blocklist of common Chinese stop words and punctuation
const stopWords = new Set([
  '的', '了', '在', '是', '和', '与', '而', '对', '于', '就', 
  '也', '着', '或', '等', '有', '大', '中', '这', '那', '我们', 
  '他们', '他', '们', '一个', '一',  '因为', '所以', '但是', '如果', '为了', '为', '会', '时', '只', '上', '从','到','新','以','将','被','月',
  '，', '、', '—',  '。', '！', '？', '：', '；', '“', '”', '（', '）', '《', '》', ' '
]);

function processText(inputFile, outputName) {
  const text = fs.readFileSync(inputFile, 'utf8');
  const tokens = segmentit.doSegment(text);
  const counts = {};
  let totalWords = 0;

  tokens.forEach(item => {
    const word = item.w.trim();
    if (word.length > 0 && !stopWords.has(word) && !/^\d+$/.test(word)) {
      counts[word] = (counts[word] || 0) + 1;
      totalWords++;
    }
  });

  const list = Object.keys(counts)
    .map(word => ({
      word: word,
      count: counts[word],
      rate: (counts[word] / totalWords * 100).toFixed(2) // ratio as percentage
    }))
    .sort((a, b) => b.count - a.count);

  let csvContent = "\uFEFFWord,Count,Rate(%)\n"; 
  list.forEach(row => {
    csvContent += `"${row.word}",${row.count},${row.rate}\n`;
  });
  fs.writeFileSync(`${outputName}.csv`, csvContent);

  console.log(` ${inputFile} generated ${outputName}.csv`);
}

processText('people.txt', 'people_freq');
processText('whynot.txt', 'whynot_freq');