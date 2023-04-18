const q1Table = "q1_table";
const q1BlockA = "q1_block_a";
const q1BlockB = "q1_block_b";
const q1Counter = "q1_counter";
const q1KeyPairs = getTablePairs();
const q1BlockAAns = "q1_block_a_ans";
var currentQuestion = 0;

function generateQuestion1()
{

    hideAnswer('q1_answer');

    var table = document.getElementById(q1Table);
    
    buildTable(table,q1KeyPairs);
    setBlockValue(q1BlockA, getRandomFourBit());
    setBlockValue(q1BlockB, getRandomFourBit());
    setBlockValue(q1Counter, getRandomFourBit());
    
    var a = calculateDirectEncryption(getBlockValue(q1BlockA), q1KeyPairs);
    var b = calculateDirectEncryption(getBlockValue(q1BlockB), q1KeyPairs);

    setBlockValue(q1BlockAAns, a);
    setBlockValue("q1_block_b_ans", b);

    document.getElementById("q1").style.display = "inherit";

}

function loadQuestion2()
{
    hideAnswer('q2_answer');

    insertTable("q2_table_container");
    setBlockValue("q2_counter", getRandomFourBit());
    setBlockValue("q2_block_a", getRandomFourBit());

    document.getElementById("q2").style.display = "inherit";
}

function showQuestion2Answer()
{
    setBlockValue("q2_seed_address", getBlockValue("q2_block_a"));
    setBlockValue("q2_seed_counter", getBlockValue("q2_counter"));

    var seed = calculateSeed(
        getBlockValue("q2_seed_address"),
        getBlockValue("q2_seed_counter"),        
    );

    setBlockValue("q2_seed", seed);
}

function calculateSeed(address, counter)
{
    var seed = address + increaseCounter(counter);
    return seed;
}

function increaseCounter(counter)
{
    // Parse binary number as base-2 integer
    let decimal = parseInt(counter, 2);

    // Add 1 to decimal number
    decimal += 1;

    // Convert decimal number back to binary
    binary = decimal.toString(2);

    return binary
}

function insertTable(tableContainerId)
{
    const keyPairs = getTablePairs();
    const tableContainer = document.getElementById(tableContainerId);

    // If there isn't a table yet, build it
    if(tableContainer.children.length == 0){

        // Create the table
        var table = document.createElement('table');        
        buildTable(table, keyPairs);
        tableContainer.appendChild(table);
        
    }
}

function buildTable(table, inputEncryptionPairs)
{
    console.log("building");
    const myTable = table;
    if(myTable.rows.length > 0){
        console.log("Table already built");
        return;
    }

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
     //console.log(inputValues);
     //console.log(inputEncryptionPairs);

     return inputEncryptionPairs;
}

function calculateDirectEncryption(input, inputEncryptionPairs)
{
    //console.log(input);
    //console.log(inputEncryptionPairs);
    return inputEncryptionPairs[input];
}

function showAnswer()
{
    document.getElementById("q" + currentQuestion + "_answer").style.display = "inherit";

    switch(currentQuestion){
        case 1:
            showAnswer1();
            break;
        case 2:
            showQuestion2Answer();
            break;
    }
}

function showAnswer1()
{
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

function init()
{ 
    clearQuestions();
    currentQuestion = 2;
    loadQuestion();

}

function nextQuestion()
{
    currentQuestion++;
    loadQuestion();

}

function prevQuestion()
{
    currentQuestion--;
    loadQuestion()
}

function loadQuestion()
{
    clearQuestions();

    if(currentQuestion > 2)
        currentQuestion = 2;
    if(currentQuestion < 1)
        currentQuestion = 1;

    switch(currentQuestion){
        case 1:
            generateQuestion1();
            break;
        case 2:
            loadQuestion2();
        default:
            ;           
    }
}

function clearQuestions()
{
    var elements = document.getElementsByClassName("question_group");
    for(var i = 0; i < elements.length; i++){
        elements[i].style.display = "none";
    }
}

function clearFormating()
{

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