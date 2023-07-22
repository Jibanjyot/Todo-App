function convertToDateObject(dateString) {
  // Method 1: Using Date.parse()
  const parsedDate = Date.parse(dateString);
  if (!isNaN(parsedDate)) {
    // Date.parse() successfully parsed the date string
    return new Date(parsedDate);
  }

  // Method 2: Using new Date()
  const dateObject = new Date(dateString);
  if (!isNaN(dateObject.getTime())) {
    // new Date() successfully created a Date object
    return dateObject;
  }

  // If both methods fail to parse the date string, return null or an appropriate default value
  return null;
}

// Examples:
const dateStr1 = "2023-01-13T15:30:00";
const dateStr2 = "January 13, 2023 3:30 PM";
const dateStr3 = "13th Jan 2023";
const dateStr4 = "2023-01-13";
const dateStr5 = "Invalid Date String";

console.log(convertToDateObject(dateStr1)); // Output: 2023-01-13T15:30:00.000Z
console.log(convertToDateObject(dateStr2)); // Output: 2023-01-13T15:30:00.000Z
console.log(convertToDateObject(dateStr3)); // Output: 2023-01-13T00:00:00.000Z
console.log(convertToDateObject(dateStr4)); // Output: 2023-01-13T00:00:00.000Z
console.log(convertToDateObject(dateStr5)); // Output: null (or an appropriate default value)
