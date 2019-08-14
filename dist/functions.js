
/**
 * Adds two numbers.
 * @customfunction 
 * @param first First number.
 * @param second Second number.
 * @returns The sum of the two numbers.
 */

function addnumbers(first, second){
    return first + second;
}

/**
 * @customfunction
 * @param a First number
 * @returns square of number
 */
function evalModel(a){ return OfficeRuntime.storage.getItem("subscriptionId"); }

CustomFunctions.associate("ADDNUMBERS", addnumbers);
CustomFunctions.associate("EVALMODEL", evalModel);
