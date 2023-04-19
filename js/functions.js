var q1Table;
const q1BlockA = "q1_block_a";
const q1BlockB = "q1_block_b";
var q1KeyPairs = null;//getTablePairs();
var q2KeyPairs = null;//getTablePairs();
const q1BlockAAns = "q1_block_a_ans";
var currentQuestion = 0;

function removeAnswerStyle(parent)
{
     let children = parent.children;

    // loop through all the child elements and remove the 'active' class
    for (let i = 0; i < children.length; i++) {
        children[i].classList.remove('red');
        children[i].classList.remove('blue');
        removeAnswerStyle(children[i]);
    }
}

function generateQuestion1()
{
    hideAnswer('q1_answer');

    let parent = document.getElementById("q1");
    removeAnswerStyle(parent);

    let data = insertTable("q1_table_container");
    q1KeyPairs = data.keyPairs;
    q1Table = data.table;

    setBlockValue(q1BlockA, getRandomFourBit());
    setBlockValue(q1BlockB, getRandomFourBit());
        
    var a = calculateDirectEncryption(getBlockValue(q1BlockA), q1KeyPairs);
    var b = calculateDirectEncryption(getBlockValue(q1BlockB), q1KeyPairs);

    setBlockValue(q1BlockAAns, a);
    setBlockValue("q1_block_b_ans", b);

    document.getElementById("q1").style.display = "inherit";
}

function loadQuestion2()
{
    hideAnswer('q2_answer');

    let data = insertTable("q2_table_container");
    q2KeyPairs = data.keyPairs;
    setBlockValue("q2_counter", getRandomFourBit());
    setBlockValue("q2_block_a", getRandomFourBit());

    document.getElementById("q2").style.display = "inherit";
}

function loadQuestion3()
{
    hideAnswer('q3_answer');

    let clockTick = getRandomFourBit();

    setBlockValue("q3_tick", clockTick);
    
    document.getElementById("q3").style.display = "inherit";
}

function loadQuestion4()
{
    hideAnswer('q4_answer');
    document.getElementById("q4").style.display = "inherit";    
}

function loadQuestion5()
{
    hideAnswer('q5_answer');

    let l1 = getRandomFourBit();
    let l2 = getRandomFourBit();
    let l3 = getRandomFourBit();
    let l4 = getRandomFourBit();

    setBlockValue("q5_l1", l1);
    setBlockValue("q5_l2", l2);
    setBlockValue("q5_l3", l3);
    setBlockValue("q5_l4", l4);

    let data = insertTable("q5_table_container", 2);
    q2KeyPairs = data.keyPairs;

    document.getElementById("q5").style.display = "inherit"; 
}


function showQuestion2Answer()
{
    var address = getBlockValue("q2_block_a");

    setBlockValue("q2_seed_address", address);
    setBlockValue("q2_seed_counter", getBlockValue("q2_counter"));

    var seed = calculateSeed(
        getBlockValue("q2_seed_address"),
        getBlockValue("q2_seed_counter"),        
    );
    setBlockValue("q2_seed", seed);

    var pad = calculatePad(seed);
    setBlockValue("q2_pad_seed", seed);
    setBlockValue("q2_pad", pad);

    var cipher = calculateCounterCipher(address, pad);
    setBlockValue("q2_cipher_address", address);
    setBlockValue("q2_cipher_pad", pad)
    setBlockValue("q2_cipher", cipher);
}

function showQuestion3Answer()
{
    let clockTick = getBlockValue("q3_tick");
    console.log("Tick is: " + clockTick);

    clockTick = increaseCounter(clockTick);
    setBlockValue("q3_a_answer", clockTick);
    console.log("Tick after inccrease is " + clockTick);

    clockTick = increaseCounter(clockTick);
    setBlockValue("q3_b_answer", clockTick);

    let recycledTime = (parseInt(1111, 2) - parseInt(clockTick, 2)) + 1;
    setBlockValue("q3_c_answer", recycledTime);
}

function showQuestion4Answer(){}

function showQuestion5Answer()
{
    let l1 = getBlockValue("q5_l1");
    let l2 = getBlockValue("q5_l2");

    setBlockValue("q5_a_l1_value", l1);
    setBlockValue("q5_a_l2_value", l2);
}

function calculateCounterCipher(address, pad)
{
    let addressBin = parseInt(address, 2);
    let padBin = parseInt(pad, 2);

    var cipherBin = addressBin ^ padBin;
    let cipher = cipherBin.toString(2).padEnd(4, '0');
    //console.log(address + " XOR " + pad + " = " + cipher);

    return cipher;
}

function calculatePad(seed)
{

    // Force seed to 4 bit
    seed = seed.substr(seed.length - 4, seed.length - 1);

    var pad = calculateDirectEncryption(seed, q2KeyPairs);

    console.log(q2KeyPairs);
    return pad;
}

function calculateSeed(address, counter)
{
    var seed = address + increaseCounter(counter);
    return seed;
}

