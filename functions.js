const q1Table = "q1_table";
const q1BlockA = "q1_block_a";
const q1BlockB = "q1_block_b";
const q1Counter = "q1_counter";
const q1KeyPairs = getTablePairs();
const q1BlockAAns = "q1_block_a_ans";

function generateQuestion1()
{

    hideAnswer('q1_answer');
    
    buildTable(q1Table,q1KeyPairs);
    setBlockValue(q1BlockA, getRandomFourBit());
    setBlockValue(q1BlockB, getRandomFourBit());
    setBlockValue(q1Counter, getRandomFourBit());
    
    var a = calculateDirectEncryption(getBlockValue(q1BlockA), q1KeyPairs);
    var b = calculateDirectEncryption(getBlockValue(q1BlockB), q1KeyPairs);

    setBlockValue(q1BlockAAns, a);
    setBlockValue("q1_block_b_ans", b);

}

function setBlockValue(id, value)
{
    const mySpan = document.getElementById(id);

    mySpan.textContent = value;
}

function getBlockValue(id)
{
    const mySpan = document.getElementById(id);

    return mySpan.textContent;
}

function getRandomFourBit()
{
    // Generate a random integer between 0 and 15 (inclusive)
    const randomInt = Math.floor(Math.random() * 16);
 
    // Convert the integer to a 4-bit binary string
    const encryptionKey = ("000" + randomInt.toString(2)).slice(-4);

    return encryptionKey;
}

function buildTable(table, inputEncryptionPairs)
{
    const myTable = document.getElementById(table);

    /*
    for (const inputValue in inputEncryptionPairs) {
        // Create a new row element
        const row = myTable.insertRow();
        // Create two new cell elements
        const inputCell = row.insertCell();
        const encryptionKeyCell = row.insertCell();
        // Set the text content of the cells to the input value and encryption key, respectively
        inputCell.textContent = inputValue;
        encryptionKeyCell.textContent = inputEncryptionPairs[inputValue];
      }
      */
      const inputRow = myTable.insertRow();
     // Create the input value header cell
const inputValueHeaderCell = inputRow.insertCell();
inputValueHeaderCell.textContent = "Input, i.e. x";
// Loop through the inputEncryptionPairs object and create a new cell for each input value
for (const inputValue in inputEncryptionPairs) {
  const cell = inputRow.insertCell();
  cell.textContent = inputValue;
}

// Create the second row for encryption keys
const encryptionKeyRow = myTable.insertRow();
// Create the encryption key header cell
const encryptionKeyHeaderCell = encryptionKeyRow.insertCell();
encryptionKeyHeaderCell.textContent = "Encryption Output, i.e. E_K(x";
// Loop through the inputEncryptionPairs object and create a new cell for each encryption key
for (const inputValue in inputEncryptionPairs) {
  const cell = encryptionKeyRow.insertCell();
  cell.textContent = inputEncryptionPairs[inputValue];
}
}

function getTablePairs()
{
     // Define an array of possible input values
     const inputValues = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"];
     const inputEncryptionPairs = {};
 
     // Loop through the input values array
     for (let i = 0; i < inputValues.length; i++) {
 
         // Convert the integer to a 4-bit binary string
         const encryptionKey = getRandomFourBit();
 
         inputEncryptionPairs[inputValues[i]] = encryptionKey
     }
 
     // Log the input values and encryption keys arrays to the console
     console.log(inputValues);
     console.log(inputEncryptionPairs);

     return inputEncryptionPairs;
}

function calculateDirectEncryption(input, inputEncryptionPairs)
{
    console.log(input);
    console.log(inputEncryptionPairs);
    return inputEncryptionPairs[input];
}

function showAnswer(id)
{
    document.getElementById(id).style.display = "inherit";

    var a = calculateDirectEncryption(getBlockValue(q1BlockA), q1KeyPairs);
    var b = calculateDirectEncryption(getBlockValue(q1BlockB), q1KeyPairs);

    // Find the encrypted value column and highlight it
    var aIndex = findAnswerIndex(a, q1KeyPairs, q1BlockA, 'red');
    var bIndex = findAnswerIndex(b, q1KeyPairs, q1BlockB, 'blue');

}

function findAnswerIndex(value, q1KeyPairs, block, color)
{
    var index = 1;

    for (const inputValue in q1KeyPairs) {

        // If it's the answer save the index
        if(value == q1KeyPairs[inputValue] && getBlockValue(block) == inputValue){
            break;
        }

        index++;
    }

    var table = document.getElementById(q1Table);
    const cells = table.getElementsByTagName("td");
    cells[index].classList.add('answer'); // Input
    cells[index].classList.add(color); // Input
    cells[index+17].classList.add('answer'); // Output
    cells[index+17].classList.add(color); // Output
    document.getElementById(block).classList.add(color);
}

function hideAnswer(id)
{
    document.getElementById(id).style.display = "none";
}
