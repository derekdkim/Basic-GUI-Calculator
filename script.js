// Display button inputs
const numBtns = document.getElementsByClassName('num');
const output = document.getElementById('output');
let currentStr = '';

for (let i = 0; i < numBtns.length; i++) {
  numBtns[i].onclick = () => {
    console.log(`${numBtns[i].value} Button pressed!`);
    currentStr += numBtns[i].value;
    output.textContent += numBtns[i].value;
  };
}

// Decimal input
const decBtn = document.getElementById('decimal');
decBtn.onclick = () => {
  // Is there a decimal already present?
  if (output.textContent.includes('.')) {
    // Return null and end the event
    return 0;
  } else {
    // Is there a zero preceding it?
    output.textContent.length === 0 ? output.textContent = '0.' : output.textContent += decBtn.value;
    currentStr += decBtn.value;
  }
};

// Registering numbers and operators
let queue = [];
const opBtns = document.getElementsByClassName('op-btn');
for (let i = 0; i < opBtns.length; i++) {
  opBtns[i].onclick = () => {
    // Prevent multiple presses from registering && don't allow operator as first input
    if (currentStr.length > 0 && queue[queue.length - 1] !== opBtns[i].id) {
      console.log('The preceding element is not the same as this button.');
      console.log(`Last element: ${queue[queue.length - 1]}`);
      console.log(parseInt(queue[queue.length - 1]));
      if (queue.length > 0 && currentStr.length === 0 && isNaN(parseInt(queue[queue.length - 1]))) {
        // Replace another operator with this button's operator instead of stacking.
        console.log(`The preceding element is NaN. ${queue[queue.length - 1]}`);
        queue.pop();
        queue.push(opBtns[i].id);
      } else {
        console.log(`${opBtns[i].id} Button pressed! Current string: ${currentStr}`);
        if (currentStr.length > 0) {
          // If there is something inputted, push it in
          queue.push(currentStr);
        }
        currentStr = '';
        output.textContent = '';
        queue.push(opBtns[i].id);
      }
    }
  };
}

// Clear input field
const clearBtn = document.getElementById('clear');
clearBtn.onclick = () => {
  console.log(`${clearBtn.id} Button pressed!`);
  currentStr = '';
  output.textContent = '';
  queue = [];
};

// Undo input
const undoBtn = document.getElementById('undo');
undoBtn.onclick = () => {
  console.log(`${undoBtn.id} Button pressed!`);
  output.textContent = output.textContent.substring(0, output.textContent.length - 1);
  currentStr = currentStr.substring(0, currentStr.length - 1);
  console.log(currentStr);
};

// Equals button, calls compute()
const computeBtn = document.getElementById('equals');
computeBtn.onclick = () => {
  if (currentStr > 0 || currentStr === '0') {
    queue.push(currentStr);
  } else if (isNaN(parseInt(queue[queue.length - 1]))) {
    console.log(`${queue[queue.length - 1]} removed. Curent String: ${currentStr}`);
    queue.pop();
  }

  console.log(queue);

  if (divZero(queue)) {
    output.textContent = "You can't divide by 0!";
  } else {
    output.textContent = compute(queue);
  }
};

// Main compute function, calls reduceStack()
const compute = (stack) => {
  if (stack.length === 1) {
    if (stack[0] % 1 !== 0) {
      return stack[0].toFixed(5);
    } else {
      return stack[0];
    }
  } else {
    let calcQueue = [...stack];
    console.log(calcQueue);
    if (calcQueue.includes('multiply') || calcQueue.includes('divide')) {
      // Multiplication / Division takes priority
      calcQueue = reduceStack(calcQueue, 'multiply', 'divide');
      console.log(`New calcQueue: ${calcQueue}`);
    } else {
      // Addition / Subtraction
      calcQueue = reduceStack(calcQueue, 'add', 'subtract');
      console.log(`New calcQueue: ${calcQueue}`);
    }

    console.log(`New calcQueue: ${calcQueue}`);
    return compute(calcQueue);
  }
};

// Iterates through the stack, calls calculate()
const reduceStack = (stack, operator0, operator1) => {
  const calcQueue = [...stack];
  for (let i = 0; i < calcQueue.length; i += 2) {
    if (calcQueue[i + 1] === operator0 || calcQueue[i + 1] === operator1) {

      const result = calculate(parseFloat(calcQueue[i]), calcQueue[i + 1], parseFloat(calcQueue[i + 2]));
      console.log(`Calculation complete: Index = ${i} Num1 = ${calcQueue[i]}, Operator = ${calcQueue[i + 1]}, Num2 = ${calcQueue[i + 2]} Result is ${result}`);
      console.log(`Old Queue: ${calcQueue}`);
      calcQueue.splice(i, 3, result);
      console.log(`New Queue: ${calcQueue}`);
      return calcQueue;
    }
  }
  return 0;
};

// Performs arithmetic
const calculate = (num1, operator, num2) => {
  const operatorId = operator;
  switch (operatorId) {
    case 'add':
      return num1 + num2;
    case 'subtract':
      return num1 - num2;
    case 'multiply':
      return num1 * num2;
    case 'divide':
      return num1 / num2;
  }
};

// Checks if the queue includes dividing by zero
const divZero = (calcQueue) => {
  for (let i = 0; i < calcQueue.length; i++) {
    if (calcQueue[i] === 'divide' && calcQueue[i + 1] === '0') {
      console.log("Dividing by zero found!");
      return true;
    }
  }
  return false;
}