function increaseCounter(counter)
{
    if(counter == "1111"){
        counter = "0000";
        let decimal = parseInt(counter, 2);
        return decimal.toString(2).padEnd(4, '0');        
    }
    // Parse binary number as base-2 integer
    let decimal = parseInt(counter, 2);
    // Add 1 to decimal number
    decimal += 1;

    // Convert decimal number back to binary
    if(decimal < 8){
        binary = decimal.toString(2).padStart(4, '0');
    }
    else {
        binary = decimal.toString(2).padEnd(4, '0');
    }


    return binary
}

function insertTable(tableContainerId, encryptionLength = 4)
{
    // Remove current table if it's there,
    let parent = document.getElementById(tableContainerId);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    const keyPairs = getTablePairs(encryptionLength);
    const tableContainer = document.getElementById(tableContainerId);

    // If there isn't a table yet, build it
    if(tableContainer.children.length == 0){

        // Create the table
        var table = document.createElement('table');        
        buildTable(table, keyPairs);
        tableContainer.appendChild(table);        
    }

    return {
        keyPairs: keyPairs, 
        table: table
    }
}

function buildTable(table, inputEncryptionPairs)
{
    console.log("building");
    console.log(inputEncryptionPairs);
    const myTable = table;
    if(myTable.rows.length > 0){
        console.log("Table already built");
        return;
    }

    const inputRow = myTable.insertRow();
    // Create the input value header cell
    const inputValueHeaderCell = inputRow.insertCell();
    
    inputValueHeaderCell.textContent = "Input, i.e. x";
    inputValueHeaderCell.classList.add('shaded');

    let shade = false;
    // Loop through the inputEncryptionPairs object and create a new cell for each input value
    for (const inputValue in inputEncryptionPairs) {       
        const cell = inputRow.insertCell();
        cell.textContent = inputValue;
        if(shade){
            cell.classList.add('shaded');
        }
        shade = !shade;
    }

    // Create the second row for encryption keys
    const encryptionKeyRow = myTable.insertRow();
    
    // Create the encryption key header cell
    const encryptionKeyHeaderCell = encryptionKeyRow.insertCell();
    encryptionKeyHeaderCell.textContent = "Encryption Output, i.e. E_K(x";
    encryptionKeyHeaderCell.classList.add('shaded');
    
    // Loop through the inputEncryptionPairs object and create a new cell for each encryption key
    for (const inputValue in inputEncryptionPairs) {
        const cell = encryptionKeyRow.insertCell();
        cell.textContent = inputEncryptionPairs[inputValue];
        if(shade){
            cell.classList.add('shaded');
        }
        shade = !shade;
    }

    console.log("Done buliding");
    console.log(inputEncryptionPairs);
}

function getTablePairs(encryptionLength = 4)
{
     // Define an array of possible input values
     const inputValues = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"];
     const inputEncryptionPairs = {};
     let encryptionKey;
 
     // Loop through the input values array
     for (let i = 0; i < inputValues.length; i++) {
 
         // Convert the integer to a 4-bit binary string
         if(encryptionLength == 4){
            encryptionKey = getRandomFourBit();
         }
         else if(encryptionLength == 2){
            encryptionKey = getRandomTwoBit();
         }
 
         inputEncryptionPairs[inputValues[i]] = encryptionKey
     }
 
     // Log the input values and encryption keys arrays to the console
     //console.log(inputValues);
     //console.log(inputEncryptionPairs);

     return inputEncryptionPairs;
}

function calculateDirectEncryption(input, inputEncryptionPairs)
{
    console.log(input);
    console.log(inputEncryptionPairs);
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
        case 3:
            showQuestion3Answer();
            break;
        case 4:
            showQuestion4Answer();
            break;
        case 5:
            showQuestion5Answer();
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

    //var table = document.getElementById(q1Table);
    const cells = q1Table.getElementsByTagName("td");
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
    currentQuestion = 1;
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
    currentQuestion = 5;
    if(currentQuestion > 4)
        currentQuestion = 5;
    if(currentQuestion < 1)
        currentQuestion = 1;

    switch(currentQuestion){
        case 1:
            generateQuestion1();
            break;
        case 2:
            loadQuestion2();
            break;
        case 3:
            loadQuestion3();
            break;
        case 4:
            loadQuestion4();
            break;
        case 5:
            loadQuestion5();
            break;
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

function regenerate()
{
    switch(currentQuestion){
        case 1:
            generateQuestion1();
            break;
        case 2:
            loadQuestion2();
            break;
        case 3:
            loadQuestion3();
            break;
        case 4:
            loadQuestion4();
            break;
        case 5:
            loadQuestion5();
            break;
        default:
            ;           
    }
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

function getRandomTwoBit()
{
    // Generate a random integer between 0 and 3 (inclusive)
    const randomInt = Math.floor(Math.random() * 4);
 
    // Convert the integer to a 2-bit binary string
    const binaryString = ("00" + randomInt.toString(2)).slice(-2);

    return binaryString;
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