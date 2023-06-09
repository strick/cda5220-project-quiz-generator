var q1Table;
const q1BlockA = "q1_block_a";
const q1BlockB = "q1_block_b";
var q1KeyPairs = null;//getTablePairs();
var q2KeyPairs = null;//getTablePairs();
var q5KeyPairs = null;
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
    q5KeyPairs = data.keyPairs;

    document.getElementById("q5").style.display = "inherit"; 
}

function loadQuestion6()
{
    hideAnswer('q6_answer');
    
    let data = generateHashAndByteBlock();
    setBlockValue("q6_byte_value", data['byte']);
    setBlockValue("q6_hash_value", data['hash']);

    document.getElementById("q6").style.display = "inherit";    
}

function loadQuestion7()
{
    hideAnswer('q7_answer');
    document.getElementById("q7").style.display = "inherit";    
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
function showQuestion7Answer(){}

function showQuestion5Answer()
{
    const values = {
        l1: getBlockValue("q5_l1"),
        l2: getBlockValue("q5_l2"),
        l3: getBlockValue("q5_l3"),
        l4: getBlockValue("q5_l4")
    };

    // Set the E(l1) and E(l2)
    const hashes = {
        l1_hash: calculateDirectEncryption(values['l1'], q5KeyPairs),
        l2_hash: calculateDirectEncryption(values['l2'], q5KeyPairs),
        l3_hash: calculateDirectEncryption(values['l3'], q5KeyPairs),
        l4_hash: calculateDirectEncryption(values['l4'], q5KeyPairs)
    };

    // Set the concat
    setBlockValue("q5_a_l1_l2_concat", (hashes['l1_hash'] + hashes['l2_hash']));
    setBlockValue("q5_a_l3_l4_concat", (hashes['l3_hash'] + hashes['l4_hash']));
    setBlockValue("q5_c_l1_l2_concat", (hashes['l1_hash'] + hashes['l2_hash']));
    setBlockValue("q5_c_l3_l4_concat", (hashes['l3_hash'] + hashes['l4_hash']));

    let l1_l2_hash = calculateDirectEncryption((hashes['l1_hash'] + hashes['l2_hash']), q5KeyPairs);
    let l3_l4_hash = calculateDirectEncryption((hashes['l3_hash'] + hashes['l4_hash']), q5KeyPairs);
    setBlockValue("q5_c_l1_l2_hash", l1_l2_hash);
    setBlockValue("q5_c_l3_l4_hash", l3_l4_hash);
    setBlockValue("q5_c_root_value", l1_l2_hash + l3_l4_hash);

    // Part C
    for(i=1; i<5; i++){
        // Update DOM with the hash vlaues
        setBlockValue(`q5_c_l${i}_hash`, hashes[`l${i}_hash`]);
        setBlockValue(`q5_a_l${i}_hash`, hashes[`l${i}_hash`]);
        setBlockValue(`q5_a_l${i}_value`, values[`l${i}`]);
    }
}

function showQuestion6Answer()
{
    let hash = getBlockValue("q6_hash_value");
    let byte = getBlockValue("q6_byte_value");

    // Do arity calculation
    let arity = calculateMaxArity(byte, hash);

    setBlockValue("q6_a_answer_byte_value", byte);
    setBlockValue("q6_a_answer_byte_to_bit_value", byte * 8);
    setBlockValue("q6_a_answer_byte_to_bit_value2", byte * 8);
    setBlockValue("q6_a_answer_hash_value", hash);
    setBlockValue("q6_a_answer", arity);

    setBlockValue("q6_b_arity_1", arity);
    setBlockValue("q6_b_arity_2", arity);
    setBlockValue("q6_b_maxRatio", calculateMaximumRatio(arity));
    
}

function calculateMaxArity(byte, hash)
{
    // Convert bytes to bits
    let byteBits = byte * 8;

    // Calculate
    let arity = byteBits / hash;

    return arity;
}

function calculateMaximumRatio(arity)
{
    let maxRatio = (1/arity) / (1-(1/arity));

    return maxRatio;
}

function generateHashAndByteBlock()
{
    const minExponent = 3; // 2^3 = 8
    const maxExponent = 12; // 2^8 = 256
  
    // Generate random exponents between min and max
    const exponent1 = Math.floor(Math.random() * (maxExponent - minExponent + 1) + minExponent);
    const exponent2 = Math.floor(Math.random() * (maxExponent - minExponent + 1) + minExponent);
  
    // Calculate the powers of 2 based on the exponents
    const num1 = 2 ** exponent1;
    const num2 = 2 ** exponent2;

    let hash = 0;
    let byte = 0;
  
    // Ensure the first number is always larger than the second
    if ((num1 * 8) < num2) {
      byte = num2;
      hash = num1;
    } else {
      byte = num1;
      hash = num2
    }

    return {
        hash: hash,
        byte: byte
    }
}

function calculateCounterCipher(address, pad)
{
    let addressBin = parseInt(address, 2);
    let padBin = parseInt(pad, 2);

    var cipherBin = addressBin ^ padBin;

    let cipher;

    if(cipherBin < 8){
        cipher = cipherBin.toString(2).padStart(4, '0');
    }
    else {
        cipher = cipherBin.toString(2).padEnd(4, '0');
    }


    // let cipher = cipherBin.toString(2).padEnd(4, '0');
    //console.log(address + " XOR " + pad + " = " + cipher);

    return cipher;
}

function calculatePad(seed)
{

    // Force seed to 4 bit
    seed = seed.substr(seed.length - 4, seed.length - 1);

    var pad = calculateDirectEncryption(seed, q2KeyPairs);

    //console.log(q2KeyPairs);
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
    //console.log("building");
    //console.log(inputEncryptionPairs);
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

    //console.log("Done buliding");
    //console.log(inputEncryptionPairs);
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
        case 3:
            showQuestion3Answer();
            break;
        case 4:
            showQuestion4Answer();
            break;
        case 5:
            showQuestion5Answer();
            break;
        case 6:
            showQuestion6Answer();
            break;
        case 7:
            showQuestion7Answer();
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
    //currentQuestion = 6;
    if(currentQuestion > 6)
        currentQuestion = 7;
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
        case 6:
            loadQuestion6();
            break;
        case 7:
            loadQuestion7();
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
        case 6:
            loadQuestion6();
            break;
        case 7:
            loadQuestion7();
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