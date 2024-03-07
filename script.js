// Initialize an empty array to hold the elements to be sorted
let array = [];

// Get references to DOM elements
const arrayContainer = document.getElementById('arrayContainer'); // Container to display the array elements
const speedInput = document.getElementById('speed'); // Input for adjusting sorting speed
const userArrayInput = document.getElementById('userArrayInput'); // Input for entering a custom array
const stepsElement = document.getElementById('steps'); // Container to display sorting steps
let selectedAlgorithm = 'bubbleSort'; // Default selected sorting algorithm

// Function to generate an array from user input
function generateArray() {
    const userInput = userArrayInput.value.trim();
    const numbers = userInput.split(',').map(Number).filter(num => !isNaN(num)); // Extract valid numbers from input
    if (numbers.length === 0) {
        alert('Please enter valid numbers.');
        return;
    }
    array = numbers;
    renderArray();
}

// Function to generate a random array
function generateRandomArray() {
    const size = Math.floor(Math.random() * 10) + 5; // Random array size between 5 and 15
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1); // Generate random numbers
    renderArray();
}

// Function to render the array on the DOM
function renderArray() {
    arrayContainer.innerHTML = ''; // Clear previous array
    // Create a tile for each element in the array
    for (let i = 0; i < array.length; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile'); // Apply styling to the tile
        tile.textContent = array[i]; // Set the tile content to the array element
        arrayContainer.appendChild(tile); // Append the tile to the array container
    }
}

// Function to select the sorting algorithm
function selectAlgorithm(algorithm) {
    selectedAlgorithm = algorithm;
    // Display the selected algorithm
    stepsElement.textContent = `You have selected ${algorithm}.`;
}

// Function to start sorting
async function startSorting() {
    const speed = 101 - parseInt(speedInput.value); // Calculate sorting speed
    stepsElement.textContent = ''; // Clear previous steps
    // Choose the sorting algorithm based on user selection
    switch (selectedAlgorithm) {
        case 'bubbleSort':
            await bubbleSort(speed);
            break;
        case 'selectionSort':
            await selectionSort(speed);
            break;
        case 'insertionSort':
            await insertionSort(speed);
            break;
    }
}

// Function to perform the bubble sort algorithm
async function bubbleSort(speed) {
    let n = array.length;
    let swapped;
    let pass = 1; // Track the current pass
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            // Highlight the elements being compared
            arrayContainer.children[i].classList.add('comparing');
            arrayContainer.children[i + 1].classList.add('comparing');
            await sleep(speed); // Delay for visualization
            if (array[i] > array[i + 1]) {
                await swap(i, i + 1, speed); // Swap the elements if necessary
                swapped = true; // Mark that a swap occurred
            }
            // Remove highlight from compared elements
            arrayContainer.children[i].classList.remove('comparing');
            arrayContainer.children[i + 1].classList.remove('comparing');
        }
        n--; // Decrease the size of the unsorted portion of the array

        // Update the step description after each pass
        stepsElement.innerHTML += `<div class="step pass">Pass ${pass++} completed. Array after Pass: [${array}]</div>`;
    } while (swapped); // Continue until no more swaps occur
}

// Function to perform the selection sort algorithm
async function selectionSort(speed) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            arrayContainer.children[j].classList.add('comparing'); // Highlight the elements being compared
            await sleep(speed); // Delay for visualization
            if (array[j] < array[minIndex]) {
                minIndex = j; // Update the index of the minimum element found so far
            }
            arrayContainer.children[j].classList.remove('comparing'); // Remove highlight
        }
        if (minIndex !== i) {
            await swap(i, minIndex, speed); // Swap the minimum element with the current element if necessary
        }

        // Update the step description
        stepsElement.innerHTML += `<div class="step pass">Pass ${i + 1} completed. Array after Pass: [${array}]</div>`;
    }
}

// Function to perform the insertion sort algorithm
async function insertionSort(speed) {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i]; // Select the current element to be inserted
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            arrayContainer.children[j + 1].classList.add('comparing'); // Highlight the elements being shifted
            await sleep(speed); // Delay for visualization
            array[j + 1] = array[j]; // Shift elements to make space for the current element
            arrayContainer.children[j + 1].classList.remove('comparing'); // Remove highlight
            j--;
        }
        array[j + 1] = key; // Insert the current element into its correct position

        // Update the step description
        stepsElement.innerHTML += `<div class="step pass">Pass ${i} completed. Array after Pass: [${array}]</div>`;
        await sleep(speed);
        renderArray(); // Render array after each inner loop iteration for visualization
    }
}

// Function to swap two elements in the array and update the DOM
async function swap(i, j, speed) {
    const tile1 = arrayContainer.children[i];
    const tile2 = arrayContainer.children[j];

    // Get positions of the tiles
    const tile1Pos = tile1.getBoundingClientRect();
    const tile2Pos = tile2.getBoundingClientRect();

    // Calculate the distance to move
    const dx = tile2Pos.left - tile1Pos.left;
    const dy = tile2Pos.top - tile1Pos.top;

    // Highlight the swapped elements
    tile1.classList.add('swapping');
    tile2.classList.add('swapping');

    // Move tiles smoothly
    tile1.style.transition = `transform ${speed / 1500}s cubic-bezier(0.42, 0, 0.58, 1)`;
    tile1.style.transform = `translate(${dx}px, ${dy}px)`;

    tile2.style.transition = `transform ${speed / 1500}s cubic-bezier(0.42, 0, 0.58, 1)`;
    tile2.style.transform = `translate(${-dx}px, ${-dy}px)`;

    // Wait for animation to finish
    await sleep(speed * 1.5);

    // Swap values in the array
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    // Update the DOM
    tile1.style.transition = 'none'; // Remove transition for instant change
    tile1.style.transform = 'none'; // Reset transform
    tile2.style.transition = 'none'; // Remove transition for instant change
    tile2.style.transform = 'none'; // Reset transform

    // Update the numbers on tiles
    tile1.textContent = array[i];
    tile2.textContent = array[j];

    // Remove highlight from swapped elements
    tile1.classList.remove('swapping');
    tile2.classList.remove('swapping');
}

// Function to create a delay using async/await
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}